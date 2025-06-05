import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getQuizProgress } from '../services/quizService'
import { useCountries } from '../hooks/useCountries'
import SettingsButton from '../components/SettingsButton'

type RootStackParamList = {
  QuestionCount: undefined
  MapQuiz: undefined
  Leaderboard: undefined
  Settings: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const [highScore, setHighScore] = useState(0)
  const { isLoading } = useCountries()

  useEffect(() => {
    loadHighScore()
  }, [])

  const loadHighScore = async () => {
    const progress = await getQuizProgress(1)
    setHighScore(progress)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SettingsButton />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>World Explorer</Text>
        <Text style={styles.subtitle}>Test your knowledge of world geography!</Text>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Highest Score</Text>
          <Text style={styles.scoreValue}>{highScore}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('QuestionCount')}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Flag Quiz</Text>
            )}
          </TouchableOpacity>

          {/* Map Quiz button - Android only */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.button, styles.mapButton]}
              onPress={() => navigation.navigate('MapQuiz')}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Map Quiz (Beta)</Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Leaderboard')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>View Leaderboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
  },
  scoreContainer: {
    backgroundColor: '#f8f8f8',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 48,
    width: '100%',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  mapButton: {
    backgroundColor: '#FF6B35',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
})

export default HomeScreen
