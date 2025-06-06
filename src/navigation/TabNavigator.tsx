import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'
import { Platform } from 'react-native'

// Import screens for each tab
import QuizTabScreen from '../screens/QuizTabScreen'
import LearningTabScreen from '../features/learning/screens/LearningTabScreen'
import ChallengeTabScreen from '../screens/ChallengeTabScreen'

// Tab navigator types
export type TabParamList = {
  QuizTab: undefined
  LearningTab: undefined
  ChallengeTab: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string

          if (route.name === 'QuizTab') {
            iconName = focused ? 'help-circle' : 'help-circle-outline'
          } else if (route.name === 'LearningTab') {
            iconName = focused ? 'book' : 'book-outline'
          } else if (route.name === 'ChallengeTab') {
            iconName = focused ? 'trophy' : 'trophy-outline'
          } else {
            iconName = 'help-circle-outline'
          }

          return <Icon name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="QuizTab" component={QuizTabScreen} options={{ title: 'Quiz' }} />
      <Tab.Screen
        name="LearningTab"
        component={LearningTabScreen}
        options={{ title: 'Learning' }}
      />
      <Tab.Screen
        name="ChallengeTab"
        component={ChallengeTabScreen}
        options={{ title: 'Challenge' }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
