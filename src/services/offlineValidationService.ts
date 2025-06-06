import { Platform } from 'react-native'
import {
  getBundledCountries,
  isBundledDataLoaded,
  getBundledDataStatus,
} from './bundledDataService'
import { getFlagAssetByCode, hasFlagAsset, getCountryCode } from './flagAssetService'

export interface OfflineValidationResult {
  isValid: boolean
  summary: {
    countriesLoaded: number
    flagsAvailable: number
    flagsMissing: number
    totalSize: string
    platform: string
    loadTime?: number
  }
  issues: string[]
  warnings: string[]
  recommendations: string[]
}

export interface PerformanceMetrics {
  dataLoadTime: number
  flagPreloadTime: number
  totalStartupTime: number
  memoryUsage?: number
}

/**
 * Comprehensive validation of offline functionality
 * Tests data integrity, asset availability, and overall system health
 */
export async function validateOfflineCapability(): Promise<OfflineValidationResult> {
  const startTime = Date.now()
  const issues: string[] = []
  const warnings: string[] = []
  const recommendations: string[] = []

  console.log('🔍 Starting comprehensive offline validation...')

  try {
    // 1. Validate bundled data is loaded
    console.log('📊 Checking bundled data status...')
    const dataStatus = getBundledDataStatus()

    if (!dataStatus.isLoaded) {
      issues.push('Bundled data is not loaded')
      return createValidationResult(false, dataStatus, issues, warnings, recommendations, 0)
    }

    if (dataStatus.loadError) {
      warnings.push(`Data load warning: ${dataStatus.loadError}`)
    }

    // 2. Get countries data
    console.log('🌍 Validating countries data...')
    const countries = await getBundledCountries()

    if (countries.length === 0) {
      issues.push('No countries loaded from bundled data')
      return createValidationResult(
        false,
        dataStatus,
        issues,
        warnings,
        recommendations,
        countries.length
      )
    }

    console.log(`✓ Found ${countries.length} countries`)

    // 3. Validate flag assets availability
    console.log('🏁 Checking flag asset coverage...')
    let flagsAvailable = 0
    let flagsMissing = 0
    const missingFlags: string[] = []
    const problematicCountries: string[] = []

    for (const country of countries) {
      const countryCode = getCountryCode(country.name)

      if (!countryCode) {
        problematicCountries.push(country.name)
        continue
      }

      if (hasFlagAsset(countryCode)) {
        flagsAvailable++

        // Test that the flag asset can actually be loaded
        try {
          const flagAsset = getFlagAssetByCode(countryCode)
          if (!flagAsset) {
            warnings.push(
              `Flag asset exists but failed to load for ${country.name} (${countryCode})`
            )
          }
        } catch (error) {
          warnings.push(`Flag loading error for ${country.name}: ${error}`)
        }
      } else {
        flagsMissing++
        missingFlags.push(`${country.name} (${countryCode})`)
      }
    }

    console.log(`✓ Flags available: ${flagsAvailable}`)
    console.log(`⚠ Flags missing: ${flagsMissing}`)

    // 4. Report missing flags
    if (flagsMissing > 0) {
      warnings.push(`${flagsMissing} flags are missing`)

      if (flagsMissing <= 5) {
        warnings.push(`Missing flags for: ${missingFlags.join(', ')}`)
      } else {
        warnings.push(
          `Missing flags include: ${missingFlags.slice(0, 5).join(', ')} and ${
            flagsMissing - 5
          } more`
        )
      }
    }

    // 5. Report problematic countries (no country code mapping)
    if (problematicCountries.length > 0) {
      warnings.push(`${problematicCountries.length} countries have no country code mapping`)

      if (problematicCountries.length <= 3) {
        warnings.push(`Countries without codes: ${problematicCountries.join(', ')}`)
      }
    }

    // 6. Performance and optimization recommendations
    const coveragePercentage = (flagsAvailable / countries.length) * 100

    if (coveragePercentage < 95) {
      recommendations.push('Consider downloading missing flag assets for complete offline coverage')
    }

    if (coveragePercentage >= 98) {
      recommendations.push('Excellent flag coverage! Your app is fully offline-ready')
    }

    if (countries.length > 200) {
      recommendations.push(
        "Consider lazy loading flags for countries not in user's selected difficulty levels to reduce bundle size"
      )
    }

    // 7. Data integrity checks
    console.log('🔧 Performing data integrity checks...')

    const duplicateIds = findDuplicateIds(countries)
    if (duplicateIds.length > 0) {
      issues.push(`Found duplicate country IDs: ${duplicateIds.join(', ')}`)
    }

    const duplicateNames = findDuplicateNames(countries)
    if (duplicateNames.length > 0) {
      warnings.push(`Found duplicate country names: ${duplicateNames.join(', ')}`)
    }

    const invalidLevels = countries.filter(c => !c.level || c.level < 1 || c.level > 3)
    if (invalidLevels.length > 0) {
      issues.push(`${invalidLevels.length} countries have invalid difficulty levels`)
    }

    const countriesWithoutRegion = countries.filter(c => !c.region)
    if (countriesWithoutRegion.length > 0) {
      warnings.push(`${countriesWithoutRegion.length} countries have no region assigned`)
    }

    const loadTime = Date.now() - startTime
    const isValid = issues.length === 0

    console.log(`${isValid ? '✅' : '❌'} Offline validation completed in ${loadTime}ms`)

    return createValidationResult(
      isValid,
      dataStatus,
      issues,
      warnings,
      recommendations,
      countries.length,
      flagsAvailable,
      flagsMissing,
      loadTime
    )
  } catch (error) {
    console.error('❌ Offline validation failed:', error)
    issues.push(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)

    return createValidationResult(false, null, issues, warnings, recommendations, 0)
  }
}

