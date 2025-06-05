import { Region } from '../types/region'

export const getRegionDescription = (region: Region): string => {
  const descriptions: Record<Region, string> = {
    [Region.WORLD]: 'All countries worldwide',
    [Region.EUROPE]: '47 European countries',
    [Region.AFRICA]: '54 African countries',
    [Region.ASIA]: '48 Asian countries',
    [Region.NORTH_AMERICA]: '23 North American countries',
    [Region.SOUTH_AMERICA]: '12 South American countries',
    [Region.OCEANIA]: '14 Oceanian countries',
  }
  return descriptions[region] || 'Explore this region'
}
