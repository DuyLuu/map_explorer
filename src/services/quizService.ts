import { QuizQuestion } from '../types/quiz'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCountries } from './countryService'

const PROGRESS_KEY_PREFIX = '@quiz_progress_level_'

interface Country {
  id: number
  name: string
  flagUrl: string
  level: number
}

export const generateQuizQuestion = async (
  level: number,
  usedFlags: string[] = []
): Promise<QuizQuestion> => {
  const countries = getCountries()

  if (!countries || countries.length === 0) {
    throw new Error('Failed to fetch countries')
  }

  // Filter countries by level and exclude used flags
  const levelCountries = countries.filter(
    (country: Country) => 
      country.level === level && 
      !usedFlags.includes(country.id.toString())
  )

  if (levelCountries.length === 0) {
    throw new Error(`No countries available for level ${level}`)
  }

  // Randomly select a country for the correct answer
  const correctCountryIndex = Math.floor(Math.random() * levelCountries.length)
  const correctCountry = levelCountries[correctCountryIndex]

  // Generate 3 random wrong answers from the same level
  const wrongAnswers = levelCountries
    .filter((_: Country, index: number) => index !== correctCountryIndex)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((country: Country) => country.name)

  // Combine correct and wrong answers, then shuffle
  const options = [...wrongAnswers, correctCountry.name].sort(
    () => Math.random() - 0.5,
  )

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
