import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActivityIndicator } from 'react-native'
import { FormattedMessage } from 'react-intl'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { ThemeProvider, useTheme } from 'theme/context'
import FlagRegionSelectionScreen from 'features/flag/screens/FlagRegionSelectionScreen'
import FlagProgressDetailScreen from 'features/flag/screens/FlagProgressDetailScreen'
import MapRegionSelectionScreen from 'features/map/screens/MapRegionSelectionScreen'
import MapQuizScreen from 'features/map/screens/MapQuizScreen'
import ChallengeQuizScreen from 'features/challenge/screens/ChallengeQuizScreen'
import QuizScreen from 'screens/QuizScreen'
import SettingsScreen from 'screens/SettingsScreen'
import MapProgressDetailScreen from 'features/map/screens/MapProgressDetailScreen'
import CountryDetailScreen from 'features/learning/screens/CountryDetailScreen'
import TopCountriesScreen from 'features/learning/screens/TopCountriesScreen'
import { loadBundledCountryData, isBundledDataLoaded } from 'services/bundledDataService'
import { preloadCommonFlags } from 'services/flagAssetService'

import TabNavigator from './TabNavigator'
import { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()
const queryClient = new QueryClient()

interface AppLoadingState {
  isLoading: boolean
  error: string | null
  progress: string
}

const LoadingScreen: React.FC<{ state: AppLoadingState }> = ({ state }) => {
  const { theme } = useTheme()
  return (
    <Box flex center backgroundColor="background">
      <Box centerItems paddingHorizontal="xl">
        <Box marginBottom="l">
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </Box>
        <Text variant="h2" color="text" weight="bold" center marginBottom="s">
          <FormattedMessage id="navigation.appTitle" defaultMessage="World Explorer" />
        </Text>
        <Text variant="body" color="subText" center marginBottom="l">
          <FormattedMessage
            id="navigation.loading.subtitle"
            defaultMessage="Preparing your world journey..."
          />
        </Text>
        <Text variant="bodySmall" color="primary" center weight="medium">
          {state.progress}
        </Text>

        {state.error && (
          <Box
            marginTop="xl"
            padding="m"
            backgroundColor="blackOpacity(0.1)"
            borderRadius={8}
            borderWidth={4}
            borderColor="danger"
          >
            <Text variant="h6" color="danger" weight="bold" marginBottom="s">
              <FormattedMessage id="navigation.loading.error" defaultMessage="Loading Error" />
            </Text>
            <Text variant="bodySmall" color="subText" marginBottom="s">
              {state.error}
            </Text>
            <Text variant="caption" color="gray">
              <FormattedMessage
                id="navigation.loading.retryMessage"
                defaultMessage="Please restart the app to try again"
              />
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const AppNavigator: React.FC = () => {
  const [loadingState, setLoadingState] = useState<AppLoadingState>({
    isLoading: true,
    error: null,
    progress: 'Initializing...'
  })

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      console.log('🚀 Starting World Explorer app initialization...')

      // Step 1: Set up React Query client
      setLoadingState(prev => ({ ...prev, progress: 'Setting up data services...' }))

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
        progress: 'Initialization failed'
      })
    }
  }

  // Show loading screen while app is initializing
  if (loadingState.isLoading) {
    return <LoadingScreen state={loadingState} />
  }

  // Show main app once initialization is complete
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false
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
  )
}

const RootNavigator: React.FC = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppNavigator />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default RootNavigator
