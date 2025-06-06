const fs = require('fs')
const path = require('path')
const https = require('https')

/**
 * Fetch and Cache Countries Data
 *
 * This script fetches all country data from REST Countries API once
 * and caches it to a local countries.json file for offline usage.
 */

// Configuration
const API_URL =
  'https://restcountries.com/v3.1/all?fields=name,flags,region,subregion,population,area,capital,cca2'
const OUTPUT_FILE = path.join(__dirname, '../src/data/countries.json')

// Region mapping for our app
const REGION_MAPPING = {
  Africa: 'africa',
  Americas: 'north_america', // Will be refined based on subregion
  Asia: 'asia',
  Europe: 'europe',
  Oceania: 'oceania',
}

// Level classification based on population, GDP, and recognition
const LEVEL_1_COUNTRIES = [
  'United States',
  'China',
  'Japan',
  'Germany',
  'United Kingdom',
  'France',
  'India',
  'Italy',
  'Brazil',
  'Canada',
  'Russia',
  'South Korea',
  'Spain',
  'Australia',
  'Mexico',
  'Indonesia',
  'Netherlands',
  'Saudi Arabia',
  'Turkey',
  'Taiwan',
  'Belgium',
  'Argentina',
  'Ireland',
  'Austria',
  'Nigeria',
  'Israel',
  'Norway',
  'Egypt',
  'United Arab Emirates',
  'South Africa',
  'Poland',
  'Bangladesh',
  'Chile',
  'Finland',
  'Romania',
  'Czech Republic',
  'Portugal',
  'New Zealand',
  'Peru',
  'Greece',
  'Qatar',
  'Denmark',
  'Kuwait',
  'Malaysia',
  'Singapore',
  'Philippines',
  'Thailand',
  'Sweden',
  'Switzerland',
  'Morocco',
  'Ukraine',
  'Vietnam',
  'Pakistan',
  'Algeria',
  'Ecuador',
  'Sri Lanka',
]

const LEVEL_2_COUNTRIES = [
  'Colombia',
  'Venezuela',
  'Kazakhstan',
  'Hungary',
  'Angola',
  'Ghana',
  'Tanzania',
  'Kenya',
  'Ethiopia',
  'Uganda',
  'Mozambique',
  'Madagascar',
  'Cameroon',
  'Ivory Coast',
  'Niger',
  'Burkina Faso',
  'Mali',
  'Malawi',
  'Zambia',
  'Senegal',
  'Somalia',
  'Chad',
  'Guinea',
  'Rwanda',
  'Benin',
  'Burundi',
  'Tunisia',
  'Bolivia',
  'Paraguay',
  'Uruguay',
  'Jamaica',
  'Panama',
  'Costa Rica',
  'Guatemala',
  'Honduras',
  'Nicaragua',
  'El Salvador',
  'Dominican Republic',
  'Cuba',
  'Haiti',
  'Trinidad and Tobago',
  'Bahrain',
  'Jordan',
  'Lebanon',
  'Oman',
  'Armenia',
  'Georgia',
  'Azerbaijan',
  'Uzbekistan',
  'Afghanistan',
  'Iraq',
  'Yemen',
  'Syria',
  'Cambodia',
  'Laos',
  'Myanmar',
  'Mongolia',
  'Nepal',
  'Bhutan',
  'Maldives',
  'Brunei',
  'Papua New Guinea',
  'Fiji',
  'Albania',
  'North Macedonia',
  'Bosnia and Herzegovina',
  'Serbia',
  'Montenegro',
  'Kosovo',
  'Moldova',
  'Belarus',
  'Lithuania',
  'Latvia',
  'Estonia',
  'Slovenia',
  'Croatia',
  'Slovakia',
  'Luxembourg',
  'Malta',
  'Cyprus',
  'Iceland',
  'Liechtenstein',
  'Monaco',
  'San Marino',
  'Andorra',
  'Vatican City',
]

/**
 * Determine country level based on various factors
 */
function determineCountryLevel(country) {
  const name = country.name.common

  if (LEVEL_1_COUNTRIES.includes(name)) {
    return 1
  }

  if (LEVEL_2_COUNTRIES.includes(name)) {
    return 2
  }

  // Default to level 3 for less known countries
  return 3
}

/**
 * Map API region to our app's region format
 */
function mapRegion(apiRegion, subregion, countryName) {
  switch (apiRegion) {
    case 'Africa':
      return 'africa'

    case 'Asia':
      return 'asia'

    case 'Europe':
      return 'europe'

    case 'Oceania':
      return 'oceania'

    case 'Americas':
      // Refine Americas based on subregion
      if (subregion === 'South America') {
        return 'south_america'
      }
      // North America, Central America, Caribbean -> north_america
      return 'north_america'

    default:
      console.warn(`Unknown region for ${countryName}: ${apiRegion}`)
      return 'world'
  }
}

/**
 * Extract country code from flag URL or use cca2
 */
function extractCountryCode(country) {
  // Try to use the cca2 code first (most reliable)
  if (country.cca2) {
    return country.cca2.toLowerCase()
  }

  // Fallback: extract from flag URL
  if (country.flags?.png) {
    const match = country.flags.png.match(/\/([a-z]{2})\.png/i)
    if (match) {
      return match[1].toLowerCase()
    }
  }

  // Last resort: derive from name
  return country.name.common.toLowerCase().substring(0, 2)
}

