import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCountries } from '../../../hooks/useCountries'
import { CountryWithRegion, Region } from '../../../types/region'
import { getCountriesByEntityType } from '../../../services/countryService'
import CountryCard from '../components/CountryCard'
import SearchBar from '../components/SearchBar'
import RegionFilter from '../components/RegionFilter'

type RootStackParamList = {
  CountryDetail: { country: CountryWithRegion }
  TopCountries: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const LearningTabScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { data: countries, isLoading, error } = useCountries()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all' | 'territories'>('all')

  // Filter and sort countries
  const filteredCountries = useMemo(() => {
    if (!countries) return []

    let filtered = countries

    // Handle special filters first
    if (selectedRegion === 'all') {
      // Show only countries (no territories)
      filtered = filtered.filter(country => (country.entityType || 'country') === 'country')
    } else if (selectedRegion === 'territories') {
      // Show only territories
      filtered = filtered.filter(country => (country.entityType || 'country') === 'territory')
    } else {
      // Filter by specific region (only countries, not territories)
      filtered = filtered.filter(
        country =>
          country.region === selectedRegion && (country.entityType || 'country') === 'country'
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(country => country.name.toLowerCase().includes(query))
    }

    // Sort alphabetically
    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [countries, searchQuery, selectedRegion])

  const handleCountryPress = (country: CountryWithRegion) => {
    navigation.navigate('CountryDetail', { country })
  }

  const handleTopCountriesPress = () => {
    navigation.navigate('TopCountries')
  }

  // Update the subtitle to be more descriptive
  const getSubtitle = () => {
    if (selectedRegion === 'territories') {
      return `Explore ${filteredCountries.length} territories and dependencies`
    }
    return `Explore ${filteredCountries.length} countries around the world`
  }

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>
        {selectedRegion === 'territories' ? 'No territories found' : 'No countries found'}
      </Text>
      <Text style={styles.emptySubtext}>Try adjusting your search or filter</Text>
    </View>
  )

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading countries...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load countries</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Learning Center</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>
        <TouchableOpacity style={styles.topCountriesButton} onPress={handleTopCountriesPress}>
          <Text style={styles.topCountriesIcon}>🏆</Text>
          <Text style={styles.topCountriesText}>Top Countries</Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={
          selectedRegion === 'territories' ? 'Search territories...' : 'Search countries...'
        }
      />

      <RegionFilter selectedRegion={selectedRegion} onRegionSelect={setSelectedRegion} />

      <FlatList
        data={filteredCountries}
        keyExtractor={item => `country-${item.id}`}
        renderItem={({ item }) => <CountryCard country={item} onPress={handleCountryPress} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  topCountriesButton: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    marginLeft: 16,
  },
  topCountriesIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  topCountriesText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
})

export default LearningTabScreen
