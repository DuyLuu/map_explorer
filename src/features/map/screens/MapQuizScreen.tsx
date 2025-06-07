import React, { useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native'
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Region } from 'react-native-maps'
import { useQuiz } from '../../../hooks/useQuiz'
import { detectCountryFromCoordinates } from '../../../services/geocodingService'
import { useCountryStore } from '../../../stores/countryStore'
import { REGION_INFO } from '../../../types/region'
import { Text } from '../../../components/Text'
import { Box } from '../../../components/Box'

const MapQuizScreen: React.FC = () => {
  const {
    currentQuestion,
    score,
    highScore,
    showFeedback,
    selectedAnswer,
    currentQuestionNumber,
    questionCount,
    currentLevel,
    isLoadingCountries,
    isInitializing,
    countriesError,
    handleSelectAnswer,
    handleSubmit,
    handleNextQuestion,
  } = useQuiz()

  const { selectedRegion } = useCountryStore()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)

  // Get region-specific map bounds instead of hardcoded world view
  let initialRegion: Region | null = null
  if (selectedRegion && REGION_INFO[selectedRegion]) {
    initialRegion = {
      latitude: REGION_INFO[selectedRegion].mapBounds.latitude,
      longitude: REGION_INFO[selectedRegion].mapBounds.longitude,
      latitudeDelta: REGION_INFO[selectedRegion].mapBounds.latitudeDelta,
      longitudeDelta: REGION_INFO[selectedRegion].mapBounds.longitudeDelta,
    }
  } else {
    console.warn(
      'MapQuizScreen: selectedRegion or REGION_INFO[selectedRegion] is missing',
      selectedRegion
    )
  }

  // Use default provider for iOS simulator, Google for others
  const mapProvider = Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE

  const getLevelName = (level: number): string => {
    const levels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
    return levels[level as keyof typeof levels] || `Level ${level}`
  }

  const getLevelColor = (level: number): string => {
    const colors = { 1: '#4CAF50', 2: '#FF9800', 3: '#F44336' }
    return colors[level as keyof typeof colors] || '#666'
  }

  // Show loading screen while countries are loading or quiz is initializing
  if (isLoadingCountries || isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex center>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text variant="h6" weight="bold" marginTop="m">
            {isLoadingCountries ? 'Loading countries...' : 'Initializing quiz...'}
          </Text>
        </Box>
      </SafeAreaView>
    )
  }

  // Show error screen if there was an error loading countries
  if (countriesError) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex center>
          <Text variant="h6" weight="bold" marginBottom="m">
            Error loading countries data
          </Text>
          <Text variant="body" muted>
            Please check your internet connection and try again
          </Text>
        </Box>
      </SafeAreaView>
    )
  }

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    setIsDetecting(true)
    setSelectedCountry(null)

    try {
      const detectedCountry = await detectCountryFromCoordinates(latitude, longitude)
      if (detectedCountry) {
        setSelectedCountry(detectedCountry)
        await handleSelectAnswer(detectedCountry)
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
      await handleSubmit()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Box row spaceBetween padding="m" style={{ borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <Text variant="h6" weight="bold">
          Score: {score}
        </Text>
        <Text variant="h6" weight="bold" success>
          High Score: {highScore}
        </Text>
      </Box>

      <Box padding="m" centerItems>
        <Text variant="body" muted>
          Question {currentQuestionNumber} of {questionCount}
        </Text>
        <Box backgroundColor="#eee" padding="xxs" borderRadius={8} marginTop="xxs">
          <Text variant="body" weight="bold" style={{ color: getLevelColor(currentLevel) }}>
            {getLevelName(currentLevel)}
          </Text>
        </Box>
      </Box>

      {currentQuestion && (
        <Box flex padding="m">
          <Text variant="h5" weight="bold" center marginBottom="m" style={styles.questionTextColor}>
            Find the country: {currentQuestion.correctAnswer}
          </Text>

          <Box flex borderRadius={12} style={{ overflow: 'hidden' }} marginBottom="m">
            {initialRegion ? (
              <MapView
                style={styles.map}
                provider={mapProvider}
                initialRegion={initialRegion}
                onPress={handleMapPress}
                showsUserLocation={false}
                showsMyLocationButton={false}
                toolbarEnabled={false}
              />
            ) : (
              <Text danger center marginTop="l">
                Map cannot be displayed: Region info is missing or invalid.
              </Text>
            )}
          </Box>

          <Box centerItems marginBottom="m">
            {isDetecting && (
              <Text variant="body" muted marginBottom="s">
                Detecting country...
              </Text>
            )}

            {selectedCountry && !isDetecting && (
              <Text variant="body" primary marginBottom="s">
                Selected: {selectedCountry}
              </Text>
            )}

            {showFeedback && (
              <Text
                variant="h6"
                weight="bold"
                color={selectedAnswer === currentQuestion.correctAnswer ? '#4CAF50' : '#F44336'}
              >
                {selectedAnswer === currentQuestion.correctAnswer
                  ? 'Correct!'
                  : `Wrong! It was ${currentQuestion.correctAnswer}`}
              </Text>
            )}
          </Box>

          {selectedCountry && !showFeedback && !isDetecting && (
            <TouchableOpacity style={styles.submitButton} onPress={handleMapSubmit}>
              <Text variant="body" weight="bold" style={styles.buttonText}>
                Submit Answer
              </Text>
            </TouchableOpacity>
          )}

          {showFeedback && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
              <Text variant="body" weight="bold" style={styles.buttonText}>
                {currentQuestionNumber < questionCount ? 'Next Question' : 'Finish Quiz'}
              </Text>
            </TouchableOpacity>
          )}
        </Box>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  questionTextColor: {
    color: '#333',
  },
  map: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
})

export default MapQuizScreen
