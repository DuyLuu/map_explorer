import AsyncStorage from '@react-native-async-storage/async-storage'
import { CHALLENGE_QUESTIONS } from 'features/challenge/constants'

export interface ChallengeScore {
  score: number
  totalQuestions: number
  timeSpent: number // in milliseconds
  levelReached: number // highest level reached (1-3)
  achievedAt: string // ISO timestamp
  breakdown: {
    easyCorrect: number
    mediumCorrect: number
    hardCorrect: number
    flagQuestions: number
    mapQuestions: number
  }
  bonusPoints: number
  finalScore: number // score + bonusPoints
}

export interface ChallengeStats {
  bestScore: ChallengeScore | null
  totalAttempts: number
  averageScore: number
  bestStreak: number
  currentStreak: number
  totalTimeSpent: number
  completionStats: {
    completedEasy: number
    completedMedium: number
    completedHard: number
    perfect300: number
  }
}

const STORAGE_KEYS = {
  CHALLENGE_BEST_SCORE: '@challenge_best_score',
  CHALLENGE_STATS: '@challenge_stats',
  CHALLENGE_HISTORY: '@challenge_history'
}

/**
 * Calculate score with progressive difficulty multipliers
 */
export const calculateChallengeScore = (
  questionsCorrect: number,
  currentLevel: number,
  timeSpent: number,
  breakdown: ChallengeScore['breakdown']
): { baseScore: number; bonusPoints: number; finalScore: number } => {
  // Base score is just the number of correct answers
  const baseScore = questionsCorrect

  let bonusPoints = 0

  // Level progression bonuses
  if (breakdown.mediumCorrect > 0) {
    bonusPoints += breakdown.mediumCorrect * 0.5 // 50% bonus for medium questions
  }
  if (breakdown.hardCorrect > 0) {
    bonusPoints += breakdown.hardCorrect * 1.0 // 100% bonus for hard questions
  }

  // Speed bonus (if completed quickly)
  const timeSpentMinutes = timeSpent / (1000 * 60)
  if (questionsCorrect >= 200 && timeSpentMinutes < 30) {
    bonusPoints += Math.floor((30 - timeSpentMinutes) * 2) // 2 points per minute saved
  }

  // Perfect completion bonus
  if (questionsCorrect === CHALLENGE_QUESTIONS) {
    bonusPoints += 50 // Perfect completion bonus
  }

  // Streak bonuses for reaching higher levels
  if (currentLevel >= 2) {
    bonusPoints += 10 // Reached medium level
  }
  if (currentLevel >= 3) {
    bonusPoints += 20 // Reached hard level
  }

  const finalScore = Math.floor(baseScore + bonusPoints)

  return { baseScore, bonusPoints, finalScore }
}

/**
 * Save a challenge score if it's a new personal best
 */
export const saveChallengeScore = async (scoreData: {
  score: number
  totalQuestions: number
  timeSpent: number
  levelReached: number
  breakdown: ChallengeScore['breakdown']
}): Promise<{ isNewRecord: boolean; challengeScore: ChallengeScore }> => {
  try {
    const { baseScore, bonusPoints, finalScore } = calculateChallengeScore(
      scoreData.score,
      scoreData.levelReached,
      scoreData.timeSpent,
      scoreData.breakdown
    )

    const challengeScore: ChallengeScore = {
      score: scoreData.score,
      totalQuestions: scoreData.totalQuestions,
      timeSpent: scoreData.timeSpent,
      levelReached: scoreData.levelReached,
      achievedAt: new Date().toISOString(),
      breakdown: scoreData.breakdown,
      bonusPoints,
      finalScore
    }

    // Get current best score
    const currentBest = await getChallengeScore()
    const isNewRecord = !currentBest || finalScore > currentBest.finalScore

    // Save if it's a new record
    if (isNewRecord) {
      await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_BEST_SCORE, JSON.stringify(challengeScore))
    }

    // Update stats regardless
    await updateChallengeStats(challengeScore)

    // Save to history
    await addToHistory(challengeScore)

    return { isNewRecord, challengeScore }
  } catch (error) {
    console.error('Error saving challenge score:', error)
    throw error
  }
}

/**
 * Get the current best challenge score
 */
export const getChallengeScore = async (): Promise<ChallengeScore | null> => {
  try {
    const scoreData = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_BEST_SCORE)
    return scoreData ? JSON.parse(scoreData) : null
  } catch (error) {
    console.error('Error getting challenge score:', error)
    return null
  }
}

