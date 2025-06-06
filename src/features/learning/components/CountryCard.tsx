import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { CountryWithRegion, REGION_INFO } from '../../../types/region'
import { getFlagAssetByName } from '../../../services/flagAssetService'

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
            <Text style={styles.flagPlaceholderText}>🏳️</Text>
          </View>
        )}
      </View>

      <View style={styles.countryInfo}>
        <Text style={styles.countryName}>{country.name}</Text>
        <Text style={styles.countryRegion}>
          {REGION_INFO[country.region]?.displayName || country.region}
        </Text>
        <View style={styles.levelContainer}>
          <View style={[styles.levelBadge, country.level === 1 ? styles.level1 : styles.level2]}>
            <Text style={styles.levelText}>Level {country.level}</Text>
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
  flagPlaceholderText: {
    fontSize: 16,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  countryRegion: {
    fontSize: 14,
    color: '#666',
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
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
  },
})

export default CountryCard
