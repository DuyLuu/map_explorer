import { useQuery } from '@tanstack/react-query'
import { fetchCountriesData } from 'services/countryService'
import { isBundledDataLoaded } from 'services/bundledDataService'

interface Country {
  id: number
  name: string
  flagUrl: string
}

interface CountryResponse {
  name: {
    common: string
  }
  flags: {
    svg?: string
    png?: string
  }
}

/**
 * Hook to access countries data with optimizations for bundled/preloaded data
 *
 * This hook integrates with the app's startup data loading to provide
 * optimal performance and user experience.
 */
export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountriesData,
    staleTime: Infinity, // Countries data rarely changes
    gcTime: Infinity, // Keep data in cache indefinitely (was cacheTime in older versions)
    refetchOnMount: false, // Don't refetch if data already exists
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: (failureCount, error) => {
      // If bundled data is available, don't retry failed network requests
      // since we have offline fallback
      if (isBundledDataLoaded()) {
        console.log('📱 Using cached bundled data, skipping retry for network error')
        return false
      }

      // Otherwise, retry up to 2 times for genuine errors
      return failureCount < 2
    },
    meta: {
      // Add metadata to help with debugging
      description: 'Countries data loaded from bundled offline source',
    },
  })
}
