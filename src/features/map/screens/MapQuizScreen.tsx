import React, { useState } from 'react'
import {
  View,
  Text,
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>
            {isLoadingCountries ? 'Loading countries...' : 'Initializing quiz...'}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  // Show error screen if there was an error loading countries
  if (countriesError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading countries data</Text>
          <Text style={styles.errorSubtext}>
            Please check your internet connection and try again
          </Text>
        </View>
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
      <View style={styles.header}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.highScore}>High Score: {highScore}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionNumber} of {questionCount}
        </Text>
        <View style={styles.levelIndicator}>
          <Text style={[styles.levelText, { color: getLevelColor(currentLevel) }]}>
            {getLevelName(currentLevel)}
          </Text>
        </View>
      </View>

      {currentQuestion && (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Find the country: {currentQuestion.correctAnswer}</Text>

          <View style={styles.mapContainer}>
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
              <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>
                Map cannot be displayed: Region info is missing or invalid.
              </Text>
            )}
          </View>

          <View style={styles.feedbackContainer}>
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
          </View>

          {selectedCountry && !showFeedback && !isDetecting && (
            <TouchableOpacity style={styles.submitButton} onPress={handleMapSubmit}>
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          )}

          {showFeedback && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
              <Text style={styles.nextButtonText}>
                {currentQuestionNumber < questionCount ? 'Next Question' : 'Finish Quiz'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  highScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressContainer: {
    padding: 16,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  questionContainer: {
    flex: 1,
    padding: 16,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  mapContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  feedbackContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  detectingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  selectedText: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelIndicator: {
    backgroundColor: '#eee',
    padding: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
  },
})

export default MapQuizScreen
