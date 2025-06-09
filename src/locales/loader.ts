/**
 * Translation file loader utility
 * Loads and combines all translation files for a specific locale
 * MVP version: English and Vietnamese only
 */

import { SupportedLocale } from '../i18n/config'
import { LanguagePack } from '../i18n/types'
import { TRANSLATION_CATEGORIES, TranslationCategory } from './index'

// Static imports for English
import enCommon from './en/common.json'
import enNavigation from './en/navigation.json'
import enQuiz from './en/quiz.json'
import enLearning from './en/learning.json'
import enChallenge from './en/challenge.json'
import enSettings from './en/settings.json'

// Static imports for Vietnamese
import viCommon from './vi/common.json'
import viNavigation from './vi/navigation.json'
import viQuiz from './vi/quiz.json'
import viLearning from './vi/learning.json'
import viChallenge from './vi/challenge.json'
import viSettings from './vi/settings.json'

// Translation map for static imports - MVP languages only
const translationsMap: Record<SupportedLocale, Record<TranslationCategory, any>> = {
  en: {
    [TRANSLATION_CATEGORIES.COMMON]: enCommon,
    [TRANSLATION_CATEGORIES.NAVIGATION]: enNavigation,
    [TRANSLATION_CATEGORIES.QUIZ]: enQuiz,
    [TRANSLATION_CATEGORIES.LEARNING]: enLearning,
    [TRANSLATION_CATEGORIES.CHALLENGE]: enChallenge,
    [TRANSLATION_CATEGORIES.SETTINGS]: enSettings,
  },
  vi: {
    [TRANSLATION_CATEGORIES.COMMON]: viCommon,
    [TRANSLATION_CATEGORIES.NAVIGATION]: viNavigation,
    [TRANSLATION_CATEGORIES.QUIZ]: viQuiz,
    [TRANSLATION_CATEGORIES.LEARNING]: viLearning,
    [TRANSLATION_CATEGORIES.CHALLENGE]: viChallenge,
    [TRANSLATION_CATEGORIES.SETTINGS]: viSettings,
  },
}

/**
 * Load all translation files for a specific locale
 * Returns a combined object with all translations
 */
export const loadLocaleMessages = (locale: SupportedLocale): LanguagePack => {
  try {
    const translations = translationsMap[locale]

    if (!translations) {
      console.warn(`Locale ${locale} not found, falling back to English`)
      return translationsMap.en
    }

    return translations
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error)
    return translationsMap.en
  }
}

/**
 * Load a specific translation category for a locale
 */
export const loadCategoryMessages = (
  locale: SupportedLocale,
  category: TranslationCategory
): Record<string, any> => {
  try {
    const translations = translationsMap[locale]

    if (!translations || !translations[category]) {
      console.warn(`Category ${category} for locale ${locale} not found, falling back to English`)
      return translationsMap.en[category] || {}
    }

    return translations[category]
  } catch (error) {
    console.error(`Failed to load ${category} translations for locale: ${locale}`, error)
    return translationsMap.en[category] || {}
  }
}

/**
 * Get all available locales
 */
export const getAvailableLocales = (): SupportedLocale[] => {
  return Object.keys(translationsMap) as SupportedLocale[]
}

/**
 * Validate that all required translation keys exist for a locale
 */
export const validateTranslations = (
  locale: SupportedLocale
): {
  isValid: boolean
  missingKeys: string[]
} => {
  try {
    const messages = loadLocaleMessages(locale)
    const missingKeys: string[] = []

    // Check if all categories are present
    Object.values(TRANSLATION_CATEGORIES).forEach(category => {
      if (!messages[category]) {
        missingKeys.push(`Missing category: ${category}`)
      }
    })

    return {
      isValid: missingKeys.length === 0,
      missingKeys,
    }
  } catch (error) {
    return {
      isValid: false,
      missingKeys: [`Error validating translations: ${error}`],
    }
  }
}
