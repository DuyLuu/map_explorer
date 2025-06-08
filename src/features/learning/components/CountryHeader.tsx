import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { CountryWithRegion, REGION_INFO } from 'types/region'
import { getFlagAssetByName } from 'services/flagAssetService'

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
    <Box centerItems padding="xl" backgroundColor="#f8f9fa">
      <Box
        marginBottom="m"
        borderRadius="xs"
        hidden
        shadow="light"
        style={{ width: 80, height: 54 }}
      >
        {flagAsset ? (
          <Image source={flagAsset} style={styles.flagImage} resizeMode="cover" />
        ) : (
          <Box fullWidth fullHeight backgroundColor="#f0f0f0" center>
            <Text style={styles.flagPlaceholderText}>🏳️</Text>
          </Box>
        )}
      </Box>
      <Text style={styles.countryName}>{country.name}</Text>
      <Text style={styles.countryRegion}>{regionInfo?.displayName || country.region}</Text>

      {/* Enhanced: Show new data from updated countries.json */}
      {country.capital && (
        <Box row centerItems marginBottom="sm">
          <Text style={styles.infoLabel}>Capital:</Text>
          <Text style={styles.infoValue}>{country.capital}</Text>
        </Box>
      )}

      <Box row spaceAround fullWidth marginTop="xs">
        {country.population && (
          <Box centerItems flex>
            <Text style={styles.statLabel}>Population</Text>
            <Text style={styles.statValue}>{formatPopulation(country.population)}</Text>
          </Box>
        )}

        {country.area && (
          <Box centerItems flex>
            <Text style={styles.statLabel}>Area</Text>
            <Text style={styles.statValue}>{formatArea(country.area)}</Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  flagImage: {
    width: '100%',
    height: '100%',
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
