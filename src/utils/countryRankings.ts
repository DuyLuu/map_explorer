import { CountryWithRegion } from '../types/region'

export interface RankedCountry extends CountryWithRegion {
  rank: number
  value: number
  formattedValue: string
}

export type RankingCategory =
  | 'largest_area'
  | 'smallest_area'
  | 'most_populous'
  | 'least_populous'
  | 'most_dense'
  | 'least_dense'

export interface RankingCategoryInfo {
  id: RankingCategory
  title: string
  description: string
  icon: string
  unit: string
  formatValue: (value: number) => string
}

export const RANKING_CATEGORIES: RankingCategoryInfo[] = [
  {
    id: 'largest_area',
    title: 'Largest by Area',
    description: 'Countries with the most land area',
    icon: '🌍',
    unit: 'km²',
    formatValue: (value: number) => `${value.toLocaleString()} km²`,
  },
  {
    id: 'smallest_area',
    title: 'Smallest by Area',
    description: 'Countries with the least land area',
    icon: '🏝️',
    unit: 'km²',
    formatValue: (value: number) => `${value.toLocaleString()} km²`,
  },
  {
    id: 'most_populous',
    title: 'Most Populous',
    description: 'Countries with the highest population',
    icon: '👥',
    unit: 'people',
    formatValue: (value: number) => {
      if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)}B`
      } else if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`
      } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`
      }
      return value.toLocaleString()
    },
  },
  {
    id: 'least_populous',
    title: 'Least Populous',
    description: 'Countries with the lowest population',
    icon: '🏘️',
    unit: 'people',
    formatValue: (value: number) => {
      if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`
      } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1)}K`
      }
      return value.toLocaleString()
    },
  },
  {
    id: 'most_dense',
    title: 'Most Dense',
    description: 'Countries with highest population density',
    icon: '🏙️',
    unit: 'people/km²',
    formatValue: (value: number) => `${Math.round(value).toLocaleString()}/km²`,
  },
  {
    id: 'least_dense',
    title: 'Least Dense',
    description: 'Countries with lowest population density',
    icon: '🌾',
    unit: 'people/km²',
    formatValue: (value: number) => `${value.toFixed(1)}/km²`,
  },
]

/**
 * Calculate population density for a country
 */
function calculateDensity(population: number, area: number): number {
  if (area === 0) return 0
  return population / area
}

/**
 * Get ranked countries by a specific category
 */
export function getRankedCountries(
  countries: CountryWithRegion[],
  category: RankingCategory,
  limit: number = 20
): RankedCountry[] {
  // Filter to only include countries (not territories) with required data
  const validCountries = countries.filter(country => {
    const isCountry = (country.entityType || 'country') === 'country'

    switch (category) {
      case 'largest_area':
      case 'smallest_area':
        return isCountry && country.area && country.area > 0
      case 'most_populous':
      case 'least_populous':
        return isCountry && country.population && country.population > 0
      case 'most_dense':
      case 'least_dense':
        return (
          isCountry &&
          country.population &&
          country.area &&
          country.population > 0 &&
          country.area > 0
        )
      default:
        return false
    }
  })

  // Calculate values and sort
  const withValues = validCountries.map(country => {
    let value: number

    switch (category) {
      case 'largest_area':
      case 'smallest_area':
        value = country.area || 0
        break
      case 'most_populous':
      case 'least_populous':
        value = country.population || 0
        break
      case 'most_dense':
      case 'least_dense':
        value = calculateDensity(country.population || 0, country.area || 0)
        break
      default:
        value = 0
    }

    const categoryInfo = RANKING_CATEGORIES.find(cat => cat.id === category)!

    return {
      ...country,
      value,
      formattedValue: categoryInfo.formatValue(value),
      rank: 0, // Will be set after sorting
    }
  })

  // Sort based on category (ascending for smallest/least, descending for largest/most)
  const isAscending = category.includes('smallest') || category.includes('least')
  const sorted = withValues.sort((a, b) => {
    return isAscending ? a.value - b.value : b.value - a.value
  })

  // Add rank and limit results
  return sorted.slice(0, limit).map((country, index) => ({
    ...country,
    rank: index + 1,
  }))
}

/**
 * Get category info by ID
 */
export function getCategoryInfo(category: RankingCategory): RankingCategoryInfo {
  return RANKING_CATEGORIES.find(cat => cat.id === category)!
}
