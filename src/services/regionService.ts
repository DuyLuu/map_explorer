import { Region } from '../types/region'

// Comprehensive mapping of countries to their geographic regions
export const REGION_COUNTRIES: Record<Region, string[]> = {
  [Region.EUROPE]: [
    // Western Europe
    'United Kingdom',
    'France',
    'Germany',
    'Italy',
    'Spain',
    'Netherlands',
    'Belgium',
    'Austria',
    'Switzerland',
    'Portugal',
    'Ireland',
    'Luxembourg',

    // Northern Europe
    'Sweden',
    'Norway',
    'Denmark',
    'Finland',
    'Iceland',
    'Estonia',
    'Latvia',
    'Lithuania',

    // Eastern Europe
    'Poland',
    'Czech Republic',
    'Slovakia',
    'Hungary',
    'Romania',
    'Bulgaria',
    'Croatia',
    'Slovenia',
    'Serbia',
    'Bosnia and Herzegovina',
    'Montenegro',
    'North Macedonia',
    'Albania',
    'Ukraine',
    'Belarus',
    'Moldova',

    // Southern Europe
    'Greece',
    'Cyprus',
    'Malta',
    'Vatican City',
    'San Marino',
    'Monaco',
    'Andorra',

    // Transcontinental (European part)
    'Russia',
    'Turkey',
  ],

  [Region.ASIA]: [
    // East Asia
    'China',
    'Japan',
    'South Korea',
    'North Korea',
    'Mongolia',
    'Taiwan',

    // Southeast Asia
    'Indonesia',
    'Philippines',
    'Vietnam',
    'Thailand',
    'Malaysia',
    'Singapore',
    'Myanmar',
    'Cambodia',
    'Laos',
    'Brunei',
    'Timor-Leste',

    // South Asia
    'India',
    'Pakistan',
    'Bangladesh',
    'Sri Lanka',
    'Nepal',
    'Bhutan',
    'Maldives',
    'Afghanistan',

    // Central Asia
    'Kazakhstan',
    'Uzbekistan',
    'Turkmenistan',
    'Kyrgyzstan',
    'Tajikistan',

    // Western Asia / Middle East
    'Saudi Arabia',
    'United Arab Emirates',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'Yemen',
    'Iraq',
    'Iran',
    'Jordan',
    'Lebanon',
    'Syria',
    'Israel',
    'Palestine',

    // Transcontinental (Asian part)
    'Russia',
    'Turkey',

    // Caucasus
    'Georgia',
    'Armenia',
    'Azerbaijan',
  ],

  [Region.NORTH_AMERICA]: [
    // North America proper
    'United States',
    'Canada',
    'Mexico',

    // Central America
    'Guatemala',
    'Belize',
    'El Salvador',
    'Honduras',
    'Nicaragua',
    'Costa Rica',
    'Panama',

    // Caribbean
    'Cuba',
    'Jamaica',
    'Haiti',
    'Dominican Republic',
    'Puerto Rico',
    'Trinidad and Tobago',
    'Barbados',
    'Saint Lucia',
    'Grenada',
    'Saint Vincent and the Grenadines',
    'Antigua and Barbuda',
    'Dominica',
    'Saint Kitts and Nevis',
    'Bahamas',
  ],

  [Region.SOUTH_AMERICA]: [
    'Brazil',
    'Argentina',
    'Chile',
    'Colombia',
    'Peru',
    'Venezuela',
    'Ecuador',
    'Bolivia',
    'Paraguay',
    'Uruguay',
    'Guyana',
    'Suriname',
    'French Guiana',
  ],

  [Region.AFRICA]: [
    // North Africa
    'Egypt',
    'Libya',
    'Tunisia',
    'Algeria',
    'Morocco',
    'Sudan',

    // West Africa
    'Nigeria',
    'Ghana',
    'Senegal',
    'Mali',
    'Burkina Faso',
    'Niger',
    'Guinea',
    'Sierra Leone',
    'Liberia',
    'Ivory Coast',
    'Togo',
    'Benin',
    'Mauritania',
    'Gambia',
    'Guinea-Bissau',
    'Cape Verde',

    // East Africa
    'Kenya',
    'Tanzania',
    'Uganda',
    'Rwanda',
    'Burundi',
    'Ethiopia',
    'Somalia',
    'Djibouti',
    'Eritrea',
    'South Sudan',
    'Seychelles',
    'Comoros',
    'Mauritius',
    'Madagascar',

    // Central Africa
    'Democratic Republic of the Congo',
    'Congo',
    'Central African Republic',
    'Chad',
    'Cameroon',
    'Equatorial Guinea',
    'Gabon',
    'São Tomé and Príncipe',

    // Southern Africa
    'South Africa',
    'Zimbabwe',
    'Zambia',
    'Botswana',
    'Namibia',
    'Lesotho',
    'Eswatini',
    'Angola',
    'Mozambique',
    'Malawi',
  ],

  [Region.OCEANIA]: [
    // Australia and New Zealand
    'Australia',
    'New Zealand',

    // Melanesia
    'Papua New Guinea',
    'Fiji',
    'Solomon Islands',
    'Vanuatu',
    'New Caledonia',

    // Micronesia
    'Micronesia',
    'Marshall Islands',
    'Palau',
    'Nauru',
    'Kiribati',

    // Polynesia
    'Samoa',
    'Tonga',
    'Tuvalu',
    'Cook Islands',
    'French Polynesia',
  ],

  [Region.WORLD]: [], // Will be populated with all countries
}

/**
 * Get the region for a specific country
 */
export function getCountryRegion(countryName: string): Region {
  for (const [region, countries] of Object.entries(REGION_COUNTRIES)) {
    if (region === Region.WORLD) continue

    if (countries.includes(countryName)) {
      return region as Region
    }
  }

  // Default to World if not found in any specific region
  return Region.WORLD
}

/**
 * Get all countries for a specific region
 */
export function getCountriesForRegion(region: Region): string[] {
  if (region === Region.WORLD) {
    // Return all countries from all regions (excluding duplicates)
    const allCountries = new Set<string>()

    Object.entries(REGION_COUNTRIES).forEach(([regionKey, countries]) => {
      if (regionKey !== Region.WORLD) {
        countries.forEach(country => allCountries.add(country))
      }
    })

    return Array.from(allCountries).sort()
  }

  return REGION_COUNTRIES[region] || []
}

/**
 * Get all available regions except WORLD
 */
export function getSelectableRegions(): Region[] {
  return [
    Region.EUROPE,
    Region.ASIA,
    Region.NORTH_AMERICA,
    Region.SOUTH_AMERICA,
    Region.AFRICA,
    Region.OCEANIA,
  ]
}

/**
 * Check if a country belongs to a specific region
 */
export function isCountryInRegion(countryName: string, region: Region): boolean {
  if (region === Region.WORLD) {
    return true // All countries are in the world region
  }

  return REGION_COUNTRIES[region]?.includes(countryName) || false
}
