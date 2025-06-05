import { Region } from './region'

// Storage key prefixes following existing patterns
export const PROGRESS_KEYS = {
  // Existing pattern for high scores per level
  LEVEL_SCORE: '@quiz_progress_level_',

  // New pattern for region-based country progress
  REGION_PROGRESS: '@country_progress_',
} as const

// Structure for tracking learned countries in a specific region and level
export interface RegionLevelProgress {
  learnedCountries: number[] // Array of country IDs that have been correctly answered
  totalCountries: number // Total number of countries available for this region/level
  lastUpdated: string // ISO timestamp of last update
  completionPercentage: number // Calculated percentage (learnedCountries.length / totalCountries * 100)
}

// Structure for overall progress across all regions and levels
export interface UserProgress {
  [key: string]: RegionLevelProgress // Key format: "region_level" (e.g., "europe_1", "asia_2")
}

// Helper type for progress storage keys
export type ProgressStorageKey = `${typeof PROGRESS_KEYS.REGION_PROGRESS}${Region}_${number}`

// Utility functions for generating storage keys
export const generateProgressKey = (region: Region, level: number): ProgressStorageKey => {
  return `${PROGRESS_KEYS.REGION_PROGRESS}${region}_${level}` as ProgressStorageKey
}

export const parseProgressKey = (key: string): { region: Region; level: number } | null => {
  const prefix = PROGRESS_KEYS.REGION_PROGRESS
  if (!key.startsWith(prefix)) return null

  const suffix = key.substring(prefix.length)
  const parts = suffix.split('_')

  if (parts.length < 2) return null

  const level = parseInt(parts[parts.length - 1], 10)
  const region = parts.slice(0, -1).join('_') as Region

  if (isNaN(level) || !Object.values(Region).includes(region)) return null

  return { region, level }
}

// Helper function to create an empty progress entry
export const createEmptyProgress = (totalCountries: number): RegionLevelProgress => ({
  learnedCountries: [],
  totalCountries,
  lastUpdated: new Date().toISOString(),
  completionPercentage: 0,
})

// Helper function to update progress with a new learned country
export const updateProgressWithCountry = (
  progress: RegionLevelProgress,
  countryId: number
): RegionLevelProgress => {
  // Avoid duplicates
  if (progress.learnedCountries.includes(countryId)) {
    return progress
  }

  const updatedCountries = [...progress.learnedCountries, countryId]
  const completionPercentage = (updatedCountries.length / progress.totalCountries) * 100

  return {
    ...progress,
    learnedCountries: updatedCountries,
    lastUpdated: new Date().toISOString(),
    completionPercentage: Math.round(completionPercentage * 100) / 100, // Round to 2 decimal places
  }
}

// Helper function to check if a country has been learned
export const isCountryLearned = (progress: RegionLevelProgress, countryId: number): boolean => {
  return progress.learnedCountries.includes(countryId)
}

// Helper function to get overall completion status
export const getOverallProgress = (
  userProgress: UserProgress
): {
  totalLearned: number
  totalAvailable: number
  overallPercentage: number
} => {
  let totalLearned = 0
  let totalAvailable = 0

  Object.values(userProgress).forEach(regionProgress => {
    totalLearned += regionProgress.learnedCountries.length
    totalAvailable += regionProgress.totalCountries
  })

  const overallPercentage = totalAvailable > 0 ? (totalLearned / totalAvailable) * 100 : 0

  return {
    totalLearned,
    totalAvailable,
    overallPercentage: Math.round(overallPercentage * 100) / 100,
  }
}
