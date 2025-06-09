/**
 * Language Context Provider
 * Manages current language state and provides language switching functionality
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { IntlProvider } from 'react-intl'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'react-native-localize'

import { SupportedLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES, INTL_CONFIG } from './config'
import { LanguageContextType, LanguagePack } from './types'
import { loadLocaleMessages } from '../locales'
import LoadingScreen from '../components/LoadingScreen'

const LANGUAGE_STORAGE_KEY = '@WorldExplorer:selectedLanguage'

// Create the language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

/**
 * Language Provider Component
 * Wraps the app with both language context and IntlProvider
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>(DEFAULT_LOCALE)
  const [messages, setMessages] = useState<LanguagePack>({})
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Detect device language and return best match from supported locales
   */
  const detectDeviceLanguage = (): SupportedLocale => {
    try {
      const deviceLocales = getLocales()

      for (const deviceLocale of deviceLocales) {
        // First, try exact match (e.g., "zh-CN")
        if (deviceLocale.languageTag in SUPPORTED_LOCALES) {
          return deviceLocale.languageTag as SupportedLocale
        }

        // Then, try language code match (e.g., "zh" for "zh-CN")
        const languageCode = deviceLocale.languageCode
        const exactMatch = Object.keys(SUPPORTED_LOCALES).find(locale =>
          locale.startsWith(languageCode)
        )

        if (exactMatch) {
          return exactMatch as SupportedLocale
        }
      }
    } catch (error) {
      console.warn('Failed to detect device language:', error)
    }

    return DEFAULT_LOCALE
  }

  /**
   * Load stored language preference or detect device language
   */
  const initializeLanguage = async (): Promise<SupportedLocale> => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)

      if (storedLanguage && storedLanguage in SUPPORTED_LOCALES) {
        return storedLanguage as SupportedLocale
      }

      // If no stored preference, detect device language
      return detectDeviceLanguage()
    } catch (error) {
      console.warn('Failed to load stored language:', error)
      return detectDeviceLanguage()
    }
  }

  /**
   * Change the current language and persist the choice
   */
  const setLocale = async (newLocale: SupportedLocale) => {
    try {
      setIsLoading(true)

      // Load translations for the new locale (now synchronous)
      const newMessages = loadLocaleMessages(newLocale)

      // Update state
      setCurrentLocale(newLocale)
      setMessages(newMessages)

      // Persist the choice
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale)

      console.log(`Language changed to: ${newLocale} (${SUPPORTED_LOCALES[newLocale]})`)
    } catch (error) {
      console.error('Failed to change language:', error)

      // Fallback to English if language change fails
      if (newLocale !== DEFAULT_LOCALE) {
        console.warn('Falling back to default language')
        await setLocale(DEFAULT_LOCALE)
      }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Initialize language on app start
   */
  useEffect(() => {
    const initLanguage = async () => {
      try {
        const initialLocale = await initializeLanguage()
        const initialMessages = loadLocaleMessages(initialLocale)

        setCurrentLocale(initialLocale)
        setMessages(initialMessages)

        console.log(
          `App initialized with language: ${initialLocale} (${SUPPORTED_LOCALES[initialLocale]})`
        )
      } catch (error) {
        console.error('Failed to initialize language:', error)

        // Fallback to default
        setCurrentLocale(DEFAULT_LOCALE)
        setMessages({})
      } finally {
        setIsLoading(false)
      }
    }

    initLanguage()
  }, [])

  // Context value
  const contextValue: LanguageContextType = {
    currentLocale,
    setLocale,
    messages,
    isLoading,
  }

  // Flatten messages for react-intl
  const flattenMessages = (messages: LanguagePack): Record<string, string> => {
    const flattened: Record<string, string> = {}

    const flatten = (obj: any, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key]
        const newKey = prefix ? `${prefix}.${key}` : key

        if (typeof value === 'object' && value !== null) {
          flatten(value, newKey)
        } else {
          flattened[newKey] = value
        }
      })
    }

    flatten(messages)
    return flattened
  }

  // Show loading screen while translations are loading
  if (isLoading) {
    return <LoadingScreen message="Loading language settings..." />
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      <IntlProvider
        locale={currentLocale}
        messages={flattenMessages(messages)}
        defaultLocale={DEFAULT_LOCALE}
        onError={INTL_CONFIG.onError}
        onWarn={INTL_CONFIG.onWarn}
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  )
}

/**
 * Hook to use language context
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}

/**
 * Hook to get current locale (shorthand)
 */
export const useCurrentLocale = (): SupportedLocale => {
  const { currentLocale } = useLanguage()
  return currentLocale
}

/**
 * Storage utilities for direct access if needed
 */
export const languageStorage = {
  async getStoredLocale(): Promise<SupportedLocale | null> {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      return stored && stored in SUPPORTED_LOCALES ? (stored as SupportedLocale) : null
    } catch {
      return null
    }
  },

  async setStoredLocale(locale: SupportedLocale): Promise<void> {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, locale)
    } catch (error) {
      console.error('Failed to store language preference:', error)
    }
  },

  async clearStoredLocale(): Promise<void> {
    try {
      await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear language preference:', error)
    }
  },
}
