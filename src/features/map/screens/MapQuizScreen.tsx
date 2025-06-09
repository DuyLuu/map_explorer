import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, Region } from 'react-native-maps'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { FormattedMessage, useIntl } from 'react-intl'
import { useQuiz } from 'hooks/useQuiz'
import { detectCountryFromCoordinates } from 'services/geocodingService'
import { useCountryStore } from 'stores/countryStore'
import { REGION_INFO } from 'types/region'
import { Text } from 'components/Text'
import { Box } from 'components/Box'

const MapQuizScreen: React.FC = () => {
  const intl = useIntl()
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
    const levelKeys = {
      1: 'quiz.question.difficulty.easy',
      2: 'quiz.question.difficulty.medium',
      3: 'quiz.question.difficulty.hard',
    }
    const key = levelKeys[level as keyof typeof levelKeys]
    return key ? intl.formatMessage({ id: key }) : `Level ${level}`
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
            <FormattedMessage
              id="quiz.instruction.loading"
              defaultMessage="Loading quiz questions..."
            />
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
            <FormattedMessage
              id="common.error.loadingData"
              defaultMessage="Error loading countries data"
            />
          </Text>
          <Text variant="body" muted>
            <FormattedMessage
              id="common.error.checkConnection"
              defaultMessage="Please check your internet connection and try again"
            />
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
        Alert.alert(
          intl.formatMessage({ id: 'common.label.error', defaultMessage: 'Error' }),
          intl.formatMessage({
            id: 'quiz.error.countryNotDetected',
            defaultMessage: 'Could not detect country at this location',
          })
        )
      }
    } catch (error) {
      console.error('Error detecting country:', error)
      Alert.alert(
        intl.formatMessage({ id: 'common.label.error', defaultMessage: 'Error' }),
        intl.formatMessage({
          id: 'quiz.error.countryNotDetected',
          defaultMessage: 'Could not detect country at this location',
        })
      )
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
          <FormattedMessage id="quiz.score.current" defaultMessage="Current Score" />: {score}
        </Text>
        <Text variant="h6" weight="bold" success>
          <FormattedMessage id="quiz.score.best" defaultMessage="Best Score" />: {highScore}
        </Text>
      </Box>

      <Box padding="m" centerItems>
        <Text variant="body" muted>
          <FormattedMessage
            id="quiz.question.number"
            defaultMessage="Question {current} of {total}"
            values={{ current: currentQuestionNumber, total: questionCount }}
          />
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
            <FormattedMessage
              id="quiz.instruction.findCountry"
              defaultMessage="Find the country: {country}"
              values={{ country: currentQuestion.correctAnswer }}
            />
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
                <FormattedMessage
                  id="quiz.error.mapNotAvailable"
                  defaultMessage="Map cannot be displayed: Region info is missing or invalid."
                />
              </Text>
            )}
          </Box>

          <Box centerItems marginBottom="m">
            {isDetecting && (
              <Text variant="body" muted marginBottom="s">
                <FormattedMessage id="quiz.map.detecting" defaultMessage="Detecting country..." />
              </Text>
            )}

            {selectedCountry && !isDetecting && (
              <Text variant="body" primary marginBottom="s">
                <FormattedMessage
                  id="quiz.map.selected"
                  defaultMessage="Selected: {country}"
                  values={{ country: selectedCountry }}
                />
              </Text>
            )}

            {showFeedback && (
              <Text
                variant="h6"
                weight="bold"
                color={selectedAnswer === currentQuestion.correctAnswer ? '#4CAF50' : '#F44336'}
              >
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <FormattedMessage
                    id="quiz.feedback.correct"
                    defaultMessage="Correct! Well done!"
                  />
                ) : (
                  <FormattedMessage
                    id="quiz.feedback.incorrect"
                    defaultMessage="Incorrect. The correct answer is: {answer}"
                    values={{ answer: currentQuestion.correctAnswer }}
                  />
                )}
              </Text>
            )}
          </Box>

          {selectedCountry && !showFeedback && !isDetecting && (
            <TouchableOpacity style={styles.submitButton} onPress={handleMapSubmit}>
              <Text variant="body" weight="bold" style={styles.buttonText}>
                <FormattedMessage id="common.action.submit" defaultMessage="Submit Answer" />
              </Text>
            </TouchableOpacity>
          )}

          {showFeedback && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
              <Text variant="body" weight="bold" style={styles.buttonText}>
                {currentQuestionNumber < questionCount ? (
                  <FormattedMessage id="common.action.next" defaultMessage="Next Question" />
                ) : (
                  <FormattedMessage id="quiz.result.finish" defaultMessage="Finish Quiz" />
                )}
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
