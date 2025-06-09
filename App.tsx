/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { LanguageProvider } from './src/i18n'
import RootNavigator from 'navigation/RootNavigator'

const App = () => {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <RootNavigator />
      </LanguageProvider>
    </SafeAreaProvider>
  )
}

export default App