/**
 * Get challenge statistics
 */
export const getChallengeStats = async (): Promise<ChallengeStats> => {
  try {
    const statsData = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_STATS)
    if (statsData) {
      return JSON.parse(statsData)
    }

    // Return default stats if none exist
    return {
      bestScore: await getChallengeScore(),
      totalAttempts: 0,
      averageScore: 0,
      bestStreak: 0,
      currentStreak: 0,
      totalTimeSpent: 0,
      completionStats: {
        completedEasy: 0,
        completedMedium: 0,
        completedHard: 0,
        perfect300: 0
      }
    }
  } catch (error) {
    console.error('Error getting challenge stats:', error)
    // Return default stats on error
    return {
      bestScore: null,
      totalAttempts: 0,
      averageScore: 0,
      bestStreak: 0,
      currentStreak: 0,
      totalTimeSpent: 0,
      completionStats: {
        completedEasy: 0,
        completedMedium: 0,
        completedHard: 0,
        perfect300: 0
      }
    }
  }
}

/**
 * Update challenge statistics
 */
const updateChallengeStats = async (newScore: ChallengeScore): Promise<void> => {
  try {
    const currentStats = await getChallengeStats()

    const updatedStats: ChallengeStats = {
      bestScore:
        currentStats.bestScore && currentStats.bestScore.finalScore >= newScore.finalScore
          ? currentStats.bestScore
          : newScore,
      totalAttempts: currentStats.totalAttempts + 1,
      averageScore: Math.floor(
        (currentStats.averageScore * currentStats.totalAttempts + newScore.finalScore) /
          (currentStats.totalAttempts + 1)
      ),
      bestStreak: Math.max(currentStats.bestStreak, newScore.score),
      currentStreak: newScore.score, // Reset to current attempt
      totalTimeSpent: currentStats.totalTimeSpent + newScore.timeSpent,
      completionStats: {
        completedEasy:
          currentStats.completionStats.completedEasy + (newScore.levelReached >= 1 ? 1 : 0),
        completedMedium:
          currentStats.completionStats.completedMedium + (newScore.levelReached >= 2 ? 1 : 0),
        completedHard:
          currentStats.completionStats.completedHard + (newScore.levelReached >= 3 ? 1 : 0),
        perfect300: currentStats.completionStats.perfect300 + (newScore.score === 300 ? 1 : 0)
      }
    }

    await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_STATS, JSON.stringify(updatedStats))
  } catch (error) {
    console.error('Error updating challenge stats:', error)
  }
}

/**
 * Add score to history (keep last 10 attempts)
 */
const addToHistory = async (score: ChallengeScore): Promise<void> => {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_HISTORY)
    const history: ChallengeScore[] = historyData ? JSON.parse(historyData) : []

    // Add new score to beginning of history
    history.unshift(score)

    // Keep only last 10 attempts
    const trimmedHistory = history.slice(0, 10)

    await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_HISTORY, JSON.stringify(trimmedHistory))
  } catch (error) {
    console.error('Error adding to challenge history:', error)
  }
}

/**
 * Get challenge history (last 10 attempts)
 */
export const getChallengeHistory = async (): Promise<ChallengeScore[]> => {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_HISTORY)
    return historyData ? JSON.parse(historyData) : []
  } catch (error) {
    console.error('Error getting challenge history:', error)
    return []
  }
}

/**
 * Clear all challenge data (for testing or reset purposes)
 */
export const clearChallengeData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CHALLENGE_BEST_SCORE,
      STORAGE_KEYS.CHALLENGE_STATS,
      STORAGE_KEYS.CHALLENGE_HISTORY
    ])
  } catch (error) {
    console.error('Error clearing challenge data:', error)
  }
}

/**
 * Get formatted time string
 */
export const formatTime = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * Get score description based on performance
 */
export const getScoreDescription = (score: number): string => {
  if (score === CHALLENGE_QUESTIONS) return 'PERFECT! LEGENDARY!'
  if (score >= 250) return 'Incredible! Master Explorer'
  if (score >= 200) return 'Amazing! Expert Navigator'
  if (score >= 150) return 'Great! Geography Guru'
  if (score >= 100) return 'Good! World Traveler'
  if (score >= 50) return 'Not bad! Keep exploring'
  return 'Keep trying! Practice makes perfect'
}
