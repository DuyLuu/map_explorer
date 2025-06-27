import React, { useMemo, useState } from 'react'
import { SafeAreaView, FlatList, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { FormattedMessage, useIntl } from 'react-intl'
import { CountryWithRegion, Region } from 'types/region'
import { RootStackParamList } from 'navigation/types'
import { useCountries } from 'hooks/useCountries'
import SearchBar from 'features/learning/components/SearchBar'
import RegionFilter from 'features/learning/components/RegionFilter'
import CountryCard from 'features/learning/components/CountryCard'

import { useTheme } from '../theme'
import { Button } from '../components/Button'
import { Text } from '../components/Text'
import { Box } from '../components/Box'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const DashboardScreen: React.FC = () => {
  const intl = useIntl()
  const navigation = useNavigation<NavigationProp>()
  const { theme } = useTheme()
  const { data: countries, isLoading, error } = useCountries()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<Region | 'all' | 'territories'>('all')

  const filteredCountries = useMemo(() => {
    if (!countries) return []

    let filtered = countries

    if (selectedRegion === 'all') {
      filtered = filtered.filter(
        (country: CountryWithRegion) => (country.entityType || 'country') === 'country'
      )
    } else if (selectedRegion === 'territories') {
      filtered = filtered.filter(
        (country: CountryWithRegion) => (country.entityType || 'country') === 'territory'
      )
    } else {
      filtered = filtered.filter(
        (country: CountryWithRegion) =>
          country.region === selectedRegion && (country.entityType || 'country') === 'country'
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((country: CountryWithRegion) =>
        country.name.toLowerCase().includes(query)
      )
    }

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

  const getSubtitle = () => {
    if (selectedRegion === 'territories') {
      return intl.formatMessage(
        {
          id: 'learning.screen.subtitleTerritories',
          defaultMessage: '{count} territories and dependencies'
        },
        { count: filteredCountries.length }
      )
    }
    return intl.formatMessage(
      {
        id: 'learning.screen.subtitle',
        defaultMessage: '{count} countries'
      },
      { count: filteredCountries.length }
    )
  }

  const EmptyState = () => (
    <Box paddingVertical="xl" centerItems>
      <Text variant="body" weight="bold" center marginTop="m" color="text">
        {selectedRegion === 'territories' ? (
          <FormattedMessage
            id="learning.search.noResultsTerritories"
            defaultMessage="No territories found"
          />
        ) : (
          <FormattedMessage id="learning.search.noResults" defaultMessage="No countries found" />
        )}
      </Text>
      <Text variant="body" center marginTop="m" color="subText">
        <FormattedMessage
          id="learning.search.tryAdjusting"
          defaultMessage="Try adjusting your search or filter"
        />
      </Text>
    </Box>
  )

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Box flex center>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="body" weight="bold" center marginTop="m" color="subText">
            <FormattedMessage id="learning.screen.loading" defaultMessage="Loading countries..." />
          </Text>
        </Box>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Box flex center>
          <Text variant="body" weight="bold" center marginTop="m" color="danger">
            <FormattedMessage
              id="learning.screen.error"
              defaultMessage="Failed to load countries"
            />
          </Text>
        </Box>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Box
        row
        centerItems
        spaceBetween
        paddingHorizontal="m"
        paddingVertical="m"
        backgroundColor="background"
      >
        <Button
          onPress={handleTopCountriesPress}
          padding="sm"
          borderRadius="md"
          backgroundColor="lightGray"
        >
          <Text variant="bodySmall" weight="bold" color="text">
            <FormattedMessage id="learning.screen.topCountries" defaultMessage="Top Countries" />
          </Text>
        </Button>
      </Box>

      <SearchBar
        value={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder={
          selectedRegion === 'territories'
            ? intl.formatMessage({
                id: 'learning.search.placeholderTerritories',
                defaultMessage: 'Search territories...'
              })
            : intl.formatMessage({
                id: 'learning.search.placeholder',
                defaultMessage: 'Search countries...'
              })
        }
      />

      <RegionFilter selectedRegion={selectedRegion} onRegionSelect={setSelectedRegion} />
      <Text marginLeft="m" marginBottom="m" variant="h6" color="primary">
        {getSubtitle()}
      </Text>
      <FlatList
        data={filteredCountries}
        keyExtractor={item => `country-${item.id}`}
        renderItem={({ item }) => (
          <CountryCard country={item} onPress={() => handleCountryPress(item)} />
        )}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.m,
          paddingBottom: theme.spacing.xl
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
      />
    </SafeAreaView>
  )
}

export default DashboardScreen
