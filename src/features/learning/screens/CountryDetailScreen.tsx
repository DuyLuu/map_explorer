import React from 'react'
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import { useRoute, RouteProp } from '@react-navigation/native'
import { CountryWithRegion } from 'types/region'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import BackButton from 'components/BackButton'

import { getCountryDetails } from '../services/countryDataService'
import CountryHeader from '../components/CountryHeader'
import CountryMapSection from '../components/CountryMapSection'

/**
 * CountryDetailScreen - Enhanced to use fresh API data
 *
 * Now displays:
 * - Basic info: name, flag, region, level (from CountryWithRegion)
 * - Fresh API data: population, area, capital (from updated countries.json v2.0.0)
 * - Rich details: cultural facts, history, geography (from countryDataService)
 *
 * Data flow:
 * 1. Route provides country with fresh API fields
 * 2. CountryHeader displays: flag, name, region, capital, population, area
 * 3. getCountryDetails provides additional rich content for tabs
 * 4. CountryTabs show detailed cultural, historical, and geographic information
 */

type RootStackParamList = {
  CountryDetail: { country: CountryWithRegion }
}

type CountryDetailRouteProp = RouteProp<RootStackParamList, 'CountryDetail'>

const CountryDetailScreen: React.FC = () => {
  const route = useRoute<CountryDetailRouteProp>()
  const { country } = route.params

  const countryDetails = getCountryDetails(country.name)

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Box
        row
        centerItems
        spaceBetween
        paddingHorizontal="ml"
        paddingVertical="m"
        style={styles.headerBorder}
      >
        <BackButton />
        <Text variant="h5" weight="bold">
          {country.name}
        </Text>
        <Box style={{ width: 32 }} />
      </Box>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <CountryHeader country={country} />

        <CountryMapSection country={country} countryDetails={countryDetails} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#E1E1E1'
  },
  backButton: {
    padding: 4
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333'
  },
  content: {
    flex: 1
  }
})

export default CountryDetailScreen
