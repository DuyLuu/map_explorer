/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import RootNavigator from './src/navigation/RootNavigator'
import { LanguageProvider } from './src/i18n'
import FirebaseService from './src/services/firebase'

const App = () => {
  useEffect(() => {
    // Test Firebase connection on app start
    const testFirebase = async () => {
      try {
        console.log('🔥 Testing Firebase connection...')

        // Test basic connection
        const connected = await FirebaseService.testConnection()

        if (connected) {
          // Get app info
          const appInfo = FirebaseService.getAppInfo()
          console.log('📱 Firebase App Info:', appInfo.name)

          // Test Firestore write (optional - only if you want to test writes)
          // await FirebaseService.testFirestoreWrite()
        }
      } catch (error) {
        console.error('🚨 Firebase test failed:', error)
      }
    }

    testFirebase()
  }, [])

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <RootNavigator />
      </LanguageProvider>
    </SafeAreaProvider>
  )
}

export default App
