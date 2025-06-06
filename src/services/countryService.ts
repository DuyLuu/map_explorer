import { QueryClient } from '@tanstack/react-query'
import { Region, CountryWithRegion } from '../types/region'
import { getCountryRegion, isCountryInRegion } from './regionService'

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

// List of most popular countries (Level 1)
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

export async function fetchCountriesData(): Promise<CountryWithRegion[]> {
  const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags')
  const data = await response.json()
  return data.map((country: CountryResponse, index: number) => {
    const countryName = country.name.common
    let level = 3 // Default level for less known countries

    if (LEVEL_1_COUNTRIES.includes(countryName)) {
      level = 1
    } else if (LEVEL_2_COUNTRIES.includes(countryName)) {
      level = 2
    }

    return {
      id: index + 1,
      name: countryName,
      flagUrl: country.flags?.png,
      level,
      region: getCountryRegion(countryName),
    }
  })
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
