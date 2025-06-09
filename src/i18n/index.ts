/**
 * Main entry point for internationalization system
 * Exports all necessary configuration, types, and utilities
 */

export * from './config'
export * from './types'

// Re-export react-intl components and hooks for convenience
export {
  IntlProvider,
  FormattedMessage,
  FormattedNumber,
  FormattedDate,
  FormattedTime,
  FormattedRelativeTime,
  useIntl,
  defineMessages,
  defineMessage,
} from 'react-intl'

// Export language context and hooks
export { LanguageProvider, useLanguage, useCurrentLocale, languageStorage } from './LanguageContext'
