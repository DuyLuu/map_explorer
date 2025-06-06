import { QueryClient } from '@tanstack/react-query'
import { Region, CountryWithRegion } from '../types/region'
import { getCountryRegion, isCountryInRegion } from './regionService'
import { getBundledCountries } from './bundledDataService'

interface Country {
  id: number
  name: string
  flagUrl: string
  level: number
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

let queryClient: QueryClient | null = null

export function setQueryClient(client: QueryClient) {
  queryClient = client
}

// Legacy level arrays - kept for compatibility but no longer used in bundled data approach
// The levels are now stored directly in the bundled data from countries.json
const LEVEL_1_COUNTRIES = [
  // North America
  'United States',
  'Canada',
  'Mexico',
  // Europe
  'United Kingdom',
  'France',
  'Germany',
  'Italy',
  'Spain',
  'Netherlands',
  'Sweden',
  'Switzerland',
  'Belgium',
  'Austria',
  'Denmark',
  'Norway',
  'Finland',
  'Portugal',
  'Greece',
  'Poland',
  'Ireland',
  'Croatia',
  'Czech Republic',
  'Hungary',
  'Romania',
  'Ukraine',
  'Bulgaria',
  // Asia
  'Japan',
  'China',
  'India',
  'South Korea',
  'Singapore',
  'Malaysia',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Indonesia',
  'Pakistan',
  'Bangladesh',
  'Sri Lanka',
  'Nepal',
  'Mongolia',
  // Oceania
  'Australia',
  'New Zealand',
  'Fiji',
  'Papua New Guinea',
  // South America
  'Brazil',
  'Argentina',
  'Chile',
  'Colombia',
  'Peru',
  // Middle East
  'Saudi Arabia',
  'United Arab Emirates',
  'Qatar',
  'Kuwait',
  'Bahrain',
  // Africa
  'South Africa',
  'Egypt',
  'Morocco',
  'Kenya',
  'Nigeria',
]

// List of moderately known countries (Level 2)
const LEVEL_2_COUNTRIES = [
  // Europe
  'Slovakia',
  'Slovenia',
  'Estonia',
  'Latvia',
  'Lithuania',
  'Serbia',
  'Bosnia and Herzegovina',
  'Albania',
  'Montenegro',
  'North Macedonia',
  'Luxembourg',
  'Iceland',
  'Malta',
  'Cyprus',
  'Moldova',
  // Asia
  'Cambodia',
  'Laos',
  'Myanmar',
  'Brunei',
  'Timor-Leste',
  'Bhutan',
  'Maldives',
  'Kazakhstan',
  'Uzbekistan',
  'Turkmenistan',
  'Kyrgyzstan',
  'Tajikistan',
  'Azerbaijan',
  'Georgia',
  'Armenia',
  // South America
  'Venezuela',
  'Ecuador',
  'Bolivia',
  'Paraguay',
  'Uruguay',
  'Guyana',
  'Suriname',
  'French Guiana',
  // Middle East
  'Oman',
  'Yemen',
  'Jordan',
  'Lebanon',
  'Syria',
  'Iraq',
  'Iran',
  'Afghanistan',
  'Israel',
  'Palestine',
  // Africa
  'Tunisia',
  'Algeria',
  'Libya',
  'Sudan',
  'Ethiopia',
  'Somalia',
  'Tanzania',
  'Uganda',
  'Rwanda',
  'Burundi',
  'Democratic Republic of the Congo',
  'Congo',
  'Cameroon',
  'Ghana',
  'Senegal',
  'Ivory Coast',
  'Mali',
  'Niger',
  'Chad',
  'Angola',
  'Mozambique',
  'Zimbabwe',
  'Zambia',
  'Botswana',
  'Namibia',
  'Madagascar',
]

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

export function getCountries(): CountryWithRegion[] | undefined {
  if (!queryClient) {
    throw new Error('QueryClient not initialized')
  }
  return queryClient.getQueryData<CountryWithRegion[]>(['countries'])
}

/**
 * Get countries filtered by region
 */
export function getCountriesByRegion(region: Region): CountryWithRegion[] {
  const allCountries = getCountries()

  if (!allCountries) {
    return []
  }

  if (region === Region.WORLD) {
    return allCountries
  }

  return allCountries.filter(country => isCountryInRegion(country.name, region))
}

/**
 * Get countries filtered by both region and level
 */
export function getCountriesByRegionAndLevel(region: Region, level?: number): CountryWithRegion[] {
  let countries = getCountriesByRegion(region)

  if (level !== undefined) {
    countries = countries.filter(country => country.level === level)
  }

  return countries
}

/**
 * Backward compatibility: Get countries without region information
 */
export function getCountriesLegacy(): Country[] | undefined {
  const countriesWithRegion = getCountries()
  if (!countriesWithRegion) {
    return undefined
  }

  return countriesWithRegion.map(country => ({
    id: country.id,
    name: country.name,
    flagUrl: country.flagUrl,
    level: country.level,
  }))
}

// Export types for backward compatibility
export type { Country, CountryWithRegion }
