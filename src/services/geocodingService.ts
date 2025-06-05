interface GeocodingResponse {
  address?: {
    country?: string
    country_code?: string
  }
  display_name?: string
  error?: string
}

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
  try {
    // Use OpenStreetMap's Nominatim API for reverse geocoding (free)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'WorldExplorer/1.0', // Required by Nominatim API
        },
      }
    )

    if (!response.ok) {
      console.warn('Geocoding API request failed:', response.status)
      return null
    }

    const data: GeocodingResponse = await response.json()

    // Check if we got a valid response with country information
    if (data.address?.country) {
      return normalizeCountryName(data.address.country)
    }

    console.warn('No country found in geocoding response')
    return null
  } catch (error) {
    console.error('Error detecting country from coordinates:', error)
    return null
  }
}

/**
 * Normalize country names to match the format used in the quiz
 * This handles common variations in country names returned by different APIs
 */
function normalizeCountryName(countryName: string): string {
  const normalizations: Record<string, string> = {
    'United States of America': 'United States',
    USA: 'United States',
    UK: 'United Kingdom',
    'Great Britain': 'United Kingdom',
    'Russian Federation': 'Russia',
    'South Korea': 'South Korea',
    'North Korea': 'North Korea',
    'Democratic Republic of the Congo': 'Democratic Republic of the Congo',
    'Republic of the Congo': 'Congo',
    'Czech Republic': 'Czech Republic',
    'Slovak Republic': 'Slovakia',
    'Republic of Ireland': 'Ireland',
  }

  return normalizations[countryName] || countryName
}
