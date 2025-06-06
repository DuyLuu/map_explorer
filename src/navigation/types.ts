import { CountryWithRegion } from '../types/region'

export type RootStackParamList = {
  MainTabs: undefined
  Home: undefined
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
}
