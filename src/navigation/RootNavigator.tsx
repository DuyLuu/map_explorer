import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import FlagRegionSelectionScreen from '../features/flag/screens/FlagRegionSelectionScreen'
import FlagProgressDetailScreen from '../features/flag/screens/FlagProgressDetailScreen'
import QuizScreen from '../screens/QuizScreen'
import MapRegionSelectionScreen from '../features/map/screens/MapRegionSelectionScreen'
import MapQuizScreen from '../features/map/screens/MapQuizScreen'
import ChallengeQuizScreen from '../features/challenge/screens/ChallengeQuizScreen'
import { RootStackParamList } from './types'
import { setQueryClient } from '../services/countryService'
import SettingsScreen from '../screens/SettingsScreen'
import MapProgressDetailScreen from '../features/map/screens/MapProgressDetailScreen'
import { loadBundledCountryData, isBundledDataLoaded } from '../services/bundledDataService'
import { preloadCommonFlags } from '../services/flagAssetService'
import TabNavigator from './TabNavigator'
import CountryDetailScreen from '../features/learning/screens/CountryDetailScreen'
import TopCountriesScreen from '../features/learning/screens/TopCountriesScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()
const queryClient = new QueryClient()

interface AppLoadingState {
  isLoading: boolean
  error: string | null
  progress: string
}

const LoadingScreen: React.FC<{ state: AppLoadingState }> = ({ state }) => (
  <View style={styles.loadingContainer}>
    <View style={styles.loadingContent}>
      <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
      <Text style={styles.loadingTitle}>World Explorer</Text>
      <Text style={styles.loadingSubtitle}>Preparing your world journey...</Text>
      <Text style={styles.progressText}>{state.progress}</Text>

      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Loading Error</Text>
          <Text style={styles.errorText}>{state.error}</Text>
          <Text style={styles.retryText}>Please restart the app to try again</Text>
        </View>
      )}
    </View>
  </View>
)

const RootNavigator: React.FC = () => {
  const [loadingState, setLoadingState] = useState<AppLoadingState>({
    isLoading: true,
    error: null,
    progress: 'Initializing...',
  })

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      console.log('🚀 Starting World Explorer app initialization...')

      // Step 1: Set up React Query client
      setLoadingState(prev => ({ ...prev, progress: 'Setting up data services...' }))
      setQueryClient(queryClient)

      // Step 2: Check if data is already loaded (for app restarts)
      if (isBundledDataLoaded()) {
        console.log('✅ Bundled data already loaded, skipping preload')
        setLoadingState(prev => ({ ...prev, progress: 'Data ready!' }))

        // Small delay to show completion message
        await new Promise(resolve => setTimeout(resolve, 500))
        setLoadingState(prev => ({ ...prev, isLoading: false }))
        return
      }

      // Step 3: Load bundled country data
      setLoadingState(prev => ({ ...prev, progress: 'Loading world countries data...' }))
      const countries = await loadBundledCountryData()
      console.log(`✅ Loaded ${countries.length} countries from bundled data`)

      // Step 4: Preload common flag assets for better performance
      setLoadingState(prev => ({ ...prev, progress: 'Optimizing flag assets...' }))
      preloadCommonFlags()

      // Step 5: Pre-populate React Query cache with the loaded data
      setLoadingState(prev => ({ ...prev, progress: 'Preparing app cache...' }))
      queryClient.setQueryData(['countries'], countries)
      console.log('🎯 React Query cache populated with bundled countries data')

      // Step 6: Final setup and completion
      setLoadingState(prev => ({ ...prev, progress: 'Ready to explore!' }))

      // Small delay to show completion message
      await new Promise(resolve => setTimeout(resolve, 800))

      setLoadingState(prev => ({ ...prev, isLoading: false }))
      console.log('🎉 World Explorer app initialization complete!')
    } catch (error) {
      console.error('❌ App initialization failed:', error)

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load app data. Please check your connection and try again.'

      setLoadingState({
        isLoading: true, // Keep loading screen visible to show error
        error: errorMessage,
        progress: 'Initialization failed',
      })
    }
  }

  // Show loading screen while app is initializing
  if (loadingState.isLoading) {
    return <LoadingScreen state={loadingState} />
  }

  // Show main app once initialization is complete
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainTabs"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="FlagRegionSelection" component={FlagRegionSelectionScreen} />
          <Stack.Screen name="FlagProgressDetail" component={FlagProgressDetailScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="MapRegionSelection" component={MapRegionSelectionScreen} />
          <Stack.Screen name="MapQuiz" component={MapQuizScreen} />
          <Stack.Screen name="ChallengeQuiz" component={ChallengeQuizScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="MapProgressDetail" component={MapProgressDetailScreen} />
          <Stack.Screen name="CountryDetail" component={CountryDetailScreen} />
          <Stack.Screen name="TopCountries" component={TopCountriesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  spinner: {
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 24,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
    lineHeight: 20,
  },
  retryText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
})

export default RootNavigator
