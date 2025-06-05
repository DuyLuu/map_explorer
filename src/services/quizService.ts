import { QuizQuestion } from '../types/quiz'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCountriesByRegionAndLevel } from './countryService'
import { Region } from '../types/region'
import {
  RegionLevelProgress,
  generateProgressKey,
  createEmptyProgress,
  updateProgressWithCountry,
  isCountryLearned,
  PROGRESS_KEYS,
} from '../types/progress'

const PROGRESS_KEY_PREFIX = '@quiz_progress_level_'

interface Country {
  id: number
  name: string
  flagUrl: string
  level: number
}

export const generateQuizQuestion = async (
  level: number,
  region: Region,
  usedFlags: string[] = [],
  learnedCountryIds: number[] = []
): Promise<QuizQuestion> => {
  // Get countries filtered by both region and level
  const countries = getCountriesByRegionAndLevel(region, level)

  if (!countries || countries.length === 0) {
    throw new Error(`No countries available for level ${level} in region ${region}`)
  }

  // Filter out countries that have already been used in this quiz session
  // AND countries that have already been learned
  const availableCountries = countries.filter(
    country => !usedFlags.includes(country.id.toString()) && !learnedCountryIds.includes(country.id)
  )

  if (availableCountries.length === 0) {
    throw new Error(`No unused countries available for level ${level} in region ${region}`)
  }

  // Randomly select a country for the correct answer
  const correctCountryIndex = Math.floor(Math.random() * availableCountries.length)
  const correctCountry = availableCountries[correctCountryIndex]

  // Generate 3 random wrong answers from the same region and level
  const wrongAnswers = availableCountries
    .filter((_, index) => index !== correctCountryIndex)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(country => country.name)

  // If we don't have enough countries in this region/level for 4 options,
  // fill with correct answer duplicates (this shouldn't happen in practice)
  while (wrongAnswers.length < 3) {
    wrongAnswers.push(correctCountry.name)
  }

  // Combine correct and wrong answers, then shuffle
  const options = [...wrongAnswers, correctCountry.name].sort(() => Math.random() - 0.5)

  return {
    id: correctCountry.id.toString(),
    flagUrl: correctCountry.flagUrl,
    correctAnswer: correctCountry.name,
    options,
  }
}

export const saveQuizProgress = async (level: number, score: number): Promise<void> => {
  try {
    const currentProgress = await getQuizProgress(level)
    const newProgress = Math.max(currentProgress, score)
    await AsyncStorage.setItem(`${PROGRESS_KEY_PREFIX}${level}`, newProgress.toString())
  } catch (error) {
    console.error('Error saving quiz progress:', error)
  }
}

export const getQuizProgress = async (level: number): Promise<number> => {
  try {
    const progress = await AsyncStorage.getItem(`${PROGRESS_KEY_PREFIX}${level}`)
    return progress ? parseInt(progress, 10) : 0
  } catch (error) {
    console.error('Error getting quiz progress:', error)
    return 0
  }
}

// New progress tracking functions for learned countries per region/level

/**
 * Get the progress data for a specific region and level
 */
export const getRegionLevelProgress = async (
  region: Region,
  level: number
): Promise<RegionLevelProgress> => {
  try {
    const key = generateProgressKey(region, level)
    const storedData = await AsyncStorage.getItem(key)

    if (storedData) {
      return JSON.parse(storedData) as RegionLevelProgress
    }

    // If no data exists, create empty progress with total country count
    const countries = getCountriesByRegionAndLevel(region, level)
    const totalCountries = countries.length
    return createEmptyProgress(totalCountries)
  } catch (error) {
    console.error('Error getting region level progress:', error)
    // Return empty progress as fallback
    const countries = getCountriesByRegionAndLevel(region, level)
    return createEmptyProgress(countries.length)
  }
}

/**
 * Save progress data for a specific region and level
 */
export const saveRegionLevelProgress = async (
  region: Region,
  level: number,
  progress: RegionLevelProgress
): Promise<void> => {
  try {
    const key = generateProgressKey(region, level)
    await AsyncStorage.setItem(key, JSON.stringify(progress))
  } catch (error) {
    console.error('Error saving region level progress:', error)
  }
}

/**
 * Record that a country has been learned (answered correctly)
 * This should be called when a user correctly answers a quiz question
 */
export const recordLearnedCountry = async (
  region: Region,
  level: number,
  countryId: number
): Promise<RegionLevelProgress> => {
  try {
    // Get current progress
    const currentProgress = await getRegionLevelProgress(region, level)

    // Update progress with the new learned country
    const updatedProgress = updateProgressWithCountry(currentProgress, countryId)

    // Save the updated progress
    await saveRegionLevelProgress(region, level, updatedProgress)

    return updatedProgress
  } catch (error) {
    console.error('Error recording learned country:', error)
    // Return current progress on error
    return await getRegionLevelProgress(region, level)
  }
}

/**
 * Check if a specific country has been learned in a region/level
 */
export const hasLearnedCountry = async (
  region: Region,
  level: number,
  countryId: number
): Promise<boolean> => {
  try {
    const progress = await getRegionLevelProgress(region, level)
    return isCountryLearned(progress, countryId)
  } catch (error) {
    console.error('Error checking if country is learned:', error)
    return false
  }
}

/**
 * Get progress data for all region/level combinations that have been started
 */
export const getAllRegionProgress = async (): Promise<Record<string, RegionLevelProgress>> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys()
    const progressKeys = allKeys.filter(key => key.startsWith(PROGRESS_KEYS.REGION_PROGRESS))

    const progressData: Record<string, RegionLevelProgress> = {}

    for (const key of progressKeys) {
      const storedData = await AsyncStorage.getItem(key)
      if (storedData) {
        // Remove the prefix to get the region_level identifier
        const identifier = key.replace(PROGRESS_KEYS.REGION_PROGRESS, '')
        progressData[identifier] = JSON.parse(storedData)
      }
    }

    return progressData
  } catch (error) {
    console.error('Error getting all region progress:', error)
    return {}
  }
}

/**
 * Reset progress for a specific region and level
 */
export const resetRegionLevelProgress = async (region: Region, level: number): Promise<void> => {
  try {
    const countries = getCountriesByRegionAndLevel(region, level)
    const emptyProgress = createEmptyProgress(countries.length)
    await saveRegionLevelProgress(region, level, emptyProgress)
  } catch (error) {
    console.error('Error resetting region level progress:', error)
  }
}

/**
 * Get aggregated progress data for a region across all levels
 */
export const getRegionProgress = async (region: Region): Promise<RegionLevelProgress> => {
  try {
    let allLearnedCountries: number[] = []
    let totalCountries = 0

    // Aggregate progress across all levels (1, 2, 3)
    for (let level = 1; level <= 3; level++) {
      const levelProgress = await getRegionLevelProgress(region, level)
      allLearnedCountries = [...allLearnedCountries, ...levelProgress.learnedCountries]
      totalCountries += levelProgress.totalCountries
    }

    // Remove duplicates in case a country appears in multiple levels (shouldn't happen but safety check)
    const uniqueLearnedCountries = [...new Set(allLearnedCountries)]
    const completionPercentage =
      totalCountries > 0 ? (uniqueLearnedCountries.length / totalCountries) * 100 : 0

    return {
      learnedCountries: uniqueLearnedCountries,
      totalCountries,
      completionPercentage,
      lastUpdated: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error getting region progress:', error)
    // Return empty progress as fallback
    return createEmptyProgress(0)
  }
}

/**
 * Check if a specific level is completed for a region (e.g., 80% or more countries learned)
 */
export const isLevelCompleted = async (
  region: Region,
  level: number,
  completionThreshold: number = 80
): Promise<boolean> => {
  try {
    const progress = await getRegionLevelProgress(region, level)
    return progress.completionPercentage >= completionThreshold
  } catch (error) {
    console.error('Error checking level completion:', error)
    return false
  }
}

/**
 * Check if a level is unlocked (previous level must be completed)
 */
export const isLevelUnlocked = async (region: Region, level: number): Promise<boolean> => {
  try {
    // Level 1 (Easy) is always unlocked
    if (level <= 1) return true

    // Check if previous level is completed
    const previousLevelCompleted = await isLevelCompleted(region, level - 1)
    return previousLevelCompleted
  } catch (error) {
    console.error('Error checking level unlock status:', error)
    return level <= 1 // Default to unlocking only level 1 on error
  }
}

/**
 * Get the next available level for progression within a quiz
 */
export const getNextQuizLevel = async (
  region: Region,
  currentLevel: number,
  questionsAnsweredAtLevel: number,
  minQuestionsPerLevel: number = 3
): Promise<number> => {
  try {
    // If we haven't answered enough questions at current level, stay at current level
    if (questionsAnsweredAtLevel < minQuestionsPerLevel) {
      return currentLevel
    }

    // Check if current level is completed and next level is unlocked
    const currentLevelCompleted = await isLevelCompleted(region, currentLevel)
    const nextLevel = currentLevel + 1

    // If current level is completed and we haven't reached max level (3), progress
    if (currentLevelCompleted && nextLevel <= 3) {
      const nextLevelUnlocked = await isLevelUnlocked(region, nextLevel)
      if (nextLevelUnlocked) {
        return nextLevel
      }
    }

    return currentLevel
  } catch (error) {
    console.error('Error determining next quiz level:', error)
    return currentLevel
  }
}

/**
 * Clear all progress data (both high scores and learned countries)
 */
export const clearAllProgress = async (): Promise<void> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys()
    const progressKeys = allKeys.filter(
      key => key.startsWith(PROGRESS_KEY_PREFIX) || key.startsWith(PROGRESS_KEYS.REGION_PROGRESS)
    )

    await AsyncStorage.multiRemove(progressKeys)
  } catch (error) {
    console.error('Error clearing all progress:', error)
  }
}
