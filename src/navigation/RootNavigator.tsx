import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomeScreen from '../screens/HomeScreen'
import FlagRegionSelectionScreen from '../features/flag/screens/FlagRegionSelectionScreen'
import FlagProgressDetailScreen from '../features/flag/screens/FlagProgressDetailScreen'
import QuizScreen from '../screens/QuizScreen'
import MapRegionSelectionScreen from '../features/map/screens/MapRegionSelectionScreen'
import MapQuizScreen from '../features/map/screens/MapQuizScreen'
import NameInputScreen from '../screens/NameInputScreen'
import LeaderboardScreen from '../screens/LeaderboardScreen'
import { RootStackParamList } from './types'
import { setQueryClient } from '../services/countryService'
import SettingsScreen from '../screens/SettingsScreen'
import MapProgressDetailScreen from '../features/map/screens/MapProgressDetailScreen'
const Stack = createNativeStackNavigator<RootStackParamList>()
const queryClient = new QueryClient()

const RootNavigator: React.FC = () => {
  useEffect(() => {
    setQueryClient(queryClient)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="FlagRegionSelection" component={FlagRegionSelectionScreen} />
          <Stack.Screen name="FlagProgressDetail" component={FlagProgressDetailScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="MapRegionSelection" component={MapRegionSelectionScreen} />
          <Stack.Screen name="MapQuiz" component={MapQuizScreen} />
          <Stack.Screen name="NameInput" component={NameInputScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="MapProgressDetail" component={MapProgressDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

export default RootNavigator
