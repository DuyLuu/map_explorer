import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { FormattedMessage } from 'react-intl'
import { Box } from './Box'
import { Text } from './Text'
import { Icon } from './Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { SUPPORTED_LOCALES, SupportedLocale } from '../i18n/config'

interface LanguageOptionProps {
  locale: SupportedLocale
  isSelected: boolean
  onSelect: (locale: SupportedLocale) => void
}

const LanguageOption: React.FC<LanguageOptionProps> = ({ locale, isSelected, onSelect }) => {
  const handlePress = () => {
    onSelect(locale)
  }

  return (
    <TouchableOpacity
      style={[styles.languageOption, isSelected && styles.selectedOption]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Box row centerItems justifySpaceBetween padding="m">
        <Box>
          <Text variant="bodyLarge" weight="medium" primary>
            {SUPPORTED_LOCALES[locale]}
          </Text>
          <Text variant="bodySmall" muted>
            {locale.toUpperCase()}
          </Text>
        </Box>
        {isSelected && <Icon name="checkmark-circle" size={24} color="#4CAF50" />}
      </Box>
    </TouchableOpacity>
  )
}

export const LanguageSelector: React.FC = () => {
  const { currentLocale, setLocale, isLoading } = useLanguage()

  const handleLanguageSelect = async (locale: SupportedLocale) => {
    if (locale !== currentLocale && !isLoading) {
      await setLocale(locale)
    }
  }

  const languageEntries = Object.entries(SUPPORTED_LOCALES) as [SupportedLocale, string][]

  return (
    <Box style={styles.container}>
      <Box marginBottom="m">
        <Text variant="h6" weight="bold" primary>
          <FormattedMessage id="settings.language.title" defaultMessage="Language" />
        </Text>
        <Text variant="bodySmall" muted>
          <FormattedMessage
            id="settings.language.description"
            defaultMessage="Choose your preferred language"
          />
        </Text>
      </Box>

      <Box style={styles.languageList}>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  languageList: {
    gap: 2,
  },
  languageOption: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8e9',
  },
})
