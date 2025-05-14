import { QuizQuestion } from '../types/quiz'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCountries } from './countryService'

const PROGRESS_KEY = '@quiz_progress'

interface Country {
  id: number
  name: string
  flagUrl: string
}

export const generateQuizQuestion = async (): Promise<QuizQuestion> => {
  const countries = getCountries()

  if (!countries || countries.length === 0) {
    throw new Error('Failed to fetch countries')
  }

  // Randomly select a country for the correct answer
  const correctCountryIndex = Math.floor(Math.random() * countries.length)
  const correctCountry = countries[correctCountryIndex]

  // Generate 3 random wrong answers
  const wrongAnswers = countries
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

export const saveQuizProgress = async (score: number): Promise<void> => {
  try {
    const currentProgress = await getQuizProgress()
    const newProgress = Math.max(currentProgress, score)
    await AsyncStorage.setItem(PROGRESS_KEY, newProgress.toString())
  } catch (error) {
    console.error('Error saving quiz progress:', error)
  }
}

export const getQuizProgress = async (): Promise<number> => {
  try {
    const progress = await AsyncStorage.getItem(PROGRESS_KEY)
    return progress ? parseInt(progress, 10) : 0
  } catch (error) {
    console.error('Error getting quiz progress:', error)
    return 0
  }
}
