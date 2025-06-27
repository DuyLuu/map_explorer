import AsyncStorage from '@react-native-async-storage/async-storage'

import {
  RegionLevelProgress,
  generateProgressKey,
  createEmptyProgress,
  PROGRESS_KEYS
} from '../types/progress'
import { Region } from '../types/region'

import { getCountriesByRegionAndLevel } from './countryService'

const QUIZ_PROGRESS_KEY_PREFIX = '@quiz_progress_level_'

export const QuizRepository = {
  async saveQuizProgress(level: number, score: number): Promise<void> {
    try {
      const currentProgress = await this.getQuizProgress(level)
      const newProgress = Math.max(currentProgress, score)
      await AsyncStorage.setItem(`${QUIZ_PROGRESS_KEY_PREFIX}${level}`, newProgress.toString())
    } catch (error) {
      console.error('Error saving quiz progress:', error)
    }
  },

  async getQuizProgress(level: number): Promise<number> {
    try {
      const progress = await AsyncStorage.getItem(`${QUIZ_PROGRESS_KEY_PREFIX}${level}`)
      return progress ? parseInt(progress, 10) : 0
    } catch (error) {
      console.error('Error getting quiz progress:', error)
      return 0
    }
  },

  async getRegionLevelProgress(region: Region, level: number): Promise<RegionLevelProgress> {
    try {
      const key = generateProgressKey(region, level)
      const storedData = await AsyncStorage.getItem(key)

      if (storedData) {
        return JSON.parse(storedData) as RegionLevelProgress
      }

      const countries = await getCountriesByRegionAndLevel(region, level)
      const totalCountries = countries.length
      return createEmptyProgress(totalCountries)
    } catch (error) {
      console.error('Error getting region level progress:', error)
      const countries = await getCountriesByRegionAndLevel(region, level)
      return createEmptyProgress(countries.length || 0)
    }
  },

  async saveRegionLevelProgress(
    region: Region,
    level: number,
    progress: RegionLevelProgress
  ): Promise<void> {
    try {
      const key = generateProgressKey(region, level)
      await AsyncStorage.setItem(key, JSON.stringify(progress))
    } catch (error) {
      console.error('Error saving region level progress:', error)
    }
  },

  async getAllRegionProgress(): Promise<Record<string, RegionLevelProgress>> {
    try {
      const allKeys = await AsyncStorage.getAllKeys()
      const progressKeys = allKeys.filter(key => key.startsWith(PROGRESS_KEYS.REGION_PROGRESS))

      const progressData: Record<string, RegionLevelProgress> = {}

      const progressEntries = await AsyncStorage.multiGet(progressKeys);

      progressEntries.forEach(([key, storedData]) => {
        if (storedData) {
          const identifier = key.replace(PROGRESS_KEYS.REGION_PROGRESS, '');
          progressData[identifier] = JSON.parse(storedData);
        }
      });
      return progressData
    } catch (error) {
      console.error('Error getting all region progress:', error)
      return {}
    }
  },

  async clearAllProgress(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys()
      const progressKeys = allKeys.filter(
        key =>
          key.startsWith(QUIZ_PROGRESS_KEY_PREFIX) || key.startsWith(PROGRESS_KEYS.REGION_PROGRESS)
      )
      await AsyncStorage.multiRemove(progressKeys)
    } catch (error) {
      console.error('Error clearing all progress:', error)
    }
  }
}
