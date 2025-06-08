import React from 'react'
import { StyleSheet, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { CountryWithRegion, REGION_INFO } from 'types/region'
import { getFlagAssetByName } from 'services/flagAssetService'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { useNavigation } from '@react-navigation/native'

interface CountryCardProps {
  country: CountryWithRegion
  onPress: (country: CountryWithRegion) => void
}

const CountryCard: React.FC<CountryCardProps> = ({ country, onPress }) => {
  const flagAsset = getFlagAssetByName(country.name)

  return (
    <Button
      style={styles.countryCard}
      onPress={() => onPress(country)}
      activeOpacity={0.7}
      padding="m"
      borderRadius={12}
      backgroundColor="#fff"
      marginBottom="sm"
      shadow="default"
    >
      <Box marginRight="m" borderRadius="xs" style={{ width: 48, height: 32 }}>
        {flagAsset ? (
          <Image source={flagAsset} style={styles.flagImage} resizeMode="cover" />
        ) : (
          <Box fullWidth fullHeight backgroundColor="#f0f0f0" center>
            <Text size={16}>🏳️</Text>
          </Box>
        )}
      </Box>

      <Box marginLeft="m">
        <Text variant="h6" weight="semi-bold" style={styles.countryName}>
          {country.name}
        </Text>
        <Text variant="bodySmall" muted style={styles.countryRegion}>
          {REGION_INFO[country.region]?.displayName || country.region}
        </Text>
      </Box>

      <Icon name="chevron-right" size={20} color="#999" />
    </Button>
  )
}

const styles = StyleSheet.create({
  countryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  flagImage: {
    width: 48,
    height: 32,
    borderRadius: 6,
  },
  countryName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  countryRegion: {
    color: '#888',
    fontSize: 13,
    marginBottom: 2,
  },
  level1: {
    backgroundColor: '#E3F2FD',
  },
  level2: {
    backgroundColor: '#FFF3E0',
  },
})

export default CountryCard
