/**
 * Classification of territories vs sovereign countries
 * Based on political status and sovereignty
 */

export const TERRITORIES = [
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

/**
 * Check if an entity is a territory
 */
export function isTerritory(name: string): boolean {
  return TERRITORIES.includes(name)
}

/**
 * Get entity type for a given name
 */
export function getEntityType(name: string): 'country' | 'territory' {
  return isTerritory(name) ? 'territory' : 'country'
}