/**
 * Transform REST Countries API data to our format
 */
function transformCountryData(countries) {
  return countries
    .filter(country => {
      // Filter out invalid or test countries
      return country.name?.common && country.flags?.png && !country.name.common.includes('Test')
    })
    .map((country, index) => {
      const name = country.name.common
      const region = mapRegion(country.region, country.subregion, name)
      const level = determineCountryLevel(country)
      const countryCode = extractCountryCode(country)

      return {
        id: index + 1,
        name: name,
        level: level,
        region: region,
        countryCode: countryCode,
        flagUrl: country.flags.png,
        originalFlagUrl: country.flags.png,
        // Additional metadata for reference
        population: country.population || 0,
        area: country.area || 0,
        capital: country.capital?.[0] || 'N/A',
        apiRegion: country.region,
        subregion: country.subregion,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
}

/**
 * Fetch countries from REST Countries API using Node.js https module
 */
function fetchCountriesFromAPI() {
  console.log('🔄 Fetching countries from REST Countries API...')

  return new Promise((resolve, reject) => {
    const url = new URL(API_URL)

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search, // Include query parameters
      method: 'GET',
      headers: {
        'User-Agent': 'World Explorer App/1.0.0',
      },
    }

    const req = https.request(options, res => {
      let data = ''

      // Check status code
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP error! status: ${res.statusCode}`))
        return
      }

      // Collect data chunks
      res.on('data', chunk => {
        data += chunk
      })

      // Parse completed response
      res.on('end', () => {
        try {
          const countries = JSON.parse(data)
          console.log(`✅ Successfully fetched ${countries.length} countries from API`)
          resolve(countries)
        } catch (error) {
          reject(new Error(`Failed to parse API response: ${error.message}`))
        }
      })
    })

    req.on('error', error => {
      reject(new Error(`Request failed: ${error.message}`))
    })

    req.end()
  })
}

/**
 * Save countries data to JSON file
 */
function saveCountriesToFile(countries, metadata) {
  const data = {
    version: '2.0.0',
    generatedAt: new Date().toISOString(),
    totalCountries: countries.length,
    source: 'REST Countries API v3.1',
    lastUpdated: new Date().toISOString(),
    metadata: metadata,
    countries: countries,
  }

  // Ensure the directory exists
  const dir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Write the file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf8')
  console.log(`💾 Saved ${countries.length} countries to ${OUTPUT_FILE}`)

  // Calculate file size
  const stats = fs.statSync(OUTPUT_FILE)
  const fileSizeKB = (stats.size / 1024).toFixed(1)
  console.log(`📁 File size: ${fileSizeKB} KB`)
}

/**
 * Generate metadata about the dataset
 */
function generateMetadata(countries) {
  const metadata = {
    totalCountries: countries.length,
    byLevel: {
      level1: countries.filter(c => c.level === 1).length,
      level2: countries.filter(c => c.level === 2).length,
      level3: countries.filter(c => c.level === 3).length,
    },
    byRegion: {},
    statistics: {
      averagePopulation: 0,
      totalPopulation: 0,
      averageArea: 0,
      totalArea: 0,
      countriesWithCapital: countries.filter(c => c.capital !== 'N/A').length,
    },
  }

  // Count by region
  const regions = ['africa', 'asia', 'europe', 'north_america', 'south_america', 'oceania', 'world']
  regions.forEach(region => {
    metadata.byRegion[region] = countries.filter(c => c.region === region).length
  })

  // Calculate statistics
  const totalPopulation = countries.reduce((sum, c) => sum + (c.population || 0), 0)
  const totalArea = countries.reduce((sum, c) => sum + (c.area || 0), 0)

  metadata.statistics.totalPopulation = totalPopulation
  metadata.statistics.averagePopulation = Math.round(totalPopulation / countries.length)
  metadata.statistics.totalArea = totalArea
  metadata.statistics.averageArea = Math.round(totalArea / countries.length)

  return metadata
}

/**
 * Main execution function
 */
async function main() {
  try {
    console.log('🚀 Starting country data fetch and cache process...')

    // Fetch data from API
    const apiCountries = await fetchCountriesFromAPI()

    // Transform data to our format
    console.log('🔄 Transforming country data...')
    const transformedCountries = transformCountryData(apiCountries)

    // Generate metadata
    const metadata = generateMetadata(transformedCountries)

    // Save to file
    saveCountriesToFile(transformedCountries, metadata)

    // Print summary
    console.log('\n📊 Dataset Summary:')
    console.log(`├── Total Countries: ${metadata.totalCountries}`)
    console.log(`├── Level 1 (Well-known): ${metadata.byLevel.level1}`)
    console.log(`├── Level 2 (Moderately known): ${metadata.byLevel.level2}`)
    console.log(`├── Level 3 (Less known): ${metadata.byLevel.level3}`)
    console.log('├── By Region:')
    Object.entries(metadata.byRegion).forEach(([region, count]) => {
      console.log(`│   ├── ${region}: ${count}`)
    })
    console.log(`└── Countries with capital: ${metadata.statistics.countriesWithCapital}`)

    console.log('\n✅ Country data successfully fetched and cached!')
    console.log(`📄 Data saved to: ${OUTPUT_FILE}`)
  } catch (error) {
    console.error('\n❌ Failed to fetch and cache country data:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = {
  fetchCountriesFromAPI,
  transformCountryData,
  saveCountriesToFile,
  main,
}
