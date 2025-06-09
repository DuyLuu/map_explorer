import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { FormattedMessage, useIntl } from 'react-intl'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { CountryWithRegion, REGION_INFO } from 'types/region'

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
  const intl = useIntl()
  const regionInfo = REGION_INFO[country.region]

  const tabs = [
    {
      key: 'overview',
      label: intl.formatMessage({
        id: 'learning.tab.overview',
        defaultMessage: 'Overview',
      }),
    },
    {
      key: 'culture',
      label: intl.formatMessage({
        id: 'learning.tab.culture',
        defaultMessage: 'Culture',
      }),
    },
    {
      key: 'history',
      label: intl.formatMessage({
        id: 'learning.tab.history',
        defaultMessage: 'History',
      }),
    },
    {
      key: 'geography',
      label: intl.formatMessage({
        id: 'learning.tab.geography',
        defaultMessage: 'Geography',
      }),
    },
  ]

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <Box padding="ml">
            <Box backgroundColor="#f8f9fa" padding="m" borderRadius="sm">
              <Text style={styles.sectionTitle}>
                <FormattedMessage
                  id="learning.section.basicInfo"
                  defaultMessage="Basic Information"
                />
              </Text>
              <Box row spaceBetween centerItems paddingVertical="xs" style={styles.infoRowBorder}>
                <Text style={styles.infoLabel}>
                  <FormattedMessage id="learning.country.capital" defaultMessage="Capital" />:
                </Text>
                <Text style={styles.infoValue}>{countryDetails.capital}</Text>
              </Box>
              <Box row spaceBetween centerItems paddingVertical="xs" style={styles.infoRowBorder}>
                <Text style={styles.infoLabel}>
                  <FormattedMessage id="learning.country.population" defaultMessage="Population" />:
                </Text>
                <Text style={styles.infoValue}>{countryDetails.population}</Text>
              </Box>
              <Box row spaceBetween centerItems paddingVertical="xs" style={styles.infoRowBorder}>
                <Text style={styles.infoLabel}>
                  <FormattedMessage id="learning.country.languages" defaultMessage="Languages" />:
                </Text>
                <Text style={styles.infoValue}>{countryDetails.languages.join(', ')}</Text>
              </Box>
              <Box row spaceBetween centerItems paddingVertical="xs" style={styles.infoRowBorder}>
                <Text style={styles.infoLabel}>
                  <FormattedMessage id="learning.country.currency" defaultMessage="Currency" />:
                </Text>
                <Text style={styles.infoValue}>{countryDetails.currency}</Text>
              </Box>
              <Box row spaceBetween centerItems paddingVertical="xs" style={styles.infoRowBorder}>
                <Text style={styles.infoLabel}>
                  <FormattedMessage id="learning.country.area" defaultMessage="Area" />:
                </Text>
                <Text style={styles.infoValue}>{countryDetails.area}</Text>
              </Box>
              <Box row spaceBetween centerItems paddingVertical="xs" style={styles.infoRowBorder}>
                <Text style={styles.infoLabel}>
                  <FormattedMessage id="learning.country.region" defaultMessage="Region" />:
                </Text>
                <Text style={styles.infoValue}>{regionInfo?.displayName || country.region}</Text>
              </Box>
              <Box row spaceBetween centerItems paddingVertical="xs" style={styles.infoRowBorder}>
                <Text style={styles.infoLabel}>
                  <FormattedMessage
                    id="learning.country.difficultyLevel"
                    defaultMessage="Difficulty Level"
                  />
                  :
                </Text>
                <Text style={styles.infoValue}>
                  <FormattedMessage
                    id="learning.level.label"
                    defaultMessage="Level {level}"
                    values={{ level: country.level }}
                  />
                </Text>
              </Box>
            </Box>
          </Box>
        )
      case 'culture':
        return (
          <Box padding="ml">
            <Text style={styles.sectionTitle}>
              <FormattedMessage
                id="learning.section.culturalFacts"
                defaultMessage="Cultural Facts"
              />
            </Text>
            {countryDetails.culturalFacts.map((fact: string, index: number) => (
              <Box key={index} row alignStart marginBottom="sm">
                <Text style={styles.factBullet}>•</Text>
                <Text style={styles.factText}>{fact}</Text>
              </Box>
            ))}
          </Box>
        )
      case 'history':
        return (
          <Box padding="ml">
            <Text style={styles.sectionTitle}>
              <FormattedMessage
                id="learning.section.historicalHighlights"
                defaultMessage="Historical Highlights"
              />
            </Text>
            {countryDetails.historicalHighlights.map((highlight: string, index: number) => (
              <Box key={index} row alignStart marginBottom="sm">
                <Text style={styles.factBullet}>•</Text>
                <Text style={styles.factText}>{highlight}</Text>
              </Box>
            ))}
          </Box>
        )
      case 'geography':
        return (
          <Box padding="ml">
            <Text style={styles.sectionTitle}>
              <FormattedMessage
                id="learning.section.geographicFeatures"
                defaultMessage="Geographic Features"
              />
            </Text>
            {countryDetails.geographicFeatures.map((feature: string, index: number) => (
              <Box key={index} row alignStart marginBottom="sm">
                <Text style={styles.factBullet}>•</Text>
                <Text style={styles.factText}>{feature}</Text>
              </Box>
            ))}
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <>
      {/* Tabs */}
      <Box paddingVertical="m" style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map(tab => {
            const tabStyles = [
              styles.tab,
              selectedTab === tab.key ? styles.selectedTab : null,
            ].filter(Boolean) as import('react-native').ViewStyle[]
            return (
              <Button
                key={tab.key}
                style={tabStyles}
                onPress={() => onTabSelect(tab.key as any)}
                padding="sm"
                borderRadius={8}
                backgroundColor={selectedTab === tab.key ? '#007AFF' : '#f0f0f0'}
                marginRight="xs"
              >
                <Text
                  style={[
                    styles.tabText,
                    ...(selectedTab === tab.key ? [styles.selectedTabText] : []),
                  ]}
                >
                  {tab.label}
                </Text>
              </Button>
            )
          })}
        </ScrollView>
      </Box>

      {/* Tab Content */}
      {renderTabContent()}
    </>
  )
}

const styles = StyleSheet.create({
  tabsContainer: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRowBorder: {
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
