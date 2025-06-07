import React, { useState, useMemo } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCountries } from '../../../hooks/useCountries'
import { CountryWithRegion } from '../../../types/region'
import {
  getRankedCountries,
  RankingCategory,
  RankedCountry,
  RANKING_CATEGORIES,
  getCategoryInfo,
} from '../../../utils/countryRankings'
import BackButton from '../../../components/BackButton'
import Text from '../../../components'

type RootStackParamList = {
  CountryDetail: { country: CountryWithRegion }
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const TopCountriesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { data: countries, isLoading, error } = useCountries()
  const [selectedCategory, setSelectedCategory] = useState<RankingCategory>('largest_area')

  // Get ranked countries for the selected category
  const rankedCountries = useMemo(() => {
    if (!countries) return []
    return getRankedCountries(countries, selectedCategory, 20)
  }, [countries, selectedCategory])

  const categoryInfo = getCategoryInfo(selectedCategory)

  const handleCountryPress = (country: CountryWithRegion) => {
    navigation.navigate('CountryDetail', { country })
  }

  const renderCategoryTab = (category: RankingCategory) => {
    const info = getCategoryInfo(category)
    const isSelected = selectedCategory === category

    return (
      <TouchableOpacity
        key={category}
        style={[styles.categoryTab, isSelected && styles.selectedCategoryTab]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text variant="body" weight="bold" center marginTop="m">
          {info.icon}
        </Text>
        <Text variant="body" weight="bold" center marginTop="m">
          {info.title}
        </Text>
        <Text variant="body" center marginTop="m">
          {info.description}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderCountryItem = ({ item }: { item: RankedCountry }) => (
    <TouchableOpacity style={styles.countryItem} onPress={() => handleCountryPress(item)}>
      <View style={styles.rankContainer}>
        <Text variant="body" weight="bold" center marginTop="m">
          #{item.rank}
        </Text>
        {item.rank <= 3 && (
          <Text variant="body" weight="bold" center marginTop="m">
            {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : '🥉'}
          </Text>
        )}
      </View>

      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.countryValue}>{item.formattedValue}</Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  )

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>Top Countries</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading rankings...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>Top Countries</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load country data</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Top Countries</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {RANKING_CATEGORIES.map(category => renderCategoryTab(category.id))}
      </ScrollView>

      {/* Current Category Info */}
      <View style={styles.currentCategoryContainer}>
        <Text style={styles.currentCategoryIcon}>{categoryInfo.icon}</Text>
        <View style={styles.currentCategoryInfo}>
          <Text style={styles.currentCategoryTitle}>{categoryInfo.title}</Text>
          <Text style={styles.currentCategoryDescription}>{categoryInfo.description}</Text>
        </View>
      </View>

      {/* Rankings List */}
      <FlatList
        data={rankedCountries}
        keyExtractor={item => `${selectedCategory}-${item.id}`}
        renderItem={renderCountryItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No data available for this category</Text>
          </View>
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
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
})

export default TopCountriesScreen
