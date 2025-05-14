import { create } from 'zustand'

interface Country {
  id: number
  name: string
  flagUrl: string
}

interface CountryStore {
  countries: Country[]
  setCountries: (countries: Country[]) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  questionCount: number
  setQuestionCount: (count: number) => void
}

export const useCountryStore = create<CountryStore>(set => ({
  countries: [],
  setCountries: countries => set({ countries }),
  isLoading: false,
  setIsLoading: isLoading => set({ isLoading }),
  questionCount: 10, // default value
  setQuestionCount: count => set({ questionCount: count }),
}))
