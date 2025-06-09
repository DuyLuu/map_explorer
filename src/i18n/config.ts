/**
 * Internationalization configuration for World Explorer
 * Sets up react-intl with supported locales and basic configuration
 * MVP version: English and Vietnamese only
 */

export const SUPPORTED_LOCALES = {
  en: 'English',
  vi: 'Tiếng Việt',
} as const

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export const LOCALE_CODES = Object.keys(SUPPORTED_LOCALES) as SupportedLocale[]

/**
 * React-intl configuration options
 */
export const INTL_CONFIG = {
  defaultLocale: DEFAULT_LOCALE,
  fallbackOnEmptyString: true,
  onError: (error: Error) => {
    console.warn('React Intl Error:', error)
  },
  onWarn: (warning: string) => {
    console.warn('React Intl Warning:', warning)
  },
}
