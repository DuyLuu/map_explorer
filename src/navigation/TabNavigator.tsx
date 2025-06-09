import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native'
import { useIntl } from 'react-intl'
import SettingsButton from 'components/SettingsButton'

// Import screens for each tab
import QuizTabScreen from 'screens/QuizTabScreen'
import LearningTabScreen from 'features/learning/screens/LearningTabScreen'
import ChallengeTabScreen from 'screens/ChallengeTabScreen'
import { FontAwesomeIcon, IoniconsIcon } from 'components/Icon'

// Tab navigator types
export type TabParamList = {
  QuizTab: undefined
  LearningTab: undefined
  ChallengeTab: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

const TabNavigator: React.FC = () => {
  const intl = useIntl()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'QuizTab') {
            return <FontAwesomeIcon name={focused ? 'flag' : 'flag-o'} size={size} color={color} />
          } else if (route.name === 'LearningTab') {
            return <FontAwesomeIcon name="wpexplorer" size={size} color={color} />
          } else if (route.name === 'ChallengeTab') {
            return (
              <IoniconsIcon
                name={focused ? 'rocket' : 'rocket-outline'}
                size={size}
                color={color}
              />
            )
          }
          return <FontAwesomeIcon name="wpexplorer" size={size} color={color} />
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
        headerRight: () => <SettingsButton />,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          color: '#000',
          fontSize: 18,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="QuizTab"
        component={QuizTabScreen}
        options={{
          title: intl.formatMessage({
            id: 'navigation.tab.quiz',
            defaultMessage: 'Quiz',
          }),
        }}
      />
      <Tab.Screen
        name="LearningTab"
        component={LearningTabScreen}
        options={{
          title: intl.formatMessage({
            id: 'navigation.tab.learning',
            defaultMessage: 'Learning',
          }),
        }}
      />
      <Tab.Screen
        name="ChallengeTab"
        component={ChallengeTabScreen}
        options={{
          title: intl.formatMessage({
            id: 'navigation.tab.challenge',
            defaultMessage: 'Challenge',
          }),
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
