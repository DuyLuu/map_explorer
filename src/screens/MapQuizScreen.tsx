import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native'
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Region } from 'react-native-maps'
import { useQuiz } from '../hooks/useQuiz'
import { detectCountryFromCoordinates } from '../services/geocodingService'

const MapQuizScreen: React.FC = () => {
  const {
    currentQuestion,
    score,
    highScore,
    showFeedback,
    selectedAnswer,
    currentQuestionNumber,
    questionCount,
    handleSelectAnswer,
    handleSubmit,
    handleNextQuestion,
  } = useQuiz()

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)

  // Initial map region - world view
  const initialRegion: Region = {
    latitude: 20,
    longitude: 0,
    latitudeDelta: 100,
    longitudeDelta: 100,
  }

  // Use default provider for iOS simulator, Google for others
  const mapProvider = Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate

    // Don't allow new selections while feedback is showing
    if (showFeedback) {
      return
    }

    setIsDetecting(true)

    try {
      const detectedCountry = await detectCountryFromCoordinates(latitude, longitude)

      if (detectedCountry) {
        handleCountrySelect(detectedCountry)
      } else {
        Alert.alert(
          'Location Not Found',
          'Could not detect a country at this location. Please try clicking on a land area.',
          [{ text: 'OK' }]
        )
      }
    } catch (error) {
      console.error('Error detecting country:', error)
      Alert.alert('Error', 'Failed to detect country. Please try again.', [{ text: 'OK' }])
    } finally {
      setIsDetecting(false)
    }
  }

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName)
    handleSelectAnswer(countryName)
  }

  const handleMapSubmit = () => {
    if (selectedCountry) {
      handleSubmit()
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
      </View>

      {currentQuestion && (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Find the country: {currentQuestion.correctAnswer}</Text>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={mapProvider}
              initialRegion={initialRegion}
              onPress={handleMapPress}
              showsUserLocation={false}
              showsMyLocationButton={false}
              toolbarEnabled={false}
            />
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
})

export default MapQuizScreen
