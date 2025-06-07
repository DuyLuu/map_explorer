#!/usr/bin/env node

/**
 * Add Entity Types Script
 *
 * This script updates the countries.json file to add entityType field
 * to distinguish between sovereign countries and territories/dependencies
 */

const fs = require('fs')
const path = require('path')

// Territory classification (matching src/utils/territoryClassification.ts)
const TERRITORIES = [
  // British Overseas Territories
  'Anguilla',
  'Bermuda',
  'British Virgin Islands',
  'Cayman Islands',
  'Falkland Islands',
  'Gibraltar',
  'Montserrat',
  'Pitcairn Islands',
  'Saint Helena, Ascension and Tristan da Cunha',
  'South Georgia',
  'Turks and Caicos Islands',
  'British Indian Ocean Territory',

  // British Crown Dependencies
  'Guernsey',
  'Jersey',
  'Isle of Man',

  // US Territories
  'American Samoa',
  'Guam',
  'Northern Mariana Islands',
  'Puerto Rico',
  'United States Virgin Islands',
  'United States Minor Outlying Islands',

  // French Overseas Territories
  'French Guiana',
  'French Polynesia',
  'French Southern and Antarctic Lands',
  'Guadeloupe',
  'Martinique',
  'Mayotte',
  'New Caledonia',
  'Réunion',
  'Saint Barthélemy',
  'Saint Martin',
  'Saint Pierre and Miquelon',
  'Wallis and Futuna',

  // Danish Autonomous Territories
  'Faroe Islands',
  'Greenland',

  // Dutch Territories
  'Aruba',
  'Caribbean Netherlands',
  'Curaçao',
  'Sint Maarten',

  // Norwegian Dependencies
  'Bouvet Island',
  'Svalbard and Jan Mayen',

  // Australian Territories
  'Christmas Island',
  'Cocos (Keeling) Islands',
  'Heard Island and McDonald Islands',
  'Norfolk Island',

  // New Zealand Territories
  'Cook Islands',
  'Niue',
  'Tokelau',

  // Chinese Special Administrative Regions
  'Hong Kong',
  'Macau',

  // Finnish Autonomous Region
  'Åland Islands',

  // Antarctic and Uninhabited Territories
  'Antarctica',

  // Other Dependencies and Special Cases
  'Western Sahara', // Disputed territory
]

function isTerritory(name) {
  return TERRITORIES.includes(name)
}

function addEntityTypes() {
  const countriesPath = path.join(__dirname, '../src/data/countries.json')

  // Read current countries data
  const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf8'))

  let countryCount = 0
  let territoryCount = 0

  // Add entityType field to each country
  countriesData.countries = countriesData.countries.map(country => {
    const entityType = isTerritory(country.name) ? 'territory' : 'country'

    if (entityType === 'country') {
      countryCount++
    } else {
      territoryCount++
    }

    return {
      ...country,
      entityType,
    }
  })

  // Update metadata
  countriesData.metadata = {
    ...countriesData.metadata,
    byEntityType: {
      countries: countryCount,
      territories: territoryCount,
    },
  }

  // Update version
  countriesData.version = '2.1.0'
  countriesData.lastUpdated = new Date().toISOString()

  // Write updated data
  fs.writeFileSync(countriesPath, JSON.stringify(countriesData, null, 2), 'utf8')

  console.log(`✅ Successfully updated countries.json`)
  console.log(`📊 Statistics:`)
  console.log(`   - Countries: ${countryCount}`)
  console.log(`   - Territories: ${territoryCount}`)
  console.log(`   - Total: ${countryCount + territoryCount}`)

  // List territories for verification
  console.log(`\n🏝️  Classified as territories:`)
  const territories = countriesData.countries
    .filter(c => c.entityType === 'territory')
    .map(c => c.name)
    .sort()

  territories.forEach(name => console.log(`   - ${name}`))
}

// Run the script
addEntityTypes()
