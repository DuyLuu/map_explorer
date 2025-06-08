import { CountryDetailData } from 'features/learning/services/countryDataService'

/**
 * Raw response structure from REST Countries API v3.1
 */
interface RestCountriesResponse {
  name: {
    common: string
    official: string
    nativeName?: Record<string, { official: string; common: string }>
  }
  capital?: string[]
  population: number
  area: number
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol: string }>
  latlng: [number, number]
  flags: {
    png: string
    svg: string
    alt?: string
  }
  region: string
  subregion?: string
  borders?: string[]
  timezones: string[]
  continents: string[]
}

/**
 * Enhanced country data with cultural and geographic information
 */
interface EnhancedCountryData extends CountryDetailData {
  officialName: string
  nativeNames: string[]
  subregion?: string
  borders: string[]
  timezones: string[]
  continents: string[]
}

/**
 * Fetch all countries from REST Countries API
 */
export async function fetchAllCountriesFromAPI(): Promise<RestCountriesResponse[]> {
  try {
    console.log('🔄 Fetching countries from REST Countries API...')

    const response = await fetch('https://restcountries.com/v3.1/all')

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const countries: RestCountriesResponse[] = await response.json()
    console.log(`✅ Successfully fetched ${countries.length} countries from API`)

    return countries
  } catch (error) {
    console.error('❌ Failed to fetch countries from API:', error)
    throw new Error(
      `Failed to fetch countries: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Fetch detailed data for a specific country by name
 */
export async function fetchCountryByName(
  countryName: string
): Promise<RestCountriesResponse | null> {
  try {
    console.log(`🔄 Fetching data for ${countryName}...`)

    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`
    )

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`⚠️ Country not found: ${countryName}`)
        return null
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const countries: RestCountriesResponse[] = await response.json()
    return countries[0] || null
  } catch (error) {
    console.error(`❌ Failed to fetch data for ${countryName}:`, error)
    return null
  }
}

/**
 * Format area number to readable string
 */
function formatArea(area: number): string {
  if (area >= 1000000) {
    return `${(area / 1000000).toFixed(1)} million km²`
  } else if (area >= 1000) {
    return `${(area / 1000).toFixed(0)},${(area % 1000).toString().padStart(3, '0')} km²`
  } else {
    return `${area.toLocaleString()} km²`
  }
}

/**
 * Format population number to readable string
 */
function formatPopulation(population: number): string {
  if (population >= 1000000000) {
    return `${(population / 1000000000).toFixed(1)} billion`
  } else if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)} million`
  } else if (population >= 1000) {
    return `${(population / 1000).toFixed(0)},${(population % 1000).toString().padStart(3, '0')}`
  } else {
    return population.toLocaleString()
  }
}

/**
 * Get primary currency name and symbol
 */
function getPrimaryCurrency(currencies?: Record<string, { name: string; symbol: string }>): string {
  if (!currencies) return 'Currency not available'

  const currencyEntries = Object.entries(currencies)
  if (currencyEntries.length === 0) return 'Currency not available'

  const [code, currency] = currencyEntries[0]
  return `${currency.name} (${code})`
}

/**
 * Get native names as array
 */
function getNativeNames(
  nativeNames?: Record<string, { official: string; common: string }>
): string[] {
  if (!nativeNames) return []

  return Object.values(nativeNames).map(name => name.common)
}

/**
 * Generate cultural facts based on available data
 */
function generateCulturalFacts(country: RestCountriesResponse): string[] {
  const facts: string[] = []

  // Language diversity
  if (country.languages) {
    const languageCount = Object.keys(country.languages).length
    const languageNames = Object.values(country.languages)

    if (languageCount === 1) {
      facts.push(`Primary language is ${languageNames[0]}`)
    } else if (languageCount > 1) {
      facts.push(
        `Multilingual country with ${languageCount} official languages: ${languageNames.join(', ')}`
      )
    }
  }

  // Regional information
  if (country.subregion) {
    facts.push(`Located in ${country.subregion}, part of ${country.region}`)
  }

  // Border information
  if (country.borders && country.borders.length > 0) {
    facts.push(`Shares borders with ${country.borders.length} countries`)
  } else {
    facts.push('Island nation or isolated by water')
  }

  // Timezone diversity
  if (country.timezones.length > 1) {
    facts.push(`Spans ${country.timezones.length} time zones`)
  }

  return facts
}

/**
 * Generate historical highlights based on available data
 */
function generateHistoricalHighlights(country: RestCountriesResponse): string[] {
  // This would ideally come from a historical database
  // For now, we'll generate basic information based on available data
  const highlights: string[] = []

  highlights.push('Rich historical heritage and cultural development')
  highlights.push('Significant contributions to regional and global history')
  highlights.push('Evolution of modern governmental and social structures')

  return highlights
}

/**
 * Generate geographic features based on available data
 */
function generateGeographicFeatures(country: RestCountriesResponse): string[] {
  const features: string[] = []

  // Continental information
  if (country.continents && country.continents.length > 0) {
    features.push(`Located on ${country.continents.join(' and ')}`)
  }

  // Regional geography
  if (country.subregion) {
    features.push(`Part of the ${country.subregion} region`)
  }

  // Area information
  if (country.area) {
    if (country.area > 1000000) {
      features.push('Large country with diverse landscapes')
    } else if (country.area > 100000) {
      features.push('Medium-sized country with varied geography')
    } else {
      features.push('Compact country with unique geographical features')
    }
  }

  features.push('Distinct natural landmarks and geographical characteristics')

  return features
}

/**
 * Transform REST Countries API response to our CountryDetailData format
 */
export function transformApiDataToCountryDetail(
  apiData: RestCountriesResponse
): EnhancedCountryData {
  return {
    capital: apiData.capital?.[0] || 'No official capital',
    population: formatPopulation(apiData.population),
    languages: Object.values(apiData.languages || {}),
    currency: getPrimaryCurrency(apiData.currencies),
    area: formatArea(apiData.area || 0),
    coordinates: {
      latitude: apiData.latlng[0] || 0,
      longitude: apiData.latlng[1] || 0,
    },
    culturalFacts: generateCulturalFacts(apiData),
    historicalHighlights: generateHistoricalHighlights(apiData),
    geographicFeatures: generateGeographicFeatures(apiData),
    // Enhanced fields
    officialName: apiData.name.official,
    nativeNames: getNativeNames(apiData.name.nativeName),
    subregion: apiData.subregion,
    borders: apiData.borders || [],
    timezones: apiData.timezones,
    continents: apiData.continents,
  }
}

/**
 * Fetch and transform country data for a specific country
 */
export async function getCountryDetailFromAPI(
  countryName: string
): Promise<CountryDetailData | null> {
  try {
    const apiData = await fetchCountryByName(countryName)
    if (!apiData) {
      return null
    }

    return transformApiDataToCountryDetail(apiData)
  } catch (error) {
    console.error(`❌ Failed to get country detail for ${countryName}:`, error)
    return null
  }
}

/**
 * Validate API response structure
 */
export function validateApiResponse(data: any): data is RestCountriesResponse {
  return (
    data &&
    typeof data === 'object' &&
    data.name &&
    typeof data.name.common === 'string' &&
    typeof data.population === 'number' &&
    Array.isArray(data.latlng) &&
    data.latlng.length === 2
  )
}
