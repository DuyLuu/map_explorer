import { getCountryMapRegion } from 'services/countryCoordinatesService'

export interface CountryDetailData {
  capital: string
  population: string
  languages: string[]
  currency: string
  area: string
  coordinates: { latitude: number; longitude: number }
  culturalFacts: string[]
  historicalHighlights: string[]
  geographicFeatures: string[]
}

// Enhanced mock country detail data - kept as fallback
const mockDetails: Record<string, CountryDetailData> = {
  'United States': {
    capital: 'Washington, D.C.',
    population: '331.9 million',
    languages: ['English'],
    currency: 'US Dollar (USD)',
    area: '9.8 million km²',
    coordinates: { latitude: 39.8283, longitude: -98.5795 },
    culturalFacts: [
      'Home to Hollywood and the global entertainment industry',
      'Known for jazz, blues, and country music origins',
      'Famous for diverse cuisine influenced by global immigration'
    ],
    historicalHighlights: [
      'Independence declared in 1776',
      'Civil War fought from 1861-1865',
      'First moon landing achieved in 1969'
    ],
    geographicFeatures: [
      'Grand Canyon in Arizona',
      'Yellowstone National Park',
      'Great Lakes region',
      'Rocky Mountains'
    ]
  },
  France: {
    capital: 'Paris',
    population: '67.4 million',
    languages: ['French'],
    currency: 'Euro (EUR)',
    area: '551,695 km²',
    coordinates: { latitude: 46.2276, longitude: 2.2137 },
    culturalFacts: [
      'Birthplace of fine dining and culinary arts',
      'Home to world-renowned fashion and luxury brands',
      'Rich tradition in art, literature, and philosophy'
    ],
    historicalHighlights: [
      'French Revolution began in 1789',
      'Napoleon Bonaparte ruled in early 1800s',
      'Resistance during World War II'
    ],
    geographicFeatures: [
      'Eiffel Tower in Paris',
      'French Riviera coastline',
      'Loire Valley castles',
      'French Alps'
    ]
  },
  Japan: {
    capital: 'Tokyo',
    population: '125.8 million',
    languages: ['Japanese'],
    currency: 'Japanese Yen (JPY)',
    area: '377,975 km²',
    coordinates: { latitude: 36.2048, longitude: 138.2529 },
    culturalFacts: [
      'Blend of ancient traditions and modern technology',
      'Famous for anime, manga, and gaming culture',
      'Traditional arts include tea ceremony, calligraphy, and origami'
    ],
    historicalHighlights: [
      'Meiji Restoration in 1868',
      'Rapid modernization in late 19th century',
      'Post-WWII economic miracle'
    ],
    geographicFeatures: [
      'Mount Fuji volcano',
      'Thousands of islands archipelago',
      'Cherry blossom (sakura) trees',
      'Hot springs (onsen) throughout the country'
    ]
  },
  Germany: {
    capital: 'Berlin',
    population: '83.2 million',
    languages: ['German'],
    currency: 'Euro (EUR)',
    area: '357,022 km²',
    coordinates: { latitude: 51.1657, longitude: 10.4515 },
    culturalFacts: [
      'Known for Oktoberfest and beer culture',
      'Rich musical heritage with classical composers',
      'Strong engineering and automotive traditions'
    ],
    historicalHighlights: [
      'Fall of Berlin Wall in 1989',
      'Reunification in 1990',
      'Industrial powerhouse of Europe'
    ],
    geographicFeatures: [
      'Black Forest region',
      'Rhine River valley',
      'Bavarian Alps',
      'North and Baltic Sea coastlines'
    ]
  },
  'United Kingdom': {
    capital: 'London',
    population: '67.5 million',
    languages: ['English'],
    currency: 'British Pound (GBP)',
    area: '242,495 km²',
    coordinates: { latitude: 55.3781, longitude: -3.436 },
    culturalFacts: [
      'Birthplace of Shakespeare and the Beatles',
      'Traditional afternoon tea culture',
      'Rich literary and theatrical traditions'
    ],
    historicalHighlights: [
      'Industrial Revolution began here',
      'British Empire spanned the globe',
      'Winston Churchill led during WWII'
    ],
    geographicFeatures: [
      'Scottish Highlands',
      'Lake District',
      'White Cliffs of Dover',
      'Stonehenge ancient monument'
    ]
  }
}

