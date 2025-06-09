/**
 * TypeScript type definitions for the internationalization system
 */

import { SupportedLocale } from './config'

/**
 * Message structure for react-intl
 */
export interface IntlMessage {
  id: string
  defaultMessage: string
  description?: string
}

/**
 * Language pack structure for each locale
 */
export interface LanguagePack {
  [key: string]: string | LanguagePack
}

/**
 * Language context type for React context
 */
export interface LanguageContextType {
  currentLocale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
  messages: LanguagePack
  isLoading: boolean
}

/**
 * Language storage interface
 */
export interface LanguageStorage {
  getStoredLocale: () => Promise<SupportedLocale | null>
  setStoredLocale: (locale: SupportedLocale) => Promise<void>
  removeStoredLocale: () => Promise<void>
}
