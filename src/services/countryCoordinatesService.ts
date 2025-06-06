import { Region as MapRegion } from 'react-native-maps'
import { getCountryRegion } from './regionService'
import { Region, REGION_INFO } from '../types/region'

interface CountryCoordinates {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

// Specific coordinates for countries to provide better map focusing
// Note: Delta values are intentionally larger to maintain challenge level
const COUNTRY_COORDINATES: Record<string, CountryCoordinates> = {
  // Major countries with broader view for challenge
  'United States': {
    latitude: 39.8283,
    longitude: -98.5795,
    latitudeDelta: 45,
    longitudeDelta: 60,
  },
  Canada: { latitude: 56.1304, longitude: -106.3468, latitudeDelta: 50, longitudeDelta: 70 },
  Mexico: { latitude: 23.6345, longitude: -102.5528, latitudeDelta: 25, longitudeDelta: 30 },
  Brazil: { latitude: -14.235, longitude: -51.9253, latitudeDelta: 35, longitudeDelta: 40 },
  Argentina: { latitude: -38.4161, longitude: -63.6167, latitudeDelta: 30, longitudeDelta: 35 },
  Chile: { latitude: -35.6751, longitude: -71.543, latitudeDelta: 40, longitudeDelta: 20 },
  Colombia: { latitude: 4.5709, longitude: -74.2973, latitudeDelta: 20, longitudeDelta: 25 },
  Peru: { latitude: -9.19, longitude: -75.0152, latitudeDelta: 25, longitudeDelta: 30 },

  // Europe - broader regional views
  France: { latitude: 46.2276, longitude: 2.2137, latitudeDelta: 15, longitudeDelta: 20 },
  Germany: { latitude: 51.1657, longitude: 10.4515, latitudeDelta: 12, longitudeDelta: 16 },
  Italy: { latitude: 41.8719, longitude: 12.5674, latitudeDelta: 15, longitudeDelta: 15 },
  Spain: { latitude: 40.4637, longitude: -3.7492, latitudeDelta: 12, longitudeDelta: 18 },
  'United Kingdom': { latitude: 55.3781, longitude: -3.436, latitudeDelta: 12, longitudeDelta: 15 },
  Netherlands: { latitude: 52.1326, longitude: 5.2913, latitudeDelta: 8, longitudeDelta: 12 },
  Belgium: { latitude: 50.5039, longitude: 4.4699, latitudeDelta: 8, longitudeDelta: 12 },
  Switzerland: { latitude: 46.8182, longitude: 8.2275, latitudeDelta: 8, longitudeDelta: 12 },
  Austria: { latitude: 47.5162, longitude: 14.5501, latitudeDelta: 10, longitudeDelta: 15 },
  Poland: { latitude: 51.9194, longitude: 19.1451, latitudeDelta: 12, longitudeDelta: 18 },
  Sweden: { latitude: 60.1282, longitude: 18.6435, latitudeDelta: 18, longitudeDelta: 20 },
  Norway: { latitude: 60.472, longitude: 8.4689, latitudeDelta: 20, longitudeDelta: 18 },
  Finland: { latitude: 61.9241, longitude: 25.7482, latitudeDelta: 15, longitudeDelta: 20 },
  Denmark: { latitude: 56.2639, longitude: 9.5018, latitudeDelta: 8, longitudeDelta: 12 },
  Iceland: { latitude: 64.9631, longitude: -19.0208, latitudeDelta: 12, longitudeDelta: 18 },
  Portugal: { latitude: 39.3999, longitude: -8.2245, latitudeDelta: 10, longitudeDelta: 12 },
  Greece: { latitude: 39.0742, longitude: 21.8243, latitudeDelta: 12, longitudeDelta: 15 },
  Russia: { latitude: 61.524, longitude: 105.3188, latitudeDelta: 50, longitudeDelta: 80 },
  Turkey: { latitude: 38.9637, longitude: 35.2433, latitudeDelta: 15, longitudeDelta: 25 },

  // Asia - regional focus with challenge maintained
  China: { latitude: 35.8617, longitude: 104.1954, latitudeDelta: 30, longitudeDelta: 40 },
  Japan: { latitude: 36.2048, longitude: 138.2529, latitudeDelta: 15, longitudeDelta: 20 },
  India: { latitude: 20.5937, longitude: 78.9629, latitudeDelta: 25, longitudeDelta: 30 },
  'South Korea': { latitude: 35.9078, longitude: 127.7669, latitudeDelta: 10, longitudeDelta: 15 },
  'North Korea': { latitude: 40.3399, longitude: 127.5101, latitudeDelta: 10, longitudeDelta: 15 },
  Thailand: { latitude: 15.87, longitude: 100.9925, latitudeDelta: 15, longitudeDelta: 20 },
  Vietnam: { latitude: 14.0583, longitude: 108.2772, latitudeDelta: 18, longitudeDelta: 15 },
  Malaysia: { latitude: 4.2105, longitude: 101.9758, latitudeDelta: 12, longitudeDelta: 18 },
  Singapore: { latitude: 1.3521, longitude: 103.8198, latitudeDelta: 3, longitudeDelta: 4 },
  Indonesia: { latitude: -0.7893, longitude: 113.9213, latitudeDelta: 25, longitudeDelta: 35 },
  Philippines: { latitude: 12.8797, longitude: 121.774, latitudeDelta: 15, longitudeDelta: 20 },
  Pakistan: { latitude: 30.3753, longitude: 69.3451, latitudeDelta: 18, longitudeDelta: 25 },
  Bangladesh: { latitude: 23.685, longitude: 90.3563, latitudeDelta: 8, longitudeDelta: 12 },
  'Sri Lanka': { latitude: 7.8731, longitude: 80.7718, latitudeDelta: 6, longitudeDelta: 8 },
  Myanmar: { latitude: 21.9162, longitude: 95.956, latitudeDelta: 15, longitudeDelta: 18 },
  Afghanistan: { latitude: 33.9391, longitude: 67.71, latitudeDelta: 12, longitudeDelta: 20 },
  Iran: { latitude: 32.4279, longitude: 53.688, latitudeDelta: 18, longitudeDelta: 25 },
  Iraq: { latitude: 33.2232, longitude: 43.6793, latitudeDelta: 12, longitudeDelta: 20 },
  'Saudi Arabia': { latitude: 23.8859, longitude: 45.0792, latitudeDelta: 20, longitudeDelta: 30 },
  'United Arab Emirates': {
    latitude: 23.4241,
    longitude: 53.8478,
    latitudeDelta: 8,
    longitudeDelta: 12,
  },
  Israel: { latitude: 31.0461, longitude: 34.8516, latitudeDelta: 8, longitudeDelta: 10 },
  Kazakhstan: { latitude: 48.0196, longitude: 66.9237, latitudeDelta: 20, longitudeDelta: 35 },

  // Africa - broader views to maintain challenge
  Egypt: { latitude: 26.0975, longitude: 30.0444, latitudeDelta: 15, longitudeDelta: 20 },
  'South Africa': { latitude: -30.5595, longitude: 22.9375, latitudeDelta: 18, longitudeDelta: 25 },
  Nigeria: { latitude: 9.082, longitude: 8.6753, latitudeDelta: 15, longitudeDelta: 20 },
  Kenya: { latitude: -0.0236, longitude: 37.9062, latitudeDelta: 12, longitudeDelta: 18 },
  Morocco: { latitude: 31.7917, longitude: -7.0926, latitudeDelta: 12, longitudeDelta: 18 },
  Algeria: { latitude: 28.0339, longitude: 1.6596, latitudeDelta: 20, longitudeDelta: 25 },
  Libya: { latitude: 26.3351, longitude: 17.2283, latitudeDelta: 15, longitudeDelta: 25 },
  Tunisia: { latitude: 33.8869, longitude: 9.5375, latitudeDelta: 8, longitudeDelta: 12 },
  Ethiopia: { latitude: 9.145, longitude: 40.4897, latitudeDelta: 15, longitudeDelta: 20 },
  Ghana: { latitude: 7.9465, longitude: -1.0232, latitudeDelta: 10, longitudeDelta: 15 },
  Tanzania: { latitude: -6.369, longitude: 34.8888, latitudeDelta: 15, longitudeDelta: 20 },
  Uganda: { latitude: 1.3733, longitude: 32.2903, latitudeDelta: 8, longitudeDelta: 12 },
  Madagascar: { latitude: -18.7669, longitude: 46.8691, latitudeDelta: 15, longitudeDelta: 12 },

  // Oceania - maintain regional context
  Australia: { latitude: -25.2744, longitude: 133.7751, latitudeDelta: 30, longitudeDelta: 40 },
  'New Zealand': { latitude: -40.9006, longitude: 174.886, latitudeDelta: 15, longitudeDelta: 20 },
  'Papua New Guinea': {
    latitude: -6.315,
    longitude: 143.9555,
    latitudeDelta: 12,
    longitudeDelta: 18,
  },
  Fiji: { latitude: -16.7784, longitude: 179.4144, latitudeDelta: 8, longitudeDelta: 12 },
}

/**
 * Get specific map region for a country to focus the map view
 * Uses broader regional views to maintain challenge level
 */
export function getCountryMapRegion(countryName: string): MapRegion {
  // First check if we have specific coordinates for this country
  const specificCoords = COUNTRY_COORDINATES[countryName]
  if (specificCoords) {
    return {
      latitude: specificCoords.latitude,
      longitude: specificCoords.longitude,
      latitudeDelta: specificCoords.latitudeDelta,
      longitudeDelta: specificCoords.longitudeDelta,
    }
  }

  // Fall back to the region bounds (this adds more challenge)
  const countryRegion = getCountryRegion(countryName)
  const regionInfo = REGION_INFO[countryRegion]

  if (regionInfo) {
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
  return {
    latitude: 20,
    longitude: 0,
    latitudeDelta: 100, // Slightly more zoomed than before
    longitudeDelta: 140,
  }
}

/**
 * Check if we have specific coordinates for a country
 */
export function hasSpecificCoordinates(countryName: string): boolean {
  return countryName in COUNTRY_COORDINATES
}

/**
 * Get all countries that have specific coordinates defined
 */
export function getCountriesWithSpecificCoordinates(): string[] {
  return Object.keys(COUNTRY_COORDINATES)
}
