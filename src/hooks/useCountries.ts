import { useQuery } from '@tanstack/react-query'
import { fetchCountriesData } from '../services/countryService'

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

// async function fetchCountriesData(): Promise<Country[]> {
//   const response = await fetch('https://restcountries.com/v3.1/all')
//   const data = await response.json()
//   return data.map((country: CountryResponse, index: number) => ({
//     id: index + 1,
//     name: country.name.common,
//     flagUrl: country.flags?.png,
//   }))
// }

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountriesData,
    staleTime: Infinity, // Countries data rarely changes
    cacheTime: Infinity, // Keep the data cached indefinitely
  })
} 