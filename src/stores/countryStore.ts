import { create } from 'zustand'
import { Region, CountryWithRegion } from '../types/region'

interface Country {
  id: number
  name: string
  flagUrl: string
}

interface CountryStore {
  countries: CountryWithRegion[]
  setCountries: (countries: CountryWithRegion[]) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  questionCount: number
  setQuestionCount: (count: number) => void
  selectedLevel: number
  setSelectedLevel: (level: number) => void
  selectedRegion: Region
  setSelectedRegion: (region: Region) => void
}

export const useCountryStore = create<CountryStore>(set => ({
  countries: [],
  setCountries: countries => set({ countries }),
  isLoading: false,
  setIsLoading: isLoading => set({ isLoading }),
  questionCount: 10, // default value
  setQuestionCount: count => set({ questionCount: count }),
  selectedLevel: 1, // default to easy level
  setSelectedLevel: level => set({ selectedLevel: level }),
  selectedRegion: Region.WORLD, // default to world region
  setSelectedRegion: region => set({ selectedRegion: region }),
}))

// Backward compatibility export
export type { Country }
