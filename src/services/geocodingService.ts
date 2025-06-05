interface GeocodingResponse {
  address?: {
    country?: string
    country_code?: string
  }
  display_name?: string
  error?: string
}

interface CachedResult {
  country: string | null
  timestamp: number
}

// Cache for geocoding results to improve performance and reduce API calls
const geocodingCache = new Map<string, CachedResult>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Detect which country a coordinate belongs to using reverse geocoding
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @returns Promise<string | null> - The country name or null if not found
 */
export async function detectCountryFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string | null> {
  console.log(`🗺️ Detecting country for coordinates: ${latitude}, ${longitude}`)

  // Validate coordinates
  if (!isValidCoordinate(latitude, longitude)) {
    console.warn('❌ Invalid coordinates provided:', { latitude, longitude })
    return null
  }

  // Check cache first
  const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}`
  const cached = geocodingCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`💾 Cache hit for ${cacheKey}: ${cached.country}`)
    return cached.country
  }

  try {
    console.log('🌐 Trying primary geocoding service (Nominatim)...')
    // Try primary geocoding service (Nominatim)
    let country = await tryNominatimGeocoding(latitude, longitude)

    // If primary fails, try backup service
    if (!country) {
      console.log('🔄 Primary service failed, trying backup service...')
      country = await tryBackupGeocoding(latitude, longitude)
    }

    console.log(`✅ Final result: ${country}`)

    // Cache the result
    geocodingCache.set(cacheKey, {
      country,
      timestamp: Date.now(),
    })

    return country
  } catch (error) {
    console.error('❌ Error detecting country from coordinates:', error)
    return null
  }
}

/**
 * Validate that coordinates are within valid ranges
 */
function isValidCoordinate(latitude: number, longitude: number): boolean {
  // Check basic coordinate bounds only - remove ocean detection
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    console.log(`❌ Coordinates out of bounds: lat ${latitude}, lon ${longitude}`)
    return false
  }

  return true
}

/**
 * Primary geocoding using OpenStreetMap's Nominatim API
 */
async function tryNominatimGeocoding(latitude: number, longitude: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`
    console.log(`📡 Nominatim API call: ${url}`)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WorldExplorer/1.0',
      },
    })

    console.log(`📡 Nominatim response status: ${response.status}`)

    if (!response.ok) {
      console.warn('⚠️ Nominatim API request failed:', response.status)
      return null
    }

    const data: GeocodingResponse = await response.json()
    console.log('📡 Nominatim response data:', JSON.stringify(data, null, 2))

    if (data.address?.country) {
      const normalizedCountry = normalizeCountryName(data.address.country)
      console.log(`🏗️ Normalized country: ${data.address.country} -> ${normalizedCountry}`)
      return normalizedCountry
    }

    console.warn('⚠️ No country found in Nominatim response')
    return null
  } catch (error) {
    console.warn('❌ Nominatim geocoding failed:', error)
    return null
  }
}

/**
 * Backup geocoding service using a different provider
 */
async function tryBackupGeocoding(latitude: number, longitude: number): Promise<string | null> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    console.log(`📡 Backup API call: ${url}`)

    const response = await fetch(url)

    console.log(`📡 Backup response status: ${response.status}`)

    if (!response.ok) {
      console.warn('⚠️ Backup geocoding API request failed:', response.status)
      return null
    }

    const data = await response.json()
    console.log('📡 Backup response data:', JSON.stringify(data, null, 2))

    if (data.countryName) {
      const normalizedCountry = normalizeCountryName(data.countryName)
      console.log(`🏗️ Normalized country: ${data.countryName} -> ${normalizedCountry}`)
      return normalizedCountry
    }

    console.warn('⚠️ No country found in backup response')
    return null
  } catch (error) {
    console.warn('❌ Backup geocoding failed:', error)
    return null
  }
}

/**
 * Normalize country names to match the format used in the quiz
 * This handles common variations in country names returned by different APIs
 */
function normalizeCountryName(countryName: string): string {
  const normalizations: Record<string, string> = {
    // Common variations for major countries
    'United States of America': 'United States',
    USA: 'United States',
    US: 'United States',
    UK: 'United Kingdom',
    'Great Britain': 'United Kingdom',
    England: 'United Kingdom',
    Scotland: 'United Kingdom',
    Wales: 'United Kingdom',
    'Northern Ireland': 'United Kingdom',

    // Russia variations
    'Russian Federation': 'Russia',
    'Russian Fed.': 'Russia',

    // Korea variations
    'Republic of Korea': 'South Korea',
    'Korea, South': 'South Korea',
    "Democratic People's Republic of Korea": 'North Korea',
    'Korea, North': 'North Korea',

    // Congo variations
    'Democratic Republic of the Congo': 'Democratic Republic of the Congo',
    'Congo, Democratic Republic': 'Democratic Republic of the Congo',
    'Congo-Kinshasa': 'Democratic Republic of the Congo',
    'Republic of the Congo': 'Congo',
    'Congo, Republic': 'Congo',
    'Congo-Brazzaville': 'Congo',

    // Other common variations
    'Czech Republic': 'Czech Republic',
    Czechia: 'Czech Republic',
    'Slovak Republic': 'Slovakia',
    'Republic of Ireland': 'Ireland',
    Eire: 'Ireland',
    'Vatican City': 'Vatican City',
    'Holy See': 'Vatican City',
    Myanmar: 'Myanmar',
    Burma: 'Myanmar',
    Macedonia: 'North Macedonia',
    'Former Yugoslav Republic of Macedonia': 'North Macedonia',
    'The Gambia': 'Gambia',
    'The Bahamas': 'Bahamas',

    // Regional variations that should map to main country
    'Hong Kong': 'China',
    Macau: 'China',
    Taiwan: 'Taiwan',
    'Puerto Rico': 'United States',
    Guam: 'United States',
    'American Samoa': 'United States',
    'Virgin Islands': 'United States',
    Greenland: 'Denmark',
    'Faroe Islands': 'Denmark',
  }

  // Clean up the country name (trim whitespace, handle case)
  const cleanName = countryName.trim()

  // Check for exact matches first
  if (normalizations[cleanName]) {
    return normalizations[cleanName]
  }

  // Check for case-insensitive matches
  const lowerName = cleanName.toLowerCase()
  for (const [key, value] of Object.entries(normalizations)) {
    if (key.toLowerCase() === lowerName) {
      return value
    }
  }

  // Return the original name if no normalization found
  return cleanName
}

/**
 * Clear the geocoding cache (useful for testing or memory management)
 */
export function clearGeocodingCache(): void {
  geocodingCache.clear()
}
