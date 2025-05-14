import { QuizQuestion } from '../types/quiz'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCountryStore } from '../stores/countryStore'

const PROGRESS_KEY = '@quiz_progress'

interface Country {
  id: number
  name: string
  flagUrl: string
}

interface CountryResponse {
  name: {
    common: string
  }
  flags: {
    svg?: string
    png?: string
  }
}

async function fetchCountries(): Promise<Country[]> {
  const store = useCountryStore.getState()

  // Return cached countries if available
  if (store.countries.length > 0) {
    return store.countries
  }

  try {
    store.setIsLoading(true)
    const response = await fetch('https://restcountries.com/v3.1/all')
    const data = await response.json()

    const countries = data.map((country: CountryResponse, index: number) => ({
      id: index + 1,
      name: country.name.common,
      flagUrl: country.flags?.png,
    }))

    // Cache the countries
    store.setCountries(countries)
    return countries
  } catch (error) {
    console.error('Error fetching countries:', error)
    return []
  } finally {
    store.setIsLoading(false)
  }
}

export const generateQuizQuestion = async (): Promise<QuizQuestion> => {
  const countries = await fetchCountries()

  if (countries.length === 0) {
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
