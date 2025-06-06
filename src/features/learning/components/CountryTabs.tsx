import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { CountryWithRegion, REGION_INFO } from '../../../types/region'

interface CountryDetailData {
  capital: string
  population: string
  languages: string[]
  currency: string
  area: string
  culturalFacts: string[]
  historicalHighlights: string[]
  geographicFeatures: string[]
}

interface CountryTabsProps {
  country: CountryWithRegion
  countryDetails: CountryDetailData
  selectedTab: 'overview' | 'culture' | 'history' | 'geography'
  onTabSelect: (tab: 'overview' | 'culture' | 'history' | 'geography') => void
}

const CountryTabs: React.FC<CountryTabsProps> = ({
  country,
  countryDetails,
  selectedTab,
  onTabSelect,
}) => {
  const regionInfo = REGION_INFO[country.region]

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'culture', label: 'Culture' },
    { key: 'history', label: 'History' },
    { key: 'geography', label: 'Geography' },
  ]

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Capital:</Text>
                <Text style={styles.infoValue}>{countryDetails.capital}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Population:</Text>
                <Text style={styles.infoValue}>{countryDetails.population}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Languages:</Text>
                <Text style={styles.infoValue}>{countryDetails.languages.join(', ')}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Currency:</Text>
                <Text style={styles.infoValue}>{countryDetails.currency}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Area:</Text>
                <Text style={styles.infoValue}>{countryDetails.area}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Region:</Text>
                <Text style={styles.infoValue}>{regionInfo?.displayName || country.region}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Difficulty Level:</Text>
                <Text style={styles.infoValue}>Level {country.level}</Text>
              </View>
            </View>
          </View>
        )
      case 'culture':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Cultural Facts</Text>
            {countryDetails.culturalFacts.map((fact: string, index: number) => (
              <View key={index} style={styles.factItem}>
                <Text style={styles.factBullet}>•</Text>
                <Text style={styles.factText}>{fact}</Text>
              </View>
            ))}
          </View>
        )
      case 'history':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Historical Highlights</Text>
            {countryDetails.historicalHighlights.map((highlight: string, index: number) => (
              <View key={index} style={styles.factItem}>
                <Text style={styles.factBullet}>•</Text>
                <Text style={styles.factText}>{highlight}</Text>
              </View>
            ))}
          </View>
        )
      case 'geography':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Geographic Features</Text>
            {countryDetails.geographicFeatures.map((feature: string, index: number) => (
              <View key={index} style={styles.factItem}>
                <Text style={styles.factBullet}>•</Text>
                <Text style={styles.factText}>{feature}</Text>
              </View>
            ))}
          </View>
        )
      default:
        return null
    }
  }

  return (
    <>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selectedTab === tab.key && styles.selectedTab]}
              onPress={() => onTabSelect(tab.key as any)}
            >
              <Text style={[styles.tabText, selectedTab === tab.key && styles.selectedTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      {renderTabContent()}
    </>
  )
}

const styles = StyleSheet.create({
  tabsContainer: {
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E1E1E1',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedTabText: {
    color: '#fff',
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E1E1E1',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  factBullet: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
    marginTop: 2,
  },
  factText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    flex: 1,
  },
})

export default CountryTabs
