import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import TabNavigator from './TabNavigator'

export type RootStackParamList = {
  MainTabs: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
