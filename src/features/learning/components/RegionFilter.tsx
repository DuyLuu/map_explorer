import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { useIntl } from 'react-intl'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Region } from 'types/region'

import { useTheme } from '../../../theme'

interface RegionFilterProps {
  selectedRegion: Region | 'all' | 'territories'
  onRegionSelect: (region: Region | 'all' | 'territories') => void
}

const RegionFilter: React.FC<RegionFilterProps> = ({ selectedRegion, onRegionSelect }) => {
  const intl = useIntl()
  const { theme } = useTheme()

  const getRegionLabel = (regionKey: string) => {
    const labelMap: { [key: string]: { id: string; defaultMessage: string } } = {
      all: { id: 'learning.region.allCountries', defaultMessage: 'All Countries' },
      [Region.EUROPE]: { id: 'learning.region.europe', defaultMessage: 'Europe' },
      [Region.ASIA]: { id: 'learning.region.asia', defaultMessage: 'Asia' },
      [Region.NORTH_AMERICA]: {
        id: 'learning.region.northAmerica',
        defaultMessage: 'North America'
      },
      [Region.SOUTH_AMERICA]: {
        id: 'learning.region.southAmerica',
        defaultMessage: 'South America'
      },
      [Region.AFRICA]: { id: 'learning.region.africa', defaultMessage: 'Africa' },
      [Region.OCEANIA]: { id: 'learning.region.oceania', defaultMessage: 'Oceania' },
      territories: { id: 'learning.region.territories', defaultMessage: 'Territories' }
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
    { key: 'territories', label: getRegionLabel('territories') }
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
            onPress={() => onRegionSelect(item.key as Region | 'all' | 'territories')}
          >
            <Box
              paddingHorizontal="m"
              paddingVertical="s"
              marginRight="s"
              backgroundColor={selectedRegion === item.key ? 'primary' : 'lightGray'}
              borderRadius="xl"
            >
              <Text
                variant="bodySmall"
                weight="bold"
                color={selectedRegion === item.key ? 'white' : 'text'}
              >
                {item.label}
              </Text>
            </Box>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.m }}
      />
    </Box>
  )
}

export default RegionFilter