/**
 * Test app functionality in airplane mode simulation
 * Validates that all critical features work without network
 */
export async function simulateOfflineTest(): Promise<{
  success: boolean
  errors: string[]
  functionalFeatures: string[]
}> {
  console.log('✈️ Simulating airplane mode functionality test...')

  const errors: string[] = []
  const functionalFeatures: string[] = []

  try {
    // Test 1: Data loading
    console.log('📊 Testing data access...')
    const countries = await getBundledCountries()
    if (countries.length > 0) {
      functionalFeatures.push(`Country data (${countries.length} countries)`)
    } else {
      errors.push('Country data not accessible')
    }

    // Test 2: Flag assets
    console.log('🏁 Testing flag assets...')
    const testCountries = ['us', 'ca', 'gb', 'fr', 'de']
    let flagsWorking = 0

    for (const code of testCountries) {
      try {
        const flagAsset = getFlagAssetByCode(code)
        if (flagAsset) {
          flagsWorking++
        }
      } catch (error) {
        errors.push(`Flag loading failed for ${code}`)
      }
    }

    if (flagsWorking > 0) {
      functionalFeatures.push(
        `Flag assets (${flagsWorking}/${testCountries.length} test flags working)`
      )
    }

    // Test 3: Data filtering
    console.log('🔍 Testing data filtering...')
    try {
      const level1Countries = countries.filter(c => c.level === 1)
      const asiaCountries = countries.filter(c => c.region === 'asia')

      if (level1Countries.length > 0 && asiaCountries.length > 0) {
        functionalFeatures.push(
          `Data filtering (${level1Countries.length} level 1, ${asiaCountries.length} Asia)`
        )
      } else {
        errors.push('Data filtering not working properly')
      }
    } catch (error) {
      errors.push('Data filtering failed')
    }

    console.log(
      `✅ Offline simulation completed: ${functionalFeatures.length} features working, ${errors.length} errors`
    )

    return {
      success: errors.length === 0,
      errors,
      functionalFeatures,
    }
  } catch (error) {
    console.error('❌ Offline simulation failed:', error)
    errors.push(`Simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)

    return {
      success: false,
      errors,
      functionalFeatures,
    }
  }
}

/**
 * Measure and report performance metrics for optimization
 */
export async function measurePerformanceMetrics(): Promise<PerformanceMetrics> {
  console.log('⚡ Measuring performance metrics...')

  // Data load performance
  const dataStartTime = Date.now()
  await getBundledCountries()
  const dataLoadTime = Date.now() - dataStartTime

  // Flag preload performance (simulate preloading common flags)
  const flagStartTime = Date.now()
  const commonFlags = ['us', 'ca', 'gb', 'fr', 'de', 'jp', 'au', 'br', 'in', 'cn']

  for (const code of commonFlags) {
    try {
      getFlagAssetByCode(code)
    } catch (error) {
      // Silently handle missing flags during performance test
    }
  }
  const flagPreloadTime = Date.now() - flagStartTime

  const totalStartupTime = dataLoadTime + flagPreloadTime

  console.log(
    `📊 Performance metrics: Data=${dataLoadTime}ms, Flags=${flagPreloadTime}ms, Total=${totalStartupTime}ms`
  )

  return {
    dataLoadTime,
    flagPreloadTime,
    totalStartupTime,
  }
}

/**
 * Generate optimization recommendations based on performance and usage
 */
export function generateOptimizationRecommendations(
  validation: OfflineValidationResult,
  performance: PerformanceMetrics
): string[] {
  const recommendations: string[] = []

  // Performance recommendations
  if (performance.dataLoadTime > 100) {
    recommendations.push('Consider implementing progressive data loading for faster startup')
  }

  if (performance.flagPreloadTime > 50) {
    recommendations.push(
      'Flag preloading could be optimized - consider lazy loading non-essential flags'
    )
  }

  if (performance.totalStartupTime > 200) {
    recommendations.push('Total startup time is high - consider background loading strategies')
  }

  // Bundle size recommendations
  const flagsMB = parseFloat(validation.summary.totalSize.replace('M', ''))
  if (flagsMB > 2) {
    recommendations.push(
      'Flag assets are large - consider further image compression or WebP format'
    )
  }

  // Coverage recommendations
  const flagCoverage =
    (validation.summary.flagsAvailable / validation.summary.countriesLoaded) * 100
  if (flagCoverage < 95) {
    recommendations.push('Download missing flags to achieve complete offline coverage')
  }

  // Platform-specific recommendations
  if (Platform.OS === 'ios') {
    recommendations.push('Consider using iOS-specific image optimization for better performance')
  } else if (Platform.OS === 'android') {
    recommendations.push('Consider using Android vector drawables for scalable flag assets')
  }

  return recommendations
}

// Helper functions
function createValidationResult(
  isValid: boolean,
  dataStatus: any,
  issues: string[],
  warnings: string[],
  recommendations: string[],
  countriesCount: number,
  flagsAvailable: number = 0,
  flagsMissing: number = 0,
  loadTime?: number
): OfflineValidationResult {
  return {
    isValid,
    summary: {
      countriesLoaded: countriesCount,
      flagsAvailable,
      flagsMissing,
      totalSize: '1.1M', // Static size from our analysis
      platform: Platform.OS,
      loadTime,
    },
    issues,
    warnings,
    recommendations,
  }
}

function findDuplicateIds(countries: any[]): number[] {
  const ids = countries.map(c => c.id)
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
  return Array.from(new Set(duplicates))
}

function findDuplicateNames(countries: any[]): string[] {
  const names = countries.map(c => c.name)
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
  return Array.from(new Set(duplicates))
}
