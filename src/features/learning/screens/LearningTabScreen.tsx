import React, { useState, useMemo } from 'react'
import { StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import SearchBar from '../components/SearchBar'
import RegionFilter from '../components/RegionFilter'
import CountryCard from '../components/CountryCard'
import { CountryWithRegion, Region } from 'types/region'
import { useCountries } from 'hooks/useCountries'

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

  // Filter and sort countries based on current selections
  const filteredCountries = useMemo(() => {
    if (!countries) return []

    let filtered = countries

    // Handle special filters first
    if (selectedRegion === 'all') {
      // Show only countries (no territories)
      filtered = filtered.filter(
        (country: CountryWithRegion) => (country.entityType || 'country') === 'country'
      )
    } else if (selectedRegion === 'territories') {
      // Show only territories
      filtered = filtered.filter(
        (country: CountryWithRegion) => (country.entityType || 'country') === 'territory'
      )
    } else {
      // Filter by specific region (only countries, not territories)
      filtered = filtered.filter(
        (country: CountryWithRegion) =>
          country.region === selectedRegion && (country.entityType || 'country') === 'country'
      )
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((country: CountryWithRegion) =>
        country.name.toLowerCase().includes(query)
      )
    }

    // Sort alphabetically
    return filtered.sort((a: CountryWithRegion, b: CountryWithRegion) =>
      a.name.localeCompare(b.name)
    )
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
    <Box paddingVertical="xl" centerItems>
      <Text variant="body" weight="bold" center marginTop="m">
        {selectedRegion === 'territories' ? 'No territories found' : 'No countries found'}
      </Text>
      <Text variant="body" center marginTop="m">
        Try adjusting your search or filter
      </Text>
    </Box>
  )

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex center>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading countries...</Text>
        </Box>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex center>
          <Text style={styles.errorText}>Failed to load countries</Text>
        </Box>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Box
        row
        centerItems
        spaceBetween
        paddingHorizontal="m"
        paddingVertical="m"
        backgroundColor="white"
        style={styles.headerBorder}
      >
        <Box flex>
          <Text style={styles.title}>Learning Center</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </Box>
        <Button
          style={styles.topCountriesButton}
          onPress={handleTopCountriesPress}
          padding="sm"
          borderRadius={8}
          backgroundColor="#f8f8f8"
        >
          <Text style={styles.topCountriesIcon}>🏆</Text>
          <Text style={styles.topCountriesText}>Top Countries</Text>
        </Button>
      </Box>

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
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
  },
})

export default LearningTabScreen
