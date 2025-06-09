/**
 * Locales index file
 * Provides utilities and structure for managing translation files
 */

import { SupportedLocale } from '../i18n/config'

/**
 * Translation file categories
 */
export const TRANSLATION_CATEGORIES = {
  COMMON: 'common',
  NAVIGATION: 'navigation',
  QUIZ: 'quiz',
  LEARNING: 'learning',
  CHALLENGE: 'challenge',
  SETTINGS: 'settings',
} as const

export type TranslationCategory =
  (typeof TRANSLATION_CATEGORIES)[keyof typeof TRANSLATION_CATEGORIES]

/**
 * Get the file path for a specific locale and category
 */
export const getTranslationFilePath = (
  locale: SupportedLocale,
  category: TranslationCategory
): string => {
  return `src/locales/${locale}/${category}.json`
}

/**
 * Get all translation file paths for a specific locale
 */
export const getLocaleFilePaths = (
  locale: SupportedLocale
): Record<TranslationCategory, string> => {
  return {
    [TRANSLATION_CATEGORIES.COMMON]: getTranslationFilePath(locale, TRANSLATION_CATEGORIES.COMMON),
    [TRANSLATION_CATEGORIES.NAVIGATION]: getTranslationFilePath(
      locale,
      TRANSLATION_CATEGORIES.NAVIGATION
    ),
    [TRANSLATION_CATEGORIES.QUIZ]: getTranslationFilePath(locale, TRANSLATION_CATEGORIES.QUIZ),
    [TRANSLATION_CATEGORIES.LEARNING]: getTranslationFilePath(
      locale,
      TRANSLATION_CATEGORIES.LEARNING
    ),
    [TRANSLATION_CATEGORIES.CHALLENGE]: getTranslationFilePath(
      locale,
      TRANSLATION_CATEGORIES.CHALLENGE
    ),
    [TRANSLATION_CATEGORIES.SETTINGS]: getTranslationFilePath(
      locale,
      TRANSLATION_CATEGORIES.SETTINGS
    ),
  }
}

/**
 * Validate locale directory structure
 * MVP version: Only English and Vietnamese supported
 */
export const validateLocaleStructure = (locale: SupportedLocale): boolean => {
  // This function can be expanded later to check if all required files exist
  // For now, it just validates the locale format
  const validLocales: SupportedLocale[] = ['en', 'vi']
  return validLocales.includes(locale)
}

/**
 * Translation file template structure
 * Used to ensure consistency across all language files
 */
export const TRANSLATION_TEMPLATE = {
  [TRANSLATION_CATEGORIES.COMMON]: {
    button: {
      start: '',
      cancel: '',
      continue: '',
      next: '',
      back: '',
      done: '',
      retry: '',
    },
    label: {
      score: '',
      progress: '',
      loading: '',
      error: '',
    },
    message: {
      welcome: '',
      success: '',
      error: '',
      noData: '',
    },
  },
  [TRANSLATION_CATEGORIES.NAVIGATION]: {
    tab: {
      quiz: '',
      learning: '',
      challenge: '',
    },
    screen: {
      title: {
        home: '',
        quiz: '',
        mapQuiz: '',
        flagQuiz: '',
        learning: '',
        challenge: '',
        leaderboard: '',
      },
    },
  },
  [TRANSLATION_CATEGORIES.QUIZ]: {
    instruction: {
      selectCountry: '',
      chooseFlag: '',
      correctAnswer: '',
      wrongAnswer: '',
    },
    feedback: {
      correct: '',
      incorrect: '',
      gameOver: '',
      completed: '',
    },
    score: {
      current: '',
      final: '',
      best: '',
    },
  },
  [TRANSLATION_CATEGORIES.LEARNING]: {
    country: {
      capital: '',
      population: '',
      language: '',
      currency: '',
      region: '',
    },
    info: {
      geography: '',
      culture: '',
      history: '',
      facts: '',
    },
  },
  [TRANSLATION_CATEGORIES.CHALLENGE]: {
    mode: {
      title: '',
      description: '',
      rules: '',
    },
    progress: {
      question: '',
      remaining: '',
      streak: '',
    },
  },
  [TRANSLATION_CATEGORIES.SETTINGS]: {
    title: '',
    language: {
      title: '',
      description: '',
      loading: '',
    },
    purchasePro: {
      title: '',
      description: '',
    },
    about: {
      title: '',
      description: '',
    },
  },
} as const

// Re-export loader utilities
export {
  loadLocaleMessages,
  loadCategoryMessages,
  getAvailableLocales,
  validateTranslations,
} from './loader'
