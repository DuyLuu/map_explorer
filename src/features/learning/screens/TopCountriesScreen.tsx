import React, { useState, useMemo } from 'react'
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { CountryWithRegion } from 'types/region'
import { useCountries } from 'hooks/useCountries'
import {
  getRankedCountries,
  RankingCategory,
  RankedCountry,
  RANKING_CATEGORIES,
  getCategoryInfo,
} from 'utils/countryRankings'
import BackButton from 'components/BackButton'
import { FontAwesomeIcon } from 'components/Icon'
import { getFlagAssetByName } from 'services/flagAssetService'
import { Theme } from 'theme/constants'

type RootStackParamList = {
  CountryDetail: { country: CountryWithRegion }
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const TopCountriesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { data: countries, isLoading, error } = useCountries()
  const [selectedCategory, setSelectedCategory] = useState<RankingCategory>('most_populous')

  // Get ranked countries for the selected category
  const rankedCountries = useMemo(() => {
    if (!countries) return []
    return getRankedCountries(countries, selectedCategory, 50)
  }, [countries, selectedCategory])

  // Get top country for each category (for tab images)
  const topCountriesByCategory = useMemo((): Record<RankingCategory, RankedCountry | null> => {
    if (!countries) return {} as Record<RankingCategory, RankedCountry | null>
    const topCountries: Record<RankingCategory, RankedCountry | null> = {} as Record<
      RankingCategory,
      RankedCountry | null
    >

    RANKING_CATEGORIES.forEach(category => {
      const ranked = getRankedCountries(countries, category.id, 1)
      topCountries[category.id] = ranked.length > 0 ? ranked[0] : null
    })

    return topCountries
  }, [countries])

  const categoryInfo = getCategoryInfo(selectedCategory)

  const handleCountryPress = (country: CountryWithRegion) => {
    navigation.navigate('CountryDetail', { country })
  }

  const renderCategoryTab = (category: RankingCategory) => {
    const info = getCategoryInfo(category)
    const isSelected = selectedCategory === category
    const topCountry = topCountriesByCategory[category]
    const flagAsset = topCountry ? getFlagAssetByName(topCountry.name) : null

    const tabStyles = [styles.categoryTab, isSelected ? styles.selectedCategoryTab : null].filter(
      Boolean
    ) as import('react-native').ViewStyle[]

    return (
      <Button
        key={category}
        style={tabStyles}
        onPress={() => setSelectedCategory(category)}
        padding="m"
        borderRadius={12}
        backgroundColor={isSelected ? Theme.colors.primary : '#f0f0f0'}
        marginRight="xs"
      >
        <Box row centerItems paddingVertical="s">
          {flagAsset && (
            <Box marginRight="xs">
              <Image source={flagAsset} style={styles.categoryFlagImage} resizeMode="contain" />
            </Box>
          )}
          <Box flex marginLeft="s">
            <Text
              variant="bodySmall"
              weight="bold"
              color={isSelected ? '#fff' : Theme.colors.baseBlack}
            >
              {info.title}
            </Text>
            <Text
              marginTop="xs"
              variant="label"
              muted
              color={isSelected ? '#fff' : Theme.colors.subText}
            >
              {info.description}
            </Text>
          </Box>
        </Box>
      </Button>
    )
  }

  const renderCountryItem = ({ item }: { item: RankedCountry }) => {
    const flagAsset = getFlagAssetByName(item.name)

    return (
      <Button
        style={styles.countryItem}
        onPress={() => handleCountryPress(item)}
        borderRadius={12}
        backgroundColor="#fff"
        marginBottom="sm"
        shadow="default"
      >
        <Box row flex fullWidth spaceBetween center>
          {item.rank <= 3 ? (
            <Text variant="body" weight="bold" center>
              {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
            </Text>
          ) : (
            <Text variant="body" weight="bold" center>
              #{item.rank}
            </Text>
          )}
          <Box row flex marginLeft="m">
            <Box>
              {flagAsset ? (
                <Image source={flagAsset} style={styles.flagImage} resizeMode="contain" />
              ) : (
                <Box marginLeft="m" backgroundColor="#f0f0f0" center>
                  <Text size={16}>🏳️</Text>
                </Box>
              )}
            </Box>
            <Box marginLeft="m">
              <Text style={styles.countryName}>{item.name}</Text>
              <Text style={styles.countryValue}>{item.formattedValue}</Text>
            </Box>
          </Box>

          <FontAwesomeIcon name="angle-right" size={20} color="#999" />
        </Box>
      </Button>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Box
          row
          centerItems
          paddingHorizontal="m"
          paddingVertical="sm"
          backgroundColor="white"
          style={styles.headerBorder}
        >
          <BackButton />
          <Text style={styles.title}>Top Countries</Text>
        </Box>
        <Box flex center>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading rankings...</Text>
        </Box>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Box
          row
          centerItems
          paddingHorizontal="m"
          paddingVertical="sm"
          backgroundColor="white"
          style={styles.headerBorder}
        >
          <BackButton />
          <Text style={styles.title}>Top Countries</Text>
        </Box>
        <Box flex center>
          <Text style={styles.errorText}>Failed to load country data</Text>
        </Box>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Box
        row
        centerItems
        paddingHorizontal="m"
        paddingVertical="sm"
        backgroundColor="white"
        style={styles.headerBorder}
      >
        <BackButton />
        <Text variant="h5" weight="bold">
          Top Countries
        </Text>
      </Box>

      {/* Category Tabs */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
        data={RANKING_CATEGORIES}
        renderItem={({ item }) => renderCategoryTab(item.id)}
      />

      {/* Rankings List */}
      <FlatList
        data={rankedCountries}
        keyExtractor={item => `${selectedCategory}-${item.id}`}
        renderItem={renderCountryItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Box paddingVertical="xl" centerItems>
            <Text style={styles.emptyText}>No data available for this category</Text>
          </Box>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  flagImage: {
    height: 64,
    aspectRatio: 1.2,
    borderRadius: 6,
  },
  categoryFlagImage: {
    height: 24,
    aspectRatio: 1.2,
    borderRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryTab: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    minWidth: 120,
  },
  selectedCategoryTab: {
    backgroundColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 2,
  },
  selectedCategoryTitle: {
    color: '#fff',
  },
  categoryDescription: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  selectedCategoryDescription: {
    color: '#fff',
    opacity: 0.9,
  },
  currentCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  currentCategoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  currentCategoryInfo: {
    flex: 1,
  },
  currentCategoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  currentCategoryDescription: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  countryItem: {
    marginBottom: 8,
    borderRadius: 12,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 50,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  topRankText: {
    color: '#007AFF',
    fontSize: 18,
  },
  medalEmoji: {
    fontSize: 16,
    marginTop: 2,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  countryValue: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 18,
    color: '#ccc',
    marginLeft: 8,
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
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
})

export default TopCountriesScreen
