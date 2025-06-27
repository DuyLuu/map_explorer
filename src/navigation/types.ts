import { CountryWithRegion } from '../types/region'

export type RootStackParamList = {
  MainTabs: undefined
  DashboardTab: undefined
  FlagRegionSelection: undefined
  FlagProgressDetail: undefined
  Quiz: undefined
  Progress: undefined
  MapRegionSelection: undefined
  MapQuiz: undefined
  ChallengeQuiz: undefined
  Settings: undefined
  MapProgressDetail: undefined
  CountryDetail: { country: CountryWithRegion }
  TopCountries: undefined
}
