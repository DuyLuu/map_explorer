export enum Region {
  WORLD = 'world',
  EUROPE = 'europe',
  ASIA = 'asia',
  NORTH_AMERICA = 'north_america',
  SOUTH_AMERICA = 'south_america',
  AFRICA = 'africa',
  OCEANIA = 'oceania',
  TERRITORIES = 'territories',
}

export interface RegionInfo {
  id: Region
  name: string
  displayName: string
  mapBounds: {
    latitude: number
    longitude: number
    latitudeDelta: number
    longitudeDelta: number
  }
}

export interface CountryWithRegion {
  id: number
  name: string
  flagUrl: string
  level: number
  region: Region
  entityType?: 'country' | 'territory'
  // New fields from updated countries.json v2.0.0
  countryCode?: string
  population?: number
  area?: number
  capital?: string
  apiRegion?: string
  subregion?: string
}

// Region display information and map bounds
export const REGION_INFO: Record<Region, RegionInfo> = {
  [Region.WORLD]: {
    id: Region.WORLD,
    name: 'world',
    displayName: 'World',
    mapBounds: {
      latitude: 20,
      longitude: 0,
      latitudeDelta: 100,
      longitudeDelta: 180,
    },
  },
  [Region.EUROPE]: {
    id: Region.EUROPE,
    name: 'europe',
    displayName: 'Europe',
    mapBounds: {
      latitude: 54,
      longitude: 15,
      latitudeDelta: 25,
      longitudeDelta: 35,
    },
  },
  [Region.ASIA]: {
    id: Region.ASIA,
    name: 'asia',
    displayName: 'Asia',
    mapBounds: {
      latitude: 35,
      longitude: 100,
      latitudeDelta: 50,
      longitudeDelta: 80,
    },
  },
  [Region.NORTH_AMERICA]: {
    id: Region.NORTH_AMERICA,
    name: 'north_america',
    displayName: 'North America',
    mapBounds: {
      latitude: 45,
      longitude: -100,
      latitudeDelta: 40,
      longitudeDelta: 60,
    },
  },
  [Region.SOUTH_AMERICA]: {
    id: Region.SOUTH_AMERICA,
    name: 'south_america',
    displayName: 'South America',
    mapBounds: {
      latitude: -15,
      longitude: -60,
      latitudeDelta: 50,
      longitudeDelta: 40,
    },
  },
  [Region.AFRICA]: {
    id: Region.AFRICA,
    name: 'africa',
    displayName: 'Africa',
    mapBounds: {
      latitude: 0,
      longitude: 20,
      latitudeDelta: 60,
      longitudeDelta: 50,
    },
  },
  [Region.OCEANIA]: {
    id: Region.OCEANIA,
    name: 'oceania',
    displayName: 'Oceania',
    mapBounds: {
      latitude: -25,
      longitude: 140,
      latitudeDelta: 40,
      longitudeDelta: 60,
    },
  },
  [Region.TERRITORIES]: {
    id: Region.TERRITORIES,
    name: 'territories',
    displayName: 'Territories & Dependencies',
    mapBounds: {
      latitude: 20,
      longitude: 0,
      latitudeDelta: 100,
      longitudeDelta: 180,
    },
  },
}
