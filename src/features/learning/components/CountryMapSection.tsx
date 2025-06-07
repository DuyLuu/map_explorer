import React, { useEffect, useState } from 'react'
import { StyleSheet, Platform } from 'react-native'
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps'
import { CountryWithRegion, REGION_INFO } from '../../../types/region'
import { getCountryMapRegion } from '../../../services/countryCoordinatesService'
import { Text } from '../../../components/Text'
import { Box } from '../../../components/Box'

interface CountryDetailData {
  coordinates: { latitude: number; longitude: number }
}

interface CountryMapSectionProps {
  country: CountryWithRegion
  countryDetails: CountryDetailData
}

interface MapRegion {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

// Focused learning coordinates with tighter zoom for educational purposes
const getLearningMapRegion = (baseRegion: MapRegion) => {
  // For learning, we want much tighter zoom levels
  const learningRegion = {
    latitude: baseRegion.latitude,
    longitude: baseRegion.longitude,
    // Reduce delta values significantly for closer, more focused view
    latitudeDelta: Math.min(baseRegion.latitudeDelta * 0.3, 8), // Much closer zoom
    longitudeDelta: Math.min(baseRegion.longitudeDelta * 0.3, 10), // Much closer zoom
  }

  return learningRegion
}

const CountryMapSection: React.FC<CountryMapSectionProps> = ({ country, countryDetails }) => {
  const [mapRegion, setMapRegion] = useState<MapRegion | null>(null)

  const regionInfo = REGION_INFO[country.region]

  // Get coordinates immediately since all data is now bundled
  useEffect(() => {
    console.log(`🗺️ Loading coordinates for ${country.name}...`)

    try {
      // Get coordinates synchronously from bundled data
      const baseRegion = getCountryMapRegion(country.name)
      const learningRegion = getLearningMapRegion(baseRegion)
      setMapRegion(learningRegion)
      console.log(`✅ Coordinates loaded for ${country.name}:`, learningRegion)
    } catch (err) {
      console.error(`❌ Error loading coordinates for ${country.name}:`, err)
      setMapRegion(null)
    }
  }, [country.name])

  // Don't render on Android (as per original logic)
  if (Platform.OS === 'android') {
    return null
  }

  // Show error state if no region could be loaded
  if (!mapRegion) {
    return (
      <Box padding="ml">
        <Text style={styles.sectionTitle}>Location</Text>
        <Box
          marginTop="sm"
          borderRadius="sm"
          hidden
          shadow="light"
          center
          backgroundColor="#f5f5f5"
          style={[styles.errorContainer, { height: 200 }]}
        >
          <Text style={styles.errorText}>Unable to load map for this location</Text>
        </Box>
      </Box>
    )
  }

  return (
    <Box padding="ml">
      <Text style={styles.sectionTitle}>Location</Text>
      <Box marginTop="sm" borderRadius="sm" hidden shadow="light">
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          region={mapRegion}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            }}
            title={country.name}
            description={`Located in ${regionInfo?.displayName || country.region}`}
          />
        </MapView>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  map: {
    height: 200,
    width: '100%',
  },
})

export default CountryMapSection
