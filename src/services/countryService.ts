import { Region, CountryWithRegion } from '../types/region'

import {
  getBundledCountries,
  getBundledCountriesOnly,
  getBundledTerritoriesOnly,
  getBundledCountriesByEntityType,
  getBundledCountriesByRegionAndEntityType
} from './bundledDataService'

/**
 * Fetch countries data from bundled local data instead of external API
 * This replaces the previous REST Countries API call with offline data
 *
 * Note: This function returns countries with their original flagUrl from the bundled data.
 * Components that need to display flags should use flagAssetService.getFlagAssetByName()
 * to get local flag assets for offline functionality.
 */
export async function fetchCountriesData(): Promise<CountryWithRegion[]> {
  try {
    console.log('🔄 Loading countries from bundled data...')

    // Load bundled country data (which already includes proper structure)
    const bundledCountries = await getBundledCountries()

    console.log(`✅ Loaded ${bundledCountries.length} countries from bundled data`)
    console.log(`🏁 Countries ready for use (flagAssetService provides local flag assets)`)

    return bundledCountries
  } catch (error) {
    console.error('❌ Failed to load countries from bundled data:', error)

    // Throw error to be handled by the calling code
    throw new Error(
      `Failed to load countries data: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Get all countries filtered by entity type
 */
export function getCountriesByEntityType(entityType: 'country' | 'territory'): CountryWithRegion[] {
  return getBundledCountriesByEntityType(entityType)
}

/**
 * Get only sovereign countries (excludes territories)
 */
export function getCountriesOnly(): CountryWithRegion[] {
  return getBundledCountriesOnly()
}

/**
 * Get only territories and dependencies
 */
export function getTerritoriesOnly(): CountryWithRegion[] {
  return getBundledTerritoriesOnly()
}

/**
 * Get countries by region with optional entity type filtering
 */
export async function getCountriesByRegion(
  region: Region,
  entityType?: 'country' | 'territory'
): Promise<CountryWithRegion[]> {
  if (entityType) {
    return getBundledCountriesByRegionAndEntityType(region, entityType);
  }

  const allCountries = await getBundledCountries();
  return allCountries.filter(country => {
    if (region === Region.WORLD) {
      return true;
    }
    return country.region === region;
  });
}

/**
 * Get countries by region and level with optional entity type filtering
 */
export async function getCountriesByRegionAndLevel(
  region: Region,
  level?: number,
  entityType?: 'country' | 'territory'
): Promise<CountryWithRegion[]> {
  let countries = await getCountriesByRegion(region, entityType);

  if (level) {
    countries = countries.filter(country => country.level === level);
  }

  return countries;
}

// Export types
export type { CountryWithRegion }
