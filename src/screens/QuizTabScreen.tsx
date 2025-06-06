import React from 'react'
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
import { useCountries } from '../hooks/useCountries'

type RootStackParamList = {
  FlagRegionSelection: undefined
  MapRegionSelection: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const QuizTabScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { isLoading } = useCountries()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Quiz Mode</Text>
        <Text style={styles.subtitle}>Test your geography knowledge!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.flagButton]}
            onPress={() => navigation.navigate('FlagRegionSelection')}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>🏳️</Text>
                <Text style={styles.buttonText}>Flag Quiz</Text>
                <Text style={styles.buttonSubtext}>Identify country flags</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Map Quiz button - iOS only */}
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.button, styles.mapButton]}
              onPress={() => navigation.navigate('MapRegionSelection')}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonIcon}>🗺️</Text>
                  <Text style={styles.buttonText}>Map Quiz</Text>
                  <Text style={styles.buttonSubtext}>Locate countries on map</Text>
                </>
              )}
            </TouchableOpacity>
          )}
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flagButton: {
    backgroundColor: '#007AFF',
  },
  mapButton: {
    backgroundColor: '#FF6B35',
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
})

export default QuizTabScreen
