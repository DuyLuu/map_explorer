import React from 'react'
import { TouchableOpacity } from 'react-native'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'components/index'

import { useLanguage } from '../i18n/LanguageContext'
import { SUPPORTED_LOCALES, SupportedLocale } from '../i18n/config'
import { useTheme } from '../theme'

import { Box } from './Box'
import { Text } from './Text'

interface LanguageOptionProps {
  locale: SupportedLocale
  isSelected: boolean
  onSelect: (locale: SupportedLocale) => void
}

const LanguageOption: React.FC<LanguageOptionProps> = ({ locale, isSelected, onSelect }) => {
  const { theme } = useTheme()
  const handlePress = () => {
    onSelect(locale)
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Box
        row
        centerItems
        spaceBetween
        padding="m"
        backgroundColor={isSelected ? "parchment" : "white"}
        borderRadius="md"
        borderWidth={1}
        borderColor={isSelected ? "primary" : "breakLine"}
      >
        <Box>
          <Text variant="bodyLarge" weight="medium" color="text">
            {SUPPORTED_LOCALES[locale]}
          </Text>
          <Text variant="bodySmall" muted>
            {locale.toUpperCase()}
          </Text>
        </Box>
        {isSelected && <Icon name="ic_check" size="md" color="success" />}
      </Box>
    </TouchableOpacity>
  )
}

export const LanguageSelector: React.FC = () => {
  const { currentLocale, setLocale, isLoading } = useLanguage()
  const { theme } = useTheme()

  const handleLanguageSelect = async (locale: SupportedLocale) => {
    if (locale !== currentLocale && !isLoading) {
      await setLocale(locale)
    }
  }

  const languageEntries = Object.entries(SUPPORTED_LOCALES) as [SupportedLocale, string][]

  return (
    <Box backgroundColor="background" borderRadius="md" padding="m">
      <Box marginBottom="m">
        <Text variant="h6" weight="bold" color="text">
          <FormattedMessage id="settings.language.title" defaultMessage="Language" />
        </Text>
        <Text variant="bodySmall" muted>
          <FormattedMessage
            id="settings.language.description"
            defaultMessage="Choose your preferred language"
          />
        </Text>
      </Box>

      <Box>
        {languageEntries.map(([locale, _]) => (
          <LanguageOption
            key={locale}
            locale={locale}
            isSelected={locale === currentLocale}
            onSelect={handleLanguageSelect}
          />
        ))}
      </Box>

      {isLoading && (
        <Box padding="m" centerItems>
          <Text variant="bodySmall" muted>
            <FormattedMessage
              id="settings.language.loading"
              defaultMessage="Changing language..."
            />
          </Text>
        </Box>
      )}
    </Box>
  )
}
