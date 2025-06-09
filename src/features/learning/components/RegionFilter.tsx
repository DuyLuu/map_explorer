import React from 'react'
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { FormattedMessage, useIntl } from 'react-intl'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Region } from 'types/region'

interface RegionFilterProps {
  selectedRegion: Region | 'all' | 'territories'
  onRegionSelect: (region: Region | 'all' | 'territories') => void
}

const RegionFilter: React.FC<RegionFilterProps> = ({ selectedRegion, onRegionSelect }) => {
  const intl = useIntl()

  const getRegionLabel = (regionKey: string) => {
    const labelMap: { [key: string]: { id: string; defaultMessage: string } } = {
      all: { id: 'learning.region.allCountries', defaultMessage: 'All Countries' },
      [Region.EUROPE]: { id: 'learning.region.europe', defaultMessage: 'Europe' },
      [Region.ASIA]: { id: 'learning.region.asia', defaultMessage: 'Asia' },
      [Region.NORTH_AMERICA]: {
        id: 'learning.region.northAmerica',
        defaultMessage: 'North America',
      },
      [Region.SOUTH_AMERICA]: {
        id: 'learning.region.southAmerica',
        defaultMessage: 'South America',
      },
      [Region.AFRICA]: { id: 'learning.region.africa', defaultMessage: 'Africa' },
      [Region.OCEANIA]: { id: 'learning.region.oceania', defaultMessage: 'Oceania' },
      territories: { id: 'learning.region.territories', defaultMessage: 'Territories' },
    }

    const labelInfo = labelMap[regionKey]
    return labelInfo ? intl.formatMessage(labelInfo) : regionKey
  }

  const regions = [
    { key: 'all', label: getRegionLabel('all') },
    { key: Region.EUROPE, label: getRegionLabel(Region.EUROPE) },
    { key: Region.ASIA, label: getRegionLabel(Region.ASIA) },
    { key: Region.NORTH_AMERICA, label: getRegionLabel(Region.NORTH_AMERICA) },
    { key: Region.SOUTH_AMERICA, label: getRegionLabel(Region.SOUTH_AMERICA) },
    { key: Region.AFRICA, label: getRegionLabel(Region.AFRICA) },
    { key: Region.OCEANIA, label: getRegionLabel(Region.OCEANIA) },
    { key: 'territories', label: getRegionLabel('territories') },
  ]

  return (
    <Box marginBottom="m">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={regions}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.regionButton,
              selectedRegion === item.key && styles.selectedRegionButton,
            ]}
            onPress={() => onRegionSelect(item.key as Region | 'all' | 'territories')}
          >
            <Text
              style={[
                styles.regionButtonText,
                ...(selectedRegion === item.key ? [styles.selectedRegionButtonText] : []),
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.regionList}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  regionList: {
    paddingHorizontal: 16,
  },
  regionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  selectedRegionButton: {
    backgroundColor: '#007AFF',
  },
  regionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedRegionButtonText: {
    color: '#fff',
  },
})

export default RegionFilter
