import React from 'react'
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Text } from '../../../components/Text'
import { Box } from '../../../components/Box'
import { Region } from '../../../types/region'

interface RegionFilterProps {
  selectedRegion: Region | 'all' | 'territories'
  onRegionSelect: (region: Region | 'all' | 'territories') => void
}

const RegionFilter: React.FC<RegionFilterProps> = ({ selectedRegion, onRegionSelect }) => {
  const regions = [
    { key: 'all', label: 'All Countries' },
    { key: Region.EUROPE, label: 'Europe' },
    { key: Region.ASIA, label: 'Asia' },
    { key: Region.NORTH_AMERICA, label: 'North America' },
    { key: Region.SOUTH_AMERICA, label: 'South America' },
    { key: Region.AFRICA, label: 'Africa' },
    { key: Region.OCEANIA, label: 'Oceania' },
    { key: 'territories', label: 'Territories' },
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
