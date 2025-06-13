import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Platform } from 'react-native'
import { useIntl } from 'react-intl'
import SettingsButton from 'components/SettingsButton'
import QuizTabScreen from 'screens/QuizTabScreen'
import LearningTabScreen from 'features/learning/screens/LearningTabScreen'
import ChallengeTabScreen from 'screens/ChallengeTabScreen'
import { Icon } from 'components/index'

// Tab navigator types
export type TabParamList = {
  QuizTab: undefined
  LearningTab: undefined
  ChallengeTab: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

// Define icon helper function outside component
const getTabIcon = (route: any, focused: boolean, color: string, size: number) => {
  let iconName: string

  if (route.name === 'QuizTab') {
    iconName = focused ? 'flag_filled' : 'flag_outline'
  } else if (route.name === 'LearningTab') {
    iconName = focused ? 'home_tab_fullfill' : 'home_tab'
  } else {
    iconName = 'diamond' // Default icon
  }

  return (
    <Icon
      name={iconName}
      size={size}
      color={color}
      style={{
        marginBottom: focused ? 2 : 0
      }}
    />
  )
}

const TabNavigator: React.FC = () => {
  const intl = useIntl()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return getTabIcon(route, focused, color, size)
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
        headerRight: () => <SettingsButton />,
        headerStyle: {
          backgroundColor: '#fff'
        },
        headerTitleStyle: {
          color: '#000',
          fontSize: 18,
          fontWeight: '600'
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5'
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        }
      })}
    >
      <Tab.Screen
        name="QuizTab"
        component={QuizTabScreen}
        options={{
          title: intl.formatMessage({
            id: 'navigation.tab.quiz',
            defaultMessage: 'Quiz'
          })
        }}
      />
      <Tab.Screen
        name="LearningTab"
        component={LearningTabScreen}
        options={{
          title: intl.formatMessage({
            id: 'navigation.tab.learning',
            defaultMessage: 'Learning'
          })
        }}
      />
      <Tab.Screen
        name="ChallengeTab"
        component={ChallengeTabScreen}
        options={{
          title: intl.formatMessage({
            id: 'navigation.tab.challenge',
            defaultMessage: 'Challenge'
          })
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator
