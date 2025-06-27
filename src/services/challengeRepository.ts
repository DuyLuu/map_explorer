import AsyncStorage from '@react-native-async-storage/async-storage'

import { ChallengeScore, ChallengeStats } from '../services/challengeScoringService'

const STORAGE_KEYS = {
  CHALLENGE_BEST_SCORE: '@challenge_best_score',
  CHALLENGE_STATS: '@challenge_stats',
  CHALLENGE_HISTORY: '@challenge_history'
}

export const ChallengeRepository = {
  async getChallengeScore(): Promise<ChallengeScore | null> {
    try {
      const scoreData = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_BEST_SCORE)
      return scoreData ? JSON.parse(scoreData) : null
    } catch (error) {
      console.error('Error getting challenge score from repository:', error)
      return null
    }
  },

  async saveChallengeScore(score: ChallengeScore): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_BEST_SCORE, JSON.stringify(score))
    } catch (error) {
      console.error('Error saving challenge score to repository:', error)
    }
  },

  async getChallengeStats(): Promise<ChallengeStats | null> {
    try {
      const statsData = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_STATS)
      return statsData ? JSON.parse(statsData) : null
    } catch (error) {
      console.error('Error getting challenge stats from repository:', error)
      return null
    }
  },

  async saveChallengeStats(stats: ChallengeStats): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_STATS, JSON.stringify(stats))
    } catch (error) {
      console.error('Error saving challenge stats to repository:', error)
    }
  },

  async getChallengeHistory(): Promise<ChallengeScore[]> {
    try {
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.CHALLENGE_HISTORY)
      return historyData ? JSON.parse(historyData) : []
    } catch (error) {
      console.error('Error getting challenge history from repository:', error)
      return []
    }
  },

  async saveChallengeHistory(history: ChallengeScore[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CHALLENGE_HISTORY, JSON.stringify(history))
    } catch (error) {
      console.error('Error saving challenge history to repository:', error)
    }
  },

  async clearChallengeData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CHALLENGE_BEST_SCORE,
        STORAGE_KEYS.CHALLENGE_STATS,
        STORAGE_KEYS.CHALLENGE_HISTORY
      ])
    } catch (error) {
      console.error('Error clearing challenge data from repository:', error)
    }
  }
}
