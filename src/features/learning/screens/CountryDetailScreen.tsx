import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Icon from 'react-native-vector-icons/Ionicons'
import { CountryWithRegion } from '../../../types/region'
import { getCountryDetails } from '../services/countryDataService'
import CountryHeader from '../components/CountryHeader'
import CountryMapSection from '../components/CountryMapSection'
import CountryTabs from '../components/CountryTabs'

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
type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const CountryDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const route = useRoute<CountryDetailRouteProp>()
  const { country } = route.params

  const [selectedTab, setSelectedTab] = useState<'overview' | 'culture' | 'history' | 'geography'>(
    'overview'
  )

  const countryDetails = getCountryDetails(country.name)

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{country.name}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <CountryHeader country={country} />

        <CountryMapSection country={country} countryDetails={countryDetails} />

        <CountryTabs
          country={country}
          countryDetails={countryDetails}
          selectedTab={selectedTab}
          onTabSelect={setSelectedTab}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E1E1E1',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
})

export default CountryDetailScreen
