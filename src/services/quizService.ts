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
  try {
    // Get countries filtered by both region and level
    const countries = getCountriesByRegionAndLevel(region, level)

    if (!countries || countries.length === 0) {
      // Provide more specific error messages
      const regionName = region.charAt(0).toUpperCase() + region.slice(1).replace('_', ' ')
      const levelNames = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
      const levelName = levelNames[level as keyof typeof levelNames] || `Level ${level}`

      throw new Error(
        `No countries available for ${levelName} level in ${regionName}. ` +
          `This might be because the countries data hasn't loaded yet or ` +
          `there are no countries assigned to this difficulty level in this region.`
      )
    }

    // Filter out countries that have already been used in this quiz session
    // AND countries that have already been learned
    const availableCountries = countries.filter(
      country =>
        !usedFlags.includes(country.id.toString()) && !learnedCountryIds.includes(country.id)
    )

    if (availableCountries.length === 0) {
      const regionName = region.charAt(0).toUpperCase() + region.slice(1).replace('_', ' ')
      const levelNames = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
      const levelName = levelNames[level as keyof typeof levelNames] || `Level ${level}`

      throw new Error(
        `All countries for ${levelName} level in ${regionName} have been used or learned. ` +
          `Try restarting the quiz or selecting a different region/level.`
      )
    }

    // Randomly select a country for the correct answer
    const correctCountryIndex = Math.floor(Math.random() * availableCountries.length)
    const correctCountry = availableCountries[correctCountryIndex]

    // Generate 3 random wrong answers from the same region and level
    const wrongAnswers = availableCountries
      .filter(
        (country, index) => index !== correctCountryIndex && country.name !== correctCountry.name
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(country => country.name)
      // Remove any duplicate names that might still exist
      .filter((name, index, arr) => arr.indexOf(name) === index)

    // If we don't have enough unique countries in this region/level for 4 options,
    // try to get countries from other levels in the same region
    if (wrongAnswers.length < 3) {
      try {
        // Get all countries from the region (all levels) as backup
        const allRegionCountries = [1, 2, 3]
          .flatMap(lvl => getCountriesByRegionAndLevel(region, lvl))
          .filter(
            country => country.name !== correctCountry.name && !wrongAnswers.includes(country.name)
          )

        const additionalAnswers = allRegionCountries
          .sort(() => Math.random() - 0.5)
          .slice(0, 3 - wrongAnswers.length)
          .map(country => country.name)
          // Ensure no duplicates
          .filter((name, index, arr) => arr.indexOf(name) === index)

        wrongAnswers.push(...additionalAnswers)
      } catch (error) {
        console.warn('Could not get backup countries for wrong answers:', error)
      }
    }

    // If we still don't have enough unique options (very rare edge case),
    // generate placeholder options to ensure we always have 4 total options
    const placeholderIndex = wrongAnswers.length
    while (wrongAnswers.length < 3) {
      const placeholder = `Option ${placeholderIndex + wrongAnswers.length + 1}`
      if (!wrongAnswers.includes(placeholder)) {
        wrongAnswers.push(placeholder)
      } else {
        wrongAnswers.push(`Option ${Date.now()}`) // Fallback with timestamp
      }
    }

    // Combine correct and wrong answers, then shuffle
    const options = [...wrongAnswers, correctCountry.name]
      // Final deduplication check
      .filter((name, index, arr) => arr.indexOf(name) === index)
      .sort(() => Math.random() - 0.5)

    // Ensure we have exactly 4 unique options
    if (options.length !== 4) {
      console.warn(`Expected 4 options but got ${options.length}:`, options)
      // Add the correct answer back if it was filtered out
      if (!options.includes(correctCountry.name)) {
        options.push(correctCountry.name)
      }
      // Trim to 4 options if we somehow have more
      while (options.length > 4) {
        options.pop()
      }
    }

    return {
      id: correctCountry.id.toString(),
      flagUrl: correctCountry.flagUrl,
      correctAnswer: correctCountry.name,
      options,
    }
  } catch (error) {
    // Re-throw with additional context if it's our custom error
    if (error instanceof Error) {
      throw error
    }

    // Handle unexpected errors
    throw new Error(
      `Unexpected error generating quiz question: ${error}. ` +
        `Please try restarting the app or check your internet connection.`
    )
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
    // Return empty progress as fallback - use 0 as totalCountries if countries data isn't loaded
    const countries = getCountriesByRegionAndLevel(region, level)
    return createEmptyProgress(countries.length || 0)
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
    const emptyProgress = createEmptyProgress(countries.length || 0)
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
