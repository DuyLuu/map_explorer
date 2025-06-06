import { CountryWithRegion } from '../types/region'

interface CountryDataFile {
  version: string
  generatedAt: string
  totalCountries: number
  source?: string
  lastUpdated?: string
  metadata?: any
  countries: Array<{
    id: number
    name: string
    level: number
    region: string
    countryCode: string
    flagUrl: string
    originalFlagUrl: string
    population?: number
    area?: number
    capital?: string
    apiRegion?: string
    subregion?: string
  }>
}

interface CachedData {
  countries: CountryWithRegion[]
  isLoaded: boolean
  loadError: string | null
  loadedAt: Date | null
}

// Memory cache for the loaded data
let cache: CachedData = {
  countries: [],
  isLoaded: false,
  loadError: null,
  loadedAt: null,
}

/**
 * Load the countries JSON data at runtime
 */
function loadCountriesJsonData(): CountryDataFile {
  try {
    // Use require to load JSON at runtime to avoid TypeScript import issues
    return require('../data/countries.json') as CountryDataFile
  } catch (error) {
    throw new Error(
      `Failed to load countries.json: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Load and validate the bundled country data
 * This should be called during app initialization
 */
export function loadBundledCountryData(): Promise<CountryWithRegion[]> {
  return new Promise((resolve, reject) => {
    try {
      // Return cached data if already loaded
      if (cache.isLoaded && cache.countries.length > 0) {
        console.log(`✓ Using cached bundled country data (${cache.countries.length} countries)`)
        resolve(cache.countries)
        return
      }

      console.log('📖 Loading bundled country data...')

      // Load the JSON data
      const countriesData = loadCountriesJsonData()

      // Validate the data structure
      if (!countriesData || typeof countriesData !== 'object') {
        throw new Error('Invalid countries data file format')
      }

      if (!countriesData.countries || !Array.isArray(countriesData.countries)) {
        throw new Error('Countries data is missing or invalid')
      }

      console.log(`📊 Found ${countriesData.countries.length} countries in bundled data`)
      console.log(`📅 Data generated at: ${countriesData.generatedAt}`)
      console.log(`🔢 Data version: ${countriesData.version}`)

      // Transform the data to match our app's interface
      const transformedCountries: CountryWithRegion[] = countriesData.countries.map(country => ({
        id: country.id,
        name: country.name,
        flagUrl: country.flagUrl, // Will be replaced with local path by flagAssetService
        level: country.level,
        region: country.region as any, // Cast to Region enum
        // Include new fields from v2.0.0
        countryCode: country.countryCode,
        population: country.population,
        area: country.area,
        capital: country.capital,
        apiRegion: country.apiRegion,
        subregion: country.subregion,
      }))

      // Validate each country has required fields
      const invalidCountries = transformedCountries.filter(
        country => !country.name || !country.level || !country.region
      )

      if (invalidCountries.length > 0) {
        console.warn(
          `⚠️ Found ${invalidCountries.length} countries with missing data:`,
          invalidCountries
        )
      }

      // Cache the data
      cache = {
        countries: transformedCountries,
        isLoaded: true,
        loadError: null,
        loadedAt: new Date(),
      }

      console.log(
        `✅ Successfully loaded ${transformedCountries.length} countries from bundled data`
      )
      resolve(transformedCountries)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error loading bundled data'
      console.error('❌ Failed to load bundled country data:', errorMessage)

      cache.loadError = errorMessage
      cache.isLoaded = false

      reject(new Error(`Failed to load bundled country data: ${errorMessage}`))
    }
  })
}

/**
 * Get all countries from bundled data
 * Returns cached data if available, otherwise loads it
 */
export async function getBundledCountries(): Promise<CountryWithRegion[]> {
  if (cache.isLoaded && cache.countries.length > 0) {
    return cache.countries
  }

  return loadBundledCountryData()
}

/**
 * Get countries synchronously (only works if data is already loaded)
 * Returns undefined if data is not loaded yet
 */
export function getBundledCountriesSync(): CountryWithRegion[] | undefined {
  if (!cache.isLoaded) {
    console.warn('⚠️ Bundled country data not loaded yet. Call loadBundledCountryData() first.')
    return undefined
  }

  return cache.countries
}

/**
 * Get a specific country by ID
 */
export function getBundledCountryById(id: number): CountryWithRegion | undefined {
  const countries = getBundledCountriesSync()
  if (!countries) return undefined

  return countries.find(country => country.id === id)
}

/**
 * Get a specific country by name
 */
export function getBundledCountryByName(name: string): CountryWithRegion | undefined {
  const countries = getBundledCountriesSync()
  if (!countries) return undefined

  return countries.find(country => country.name.toLowerCase() === name.toLowerCase())
}

/**
 * Get countries filtered by region
 */
export function getBundledCountriesByRegion(region: string): CountryWithRegion[] {
  const countries = getBundledCountriesSync()
  if (!countries) return []

  return countries.filter(country => country.region === region)
}

/**
 * Get countries filtered by level
 */
export function getBundledCountriesByLevel(level: number): CountryWithRegion[] {
  const countries = getBundledCountriesSync()
  if (!countries) return []

  return countries.filter(country => country.level === level)
}

/**
 * Get countries filtered by region and level
 */
export function getBundledCountriesByRegionAndLevel(
  region: string,
  level?: number
): CountryWithRegion[] {
  const countries = getBundledCountriesSync()
  if (!countries) return []

  let filtered = countries.filter(country => country.region === region)

  if (level !== undefined) {
    filtered = filtered.filter(country => country.level === level)
  }

  return filtered
}

/**
 * Check if bundled data is loaded and ready
 */
export function isBundledDataLoaded(): boolean {
  return cache.isLoaded && cache.countries.length > 0
}

/**
 * Get loading status and stats
 */
export function getBundledDataStatus() {
  try {
    const countriesData = loadCountriesJsonData()
    return {
      isLoaded: cache.isLoaded,
      loadError: cache.loadError,
      loadedAt: cache.loadedAt,
      totalCountries: cache.countries.length,
      version: countriesData.version,
      generatedAt: countriesData.generatedAt,
    }
  } catch (error) {
    return {
      isLoaded: cache.isLoaded,
      loadError: cache.loadError,
      loadedAt: cache.loadedAt,
      totalCountries: cache.countries.length,
      version: 'unknown',
      generatedAt: 'unknown',
    }
  }
}

/**
 * Force reload the bundled data (useful for testing or updates)
 */
export function reloadBundledData(): Promise<CountryWithRegion[]> {
  console.log('🔄 Force reloading bundled country data...')

  // Clear cache
  cache = {
    countries: [],
    isLoaded: false,
    loadError: null,
    loadedAt: null,
  }

  return loadBundledCountryData()
}

/**
 * Get summary statistics of the bundled data
 */
export function getBundledDataStats() {
  const countries = getBundledCountriesSync()
  if (!countries) {
    return {
      total: 0,
      byRegion: {},
      byLevel: {},
    }
  }

  const byRegion: Record<string, number> = {}
  const byLevel: Record<number, number> = {}

  countries.forEach(country => {
    byRegion[country.region] = (byRegion[country.region] || 0) + 1
    byLevel[country.level] = (byLevel[country.level] || 0) + 1
  })

  return {
    total: countries.length,
    byRegion,
    byLevel,
  }
}
