import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomeScreen from '../screens/HomeScreen'
import QuestionCountScreen from '../screens/QuestionCountScreen'
import LevelSelectionScreen from '../screens/LevelSelectionScreen'
import QuizScreen from '../screens/QuizScreen'
import MapQuizScreen from '../screens/MapQuizScreen'
import NameInputScreen from '../screens/NameInputScreen'
import LeaderboardScreen from '../screens/LeaderboardScreen'
import { RootStackParamList } from './types'
import { setQueryClient } from '../services/countryService'
import SettingsScreen from '../screens/SettingsScreen'
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
          <Stack.Screen name="QuestionCount" component={QuestionCountScreen} />
          <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="MapQuiz" component={MapQuizScreen} />
          <Stack.Screen name="NameInput" component={NameInputScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

export default RootNavigator
