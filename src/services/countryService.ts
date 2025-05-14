import { QueryClient } from '@tanstack/react-query'

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

let queryClient: QueryClient | null = null

export function setQueryClient(client: QueryClient) {
  queryClient = client
}

export async function fetchCountriesData(): Promise<Country[]> {
  const response = await fetch('https://restcountries.com/v3.1/all')
  const data = await response.json()
  return data.map((country: CountryResponse, index: number) => ({
    id: index + 1,
    name: country.name.common,
    flagUrl: country.flags?.png,
  }))
}

export function getCountries(): Country[] | undefined {
  if (!queryClient) {
    throw new Error('QueryClient not initialized')
  }
  return queryClient.getQueryData<Country[]>(['countries'])
} 