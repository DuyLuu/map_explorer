import React, { useState, useEffect } from 'react'
import { StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native'
import { Text } from '../../../components/Text'
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Region } from 'react-native-maps'
import { detectCountryFromCoordinates } from '../../../services/geocodingService'
import { getCountryMapRegion } from '../../../services/countryCoordinatesService'
import { Box } from '../../../components/Box'

interface Question {
  correctAnswer: string
}

interface MapQuizUIProps {
  currentQuestion: Question
  selectedAnswer: string | null
  showFeedback: boolean
  onSelectAnswer: (answer: string) => void
  onSubmit: () => void
}

const MapQuizUI: React.FC<MapQuizUIProps> = ({
  currentQuestion,
  selectedAnswer,
  showFeedback,
  onSelectAnswer,
  onSubmit,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [currentMapRegion, setCurrentMapRegion] = useState<Region>(() => {
    if (currentQuestion?.correctAnswer) {
      return getCountryMapRegion(currentQuestion.correctAnswer)
    }
    return {
      latitude: 20,
      longitude: 0,
      latitudeDelta: 160,
      longitudeDelta: 160,
    }
  })

  // Use default provider for iOS simulator, Google for others
  const mapProvider = Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE

  // Reset map selection when moving to next question
  useEffect(() => {
    if (!showFeedback) {
      setSelectedCountry(null)
      setIsDetecting(false)
    }
  }, [showFeedback])

  // Update map region when question changes
  useEffect(() => {
    if (currentQuestion?.correctAnswer) {
      setCurrentMapRegion(getCountryMapRegion(currentQuestion.correctAnswer))
    }
  }, [currentQuestion?.correctAnswer])

  const handleMapPress = async (event: any) => {
    if (showFeedback) return

    const { latitude, longitude } = event.nativeEvent.coordinate
    setIsDetecting(true)
    setSelectedCountry(null)

    try {
      const detectedCountry = await detectCountryFromCoordinates(latitude, longitude)
      if (detectedCountry) {
        setSelectedCountry(detectedCountry)
        await onSelectAnswer(detectedCountry)
      } else {
        Alert.alert('Error', 'Could not detect country at this location')
      }
    } catch (error) {
      console.error('Error detecting country:', error)
      Alert.alert('Error', 'Could not detect country at this location')
    } finally {
      setIsDetecting(false)
    }
  }

  const handleMapSubmit = async () => {
    if (selectedCountry) {
      await onSubmit()
    }
  }

  return (
    <>
      <Text style={styles.mapQuestionText}>Find the country: {currentQuestion.correctAnswer}</Text>

      <Box borderRadius="sm" hidden marginBottom="m" style={{ height: 300 }}>
        <MapView
          key={currentQuestion?.correctAnswer}
          style={styles.map}
          provider={mapProvider}
          region={currentMapRegion}
          onPress={handleMapPress}
          showsUserLocation={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
        />
      </Box>

      <Box center style={{ minHeight: 60 }}>
        {isDetecting && <Text style={styles.detectingText}>Detecting country...</Text>}

        {selectedCountry && !isDetecting && (
          <Text style={styles.selectedText}>Selected: {selectedCountry}</Text>
        )}

        {showFeedback && (
          <Text
            style={[
              styles.feedbackText,
              selectedAnswer === currentQuestion.correctAnswer
                ? styles.correctFeedback
                : styles.wrongFeedback,
            ]}
          >
            {selectedAnswer === currentQuestion.correctAnswer
              ? 'Correct!'
              : `Wrong! It was ${currentQuestion.correctAnswer}`}
          </Text>
        )}
      </Box>

      {/* Submit Button for Map Quiz */}
      {selectedCountry && !showFeedback && !isDetecting && (
        <TouchableOpacity style={styles.submitButton} onPress={handleMapSubmit}>
          <Text style={styles.submitButtonText}>Submit Answer</Text>
        </TouchableOpacity>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  mapQuestionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  map: {
    flex: 1,
  },
  detectingText: {
    fontSize: 16,
    color: '#FF6B35',
    fontStyle: 'italic',
  },
  selectedText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  correctFeedback: {
    color: '#4CAF50',
  },
  wrongFeedback: {
    color: '#F44336',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
})

export default MapQuizUI
