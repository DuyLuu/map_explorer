import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { CountryWithRegion, REGION_INFO } from '../../../types/region'
import { getFlagAssetByName } from '../../../services/flagAssetService'
import { Text } from '../../../components/Text'

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
      <View style={styles.flagContainer}>
        {flagAsset ? (
          <Image source={flagAsset} style={styles.flagImage} resizeMode="cover" />
        ) : (
          <View style={styles.flagPlaceholder}>
            <Text size={16}>🏳️</Text>
          </View>
        )}
      </View>

      <View style={styles.countryInfo}>
        <Text variant="h6" weight="semi-bold" style={styles.countryName}>
          {country.name}
        </Text>
        <Text variant="bodySmall" muted style={styles.countryRegion}>
          {REGION_INFO[country.region]?.displayName || country.region}
        </Text>
        <View style={styles.levelContainer}>
          <View style={[styles.levelBadge, country.level === 1 ? styles.level1 : styles.level2]}>
            <Text variant="caption" weight="semi-bold" primary>
              Level {country.level}
            </Text>
          </View>
        </View>
      </View>

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
  flagContainer: {
    width: 48,
    height: 32,
    marginRight: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  flagPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    marginBottom: 4,
  },
  countryRegion: {
    marginBottom: 8,
  },
  levelContainer: {
    flexDirection: 'row',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  level1: {
    backgroundColor: '#E3F2FD',
  },
  level2: {
    backgroundColor: '#FFF3E0',
  },
})

export default CountryCard