// Enhanced country detail data - now uses fresh countries.json data as primary source
export const getCountryDetails = (countryName: string): CountryDetailData => {
  try {
    // PRIMARY: Use fresh data from our updated countries.json first
    try {
      const countriesData = require('../../../data/countries.json')
      const freshCountryData = countriesData.countries?.find(
        (country: any) => country.name === countryName
      )

      if (freshCountryData) {
        console.log(`✅ Using fresh API data for ${countryName}`)
        const fallbackRegion = getCountryMapRegion(countryName)

        return {
          capital: freshCountryData.capital || 'Information coming soon',
          population: freshCountryData.population
            ? `${(freshCountryData.population / 1000000).toFixed(1)} million`
            : 'Data not available',
          languages: ['Local languages'], // Could be enhanced further
          currency: 'Local currency', // Could be enhanced further
          area: freshCountryData.area
            ? `${freshCountryData.area.toLocaleString()} km²`
            : 'Data not available',
          coordinates: {
            latitude: fallbackRegion.latitude,
            longitude: fallbackRegion.longitude
          },
          culturalFacts: [
            'Rich cultural heritage and traditions',
            'Unique local customs and practices',
            'Traditional arts and crafts'
          ],
          historicalHighlights: [
            'Ancient civilizations and early settlements',
            'Important historical events and periods',
            'Modern development and progress'
          ],
          geographicFeatures: [
            'Diverse landscapes and natural beauty',
            'Unique geographical formations',
            'Notable landmarks and attractions'
          ]
        }
      }
    } catch (freshDataError) {
      console.log('Could not load fresh countries data, trying other sources...')
    }

    // SECONDARY: Fallback to mock data if available
    if (mockDetails[countryName]) {
      console.log(`⚠️ Using mock data for ${countryName}`)
      return mockDetails[countryName]
    }

    // LAST RESORT: Generate basic data with bundled coordinates
    console.log(`⚠️ Generating fallback data for ${countryName}`)
    const fallbackRegion = getCountryMapRegion(countryName)

    return {
      capital: 'Information coming soon',
      population: 'Data not available',
      languages: ['Multiple languages'],
      currency: 'Local currency',
      area: 'Data not available',
      coordinates: {
        latitude: fallbackRegion.latitude,
        longitude: fallbackRegion.longitude
      },
      culturalFacts: [
        'Rich cultural heritage and traditions',
        'Unique local customs and practices',
        'Traditional arts and crafts'
      ],
      historicalHighlights: [
        'Ancient civilizations and early settlements',
        'Important historical events and periods',
        'Modern development and progress'
      ],
      geographicFeatures: [
        'Diverse landscapes and natural beauty',
        'Unique geographical formations',
        'Notable landmarks and attractions'
      ]
    }
  } catch (error) {
    console.error(`❌ Error getting country details for ${countryName}:`, error)

    // Emergency fallback
    const fallbackRegion = getCountryMapRegion(countryName)
    return {
      capital: 'Information coming soon',
      population: 'Data not available',
      languages: ['Multiple languages'],
      currency: 'Local currency',
      area: 'Data not available',
      coordinates: {
        latitude: fallbackRegion.latitude,
        longitude: fallbackRegion.longitude
      },
      culturalFacts: [
        'Rich cultural heritage and traditions',
        'Unique local customs and practices',
        'Traditional arts and crafts'
      ],
      historicalHighlights: [
        'Ancient civilizations and early settlements',
        'Important historical events and periods',
        'Modern development and progress'
      ],
      geographicFeatures: [
        'Diverse landscapes and natural beauty',
        'Unique geographical formations',
        'Notable landmarks and attractions'
      ]
    }
  }
}
