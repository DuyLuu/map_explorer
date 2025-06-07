import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Text } from '../../../components/Text'
import { CountryWithRegion, REGION_INFO } from '../../../types/region'
import { getFlagAssetByName } from '../../../services/flagAssetService'

interface CountryHeaderProps {
  country: CountryWithRegion
}

const CountryHeader: React.FC<CountryHeaderProps> = ({ country }) => {
  const flagAsset = getFlagAssetByName(country.name)
  const regionInfo = REGION_INFO[country.region]

  // Format population for display
  const formatPopulation = (population?: number): string => {
    if (!population) return 'Population data not available'
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M people`
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K people`
    }
    return `${population.toLocaleString()} people`
  }

  // Format area for display
  const formatArea = (area?: number): string => {
    if (!area) return 'Area data not available'
    return `${area.toLocaleString()} km²`
  }

  return (
    <View style={styles.countryHeader}>
      <View style={styles.flagContainer}>
        {flagAsset ? (
          <Image source={flagAsset} style={styles.flagImage} resizeMode="cover" />
        ) : (
          <View style={styles.flagPlaceholder}>
            <Text style={styles.flagPlaceholderText}>🏳️</Text>
          </View>
        )}
      </View>
      <Text style={styles.countryName}>{country.name}</Text>
      <Text style={styles.countryRegion}>{regionInfo?.displayName || country.region}</Text>

      {/* Enhanced: Show new data from updated countries.json */}
      {country.capital && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Capital:</Text>
          <Text style={styles.infoValue}>{country.capital}</Text>
        </View>
      )}

      <View style={styles.statsContainer}>
        {country.population && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Population</Text>
            <Text style={styles.statValue}>{formatPopulation(country.population)}</Text>
          </View>
        )}

        {country.area && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Area</Text>
            <Text style={styles.statValue}>{formatArea(country.area)}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  countryHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  flagContainer: {
    width: 80,
    height: 54,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
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
  flagPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagPlaceholderText: {
    fontSize: 24,
  },
  countryName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  countryRegion: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
})

export default CountryHeader
