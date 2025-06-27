import { QuizQuestion } from '../types/quiz'
import { Region, CountryWithRegion } from '../types/region'
import { updateProgressWithCountry, isCountryLearned } from '../types/progress'

import { getCountriesByRegionAndLevel } from './countryService'
import { getFlagAssetByName } from './flagAssetService'
import { QuizRepository } from './quizRepository'

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
    const countries = await getCountriesByRegionAndLevel(region, level)

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

    // Get local flag asset for the correct country
    const flagAsset = getFlagAssetByName(correctCountry.name)
    if (!flagAsset) {
      throw new Error(`Flag asset not found for country: ${correctCountry.name}`)
    }

    // Generate wrong answers from the same region and level to make it challenging
    const wrongAnswerCountries = availableCountries
      .filter((country: CountryWithRegion) => country.name !== correctCountry.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    // If we don't have enough wrong answers from the same level, fill with any countries from same region
    if (wrongAnswerCountries.length < 3) {
      const allRegionCountries = await getCountriesByRegionAndLevel(region)
      const additionalWrongAnswers = allRegionCountries
        .filter(
          (country: CountryWithRegion) =>
            country.name !== correctCountry.name &&
            !wrongAnswerCountries.some((wac: CountryWithRegion) => wac.name === country.name) &&
            !usedFlags.includes(country.id.toString()) &&
            !learnedCountryIds.includes(country.id)
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 - wrongAnswerCountries.length)

      wrongAnswerCountries.push(...additionalWrongAnswers)
    }

    // If still not enough, fall back to any available countries from world region
    if (wrongAnswerCountries.length < 3) {
      const allAvailableCountries = await getCountriesByRegionAndLevel(Region.WORLD)
      const fallbackWrongAnswers = allAvailableCountries.filter(
          (country: CountryWithRegion) =>
            country.name !== correctCountry.name &&
            !wrongAnswerCountries.some((wac: CountryWithRegion) => wac.name === country.name) &&
            !usedFlags.includes(country.id.toString()) &&
            !learnedCountryIds.includes(country.id)
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 - wrongAnswerCountries.length)

      wrongAnswerCountries.push(...fallbackWrongAnswers)
    }

    const wrongAnswers = wrongAnswerCountries.map(country => country.name)

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
      flagAsset,
      correctAnswer: correctCountry.name,
      options
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
  await QuizRepository.saveQuizProgress(level, score)
}

export const getQuizProgress = async (level: number): Promise<number> => {
  return QuizRepository.getQuizProgress(level)
}

/**
 * Get the progress data for a specific region and level
 */
export const getRegionLevelProgress = async (region: Region, level: number) => {
  return QuizRepository.getRegionLevelProgress(region, level)
}

/**
 * Save progress data for a specific region and level
 */
export const saveRegionLevelProgress = async (region: Region, level: number, progress: any) => {
  await QuizRepository.saveRegionLevelProgress(region, level, progress)
}

/**
 * Record that a country has been learned (answered correctly)
 * This should be called when a user correctly answers a quiz question
 */
export const recordLearnedCountry = async (region: Region, level: number, countryId: number) => {
  const currentProgress = await QuizRepository.getRegionLevelProgress(region, level)
  const updatedProgress = updateProgressWithCountry(currentProgress, countryId)
  await QuizRepository.saveRegionLevelProgress(region, level, updatedProgress)
  return updatedProgress
}

/**
 * Check if a specific country has been learned in a region/level
 */
export const hasLearnedCountry = async (region: Region, level: number, countryId: number) => {
  const progress = await QuizRepository.getRegionLevelProgress(region, level)
  return isCountryLearned(progress, countryId)
}

/**
 * Get progress data for all region/level combinations that have been started
 */
export const getAllRegionProgress = async () => {
  return QuizRepository.getAllRegionProgress()
}

/**
 * Reset progress for a specific region and level
 */
export const resetRegionLevelProgress = async (region: Region, level: number) => {
  const countries = await getCountriesByRegionAndLevel(region, level)
  const emptyProgress = {
    learnedCountries: [],
    totalCountries: countries.length || 0,
    completionPercentage: 0,
    lastUpdated: new Date().toISOString()
  }
  await QuizRepository.saveRegionLevelProgress(region, level, emptyProgress)
}

/**
 * Get aggregated progress data for a region across all levels
 */
export const getRegionProgress = async (region: Region) => {
  let allLearnedCountries: number[] = []
  let totalCountries = 0

  const progressPromises = [];
  for (let level = 1; level <= 3; level++) {
    progressPromises.push(QuizRepository.getRegionLevelProgress(region, level));
  }
  const allLevelProgress = await Promise.all(progressPromises);

  allLevelProgress.forEach(levelProgress => {
    allLearnedCountries = [...allLearnedCountries, ...levelProgress.learnedCountries];
    totalCountries += levelProgress.totalCountries;
  });

  const uniqueLearnedCountries = [...new Set(allLearnedCountries)]
  const completionPercentage =
    totalCountries > 0 ? (uniqueLearnedCountries.length / totalCountries) * 100 : 0

  return {
    learnedCountries: uniqueLearnedCountries,
    totalCountries,
    completionPercentage,
    lastUpdated: new Date().toISOString()
  }
}

/**
 * Check if a specific level is completed for a region (e.g., 80% or more countries learned)
 */
export const isLevelCompleted = async (
  region: Region,
  level: number,
  completionThreshold: number = 80
) => {
  const progress = await QuizRepository.getRegionLevelProgress(region, level)
  return progress.completionPercentage >= completionThreshold
}

/**
 * Check if a level is unlocked (previous level must be completed)
 */
export const isLevelUnlocked = async (region: Region, level: number) => {
  if (level <= 1) return true
  const previousLevelCompleted = await isLevelCompleted(region, level - 1)
  return previousLevelCompleted
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
  if (questionsAnsweredAtLevel < minQuestionsPerLevel) {
    return currentLevel
  }

  const currentLevelCompleted = await isLevelCompleted(region, currentLevel)
  const nextLevel = currentLevel + 1

  if (currentLevelCompleted && nextLevel <= 3) {
    const nextLevelUnlocked = await isLevelUnlocked(region, nextLevel)
    if (nextLevelUnlocked) {
      return nextLevel
    }
  }

  return currentLevel
}

/**
 * Clear all progress data (both high scores and learned countries)
 */
export const clearAllProgress = async (): Promise<void> => {
  await QuizRepository.clearAllProgress()
}
