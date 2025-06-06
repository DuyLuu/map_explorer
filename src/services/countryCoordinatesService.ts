import { Region as MapRegion } from 'react-native-maps'
import { getCountryRegion } from './regionService'
import { Region, REGION_INFO } from '../types/region'
import countryCoordinatesData from '../data/countryCoordinates.json'

export interface CountryCoordinates {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
  area?: number
}

// Bundled coordinates data for all countries (generated from APIs)
const BUNDLED_COORDINATES = countryCoordinatesData as Record<string, CountryCoordinates>

// Fallback coordinates for specific cases or when bundled data needs adjustment
const COUNTRY_COORDINATES_FALLBACK: Record<string, CountryCoordinates> = {
  // Major countries with broader view for challenge (can override bundled data)
  'United States': {
    latitude: 39.8283,
    longitude: -98.5795,
    latitudeDelta: 45,
    longitudeDelta: 60,
  },
  China: {
    latitude: 35.8617,
    longitude: 104.1954,
    latitudeDelta: 30,
    longitudeDelta: 40,
  },
  Russia: {
    latitude: 61.524,
    longitude: 105.3188,
    latitudeDelta: 50,
    longitudeDelta: 80,
  },
  Canada: {
    latitude: 56.1304,
    longitude: -106.3468,
    latitudeDelta: 50,
    longitudeDelta: 70,
  },
  Australia: {
    latitude: -25.2744,
    longitude: 133.7751,
    latitudeDelta: 30,
    longitudeDelta: 40,
  },
}

/**
 * Get specific map region for a country (main function - fully offline)
 * Uses bundled coordinates with fallbacks for edge cases
 */
export function getCountryMapRegion(countryName: string): MapRegion {
  // First check if we have specific fallback coordinates (for game balance)
  const fallbackCoords = COUNTRY_COORDINATES_FALLBACK[countryName]
  if (fallbackCoords) {
    console.log(`🎯 Using game-balanced coordinates for ${countryName}`)
    return {
      latitude: fallbackCoords.latitude,
      longitude: fallbackCoords.longitude,
      latitudeDelta: fallbackCoords.latitudeDelta,
      longitudeDelta: fallbackCoords.longitudeDelta,
    }
  }

  // Check bundled coordinates data
  const bundledCoords = BUNDLED_COORDINATES[countryName]
  if (bundledCoords) {
    console.log(`📦 Using bundled coordinates for ${countryName}`)
    return {
      latitude: bundledCoords.latitude,
      longitude: bundledCoords.longitude,
      latitudeDelta: bundledCoords.latitudeDelta,
      longitudeDelta: bundledCoords.longitudeDelta,
    }
  }

  // Fall back to the region bounds (this adds more challenge)
  const countryRegion = getCountryRegion(countryName)
  const regionInfo = REGION_INFO[countryRegion]

  if (regionInfo) {
    console.log(`🌍 Using regional bounds for ${countryName}`)
    // Make regional bounds slightly more challenging by increasing deltas
    const baseRegion = regionInfo.mapBounds
    return {
      latitude: baseRegion.latitude,
      longitude: baseRegion.longitude,
      latitudeDelta: Math.min(baseRegion.latitudeDelta * 1.2, 80), // Cap at reasonable max
      longitudeDelta: Math.min(baseRegion.longitudeDelta * 1.2, 120), // Cap at reasonable max
    }
  }

  // Final fallback to world view
  console.log(`🌐 Using world view fallback for ${countryName}`)
  return {
    latitude: 20,
    longitude: 0,
    latitudeDelta: 100,
    longitudeDelta: 140,
  }
}

/**
 * Async version for backward compatibility - now just wraps the sync version
 * since all data is bundled and available immediately
 */
export async function getCountryMapRegionAsync(countryName: string): Promise<MapRegion> {
  // Since all data is now bundled, this is just a sync operation wrapped in Promise
  return Promise.resolve(getCountryMapRegion(countryName))
}

/**
 * Check if we have specific coordinates for a country (bundled or fallback)
 */
export function hasSpecificCoordinates(countryName: string): boolean {
  return countryName in BUNDLED_COORDINATES || countryName in COUNTRY_COORDINATES_FALLBACK
}

/**
 * Get all countries that have specific coordinates defined
 */
export function getCountriesWithSpecificCoordinates(): string[] {
  const bundledCountries = Object.keys(BUNDLED_COORDINATES)
  const fallbackCountries = Object.keys(COUNTRY_COORDINATES_FALLBACK)
  // Combine and deduplicate
  return [...new Set([...bundledCountries, ...fallbackCountries])]
}

/**
 * Get coordinate statistics
 */
export function getCoordinateStats(): {
  bundledCount: number
  fallbackCount: number
  totalCount: number
  bundledCountries: string[]
  fallbackCountries: string[]
} {
  const bundledCountries = Object.keys(BUNDLED_COORDINATES)
  const fallbackCountries = Object.keys(COUNTRY_COORDINATES_FALLBACK)

  return {
    bundledCount: bundledCountries.length,
    fallbackCount: fallbackCountries.length,
    totalCount: bundledCountries.length + fallbackCountries.length,
    bundledCountries,
    fallbackCountries,
  }
}
