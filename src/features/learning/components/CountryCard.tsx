import React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { CountryWithRegion, REGION_INFO } from '../../../types/region'
import { getFlagAssetByName } from '../../../services/flagAssetService'
import { Text } from '../../../components/Text'
import { Box } from '../../../components/Box'

interface CountryCardProps {
  country: CountryWithRegion
  onPress: (country: CountryWithRegion) => void
}

const CountryCard: React.FC<CountryCardProps> = ({ country, onPress }) => {
  const flagAsset = getFlagAssetByName(country.name)

  return (
    <TouchableOpacity
      style={styles.countryCard}
      onPress={() => onPress(country)}
      activeOpacity={0.7}
    >
      <Box marginRight="m" borderRadius="xs" hidden style={{ width: 48, height: 32 }}>
        {flagAsset ? (
          <Image source={flagAsset} style={styles.flagImage} resizeMode="cover" />
        ) : (
          <Box fullWidth fullHeight backgroundColor="#f0f0f0" center>
            <Text size={16}>🏳️</Text>
          </Box>
        )}
      </Box>

      <Box flex>
        <Text variant="h6" weight="semi-bold" style={styles.countryName}>
          {country.name}
        </Text>
        <Text variant="bodySmall" muted style={styles.countryRegion}>
          {REGION_INFO[country.region]?.displayName || country.region}
        </Text>
        <Box row>
          <Box
            paddingHorizontal="xs"
            paddingVertical="xxs"
            borderRadius="sm"
            style={country.level === 1 ? styles.level1 : styles.level2}
          >
            <Text variant="caption" weight="semi-bold" primary>
              Level {country.level}
            </Text>
          </Box>
        </Box>
      </Box>

      <Icon name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  countryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  countryName: {
    marginBottom: 4,
  },
  countryRegion: {
    marginBottom: 8,
  },
  level1: {
    backgroundColor: '#E3F2FD',
  },
  level2: {
    backgroundColor: '#FFF3E0',
  },
})

export default CountryCard
