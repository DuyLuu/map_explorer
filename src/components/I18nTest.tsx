import React from 'react'
import { TouchableOpacity } from 'react-native'
import { FormattedMessage, useIntl } from 'react-intl'

import { useLanguage } from '../i18n'
import { SUPPORTED_LOCALES, SupportedLocale } from '../i18n/config'
import { Box, Text } from 'components/index'
import { useTheme } from '../theme'

const I18nTest: React.FC = () => {
  const intl = useIntl()
  const { currentLocale, setLocale, isLoading } = useLanguage()
  const { theme } = useTheme()

  const handleLanguageChange = async (locale: SupportedLocale) => {
    await setLocale(locale)
  }

  return (
    <Box flex={1} padding="m" backgroundColor="background">
      <Text variant="h1" center marginBottom="l" color="text">
        🌍 Internationalization Test
      </Text>

      <Box backgroundColor="parchment" padding="m" marginBottom="m" borderRadius="md" shadow="default">
        <Text variant="h6" weight="bold" marginBottom="s" color="text">
          Current Language:
        </Text>
        <Text variant="body" weight="medium" color="primary">
          {currentLocale} - {SUPPORTED_LOCALES[currentLocale]}
        </Text>
      </Box>

      <Box backgroundColor="parchment" padding="m" marginBottom="m" borderRadius="md" shadow="default">
        <Text variant="h6" weight="bold" marginBottom="s" color="text">
          Translated Messages:
        </Text>

        <Text variant="body" marginBottom="xs" color="text">
          Welcome Message:{' '}
          <FormattedMessage
            id="common.message.welcome"
            defaultMessage="Welcome to World Explorer!"
          />
        </Text>

        <Text variant="body" marginBottom="xs" color="text">
          Start Button: <FormattedMessage id="common.button.start" defaultMessage="Start" />
        </Text>

        <Text variant="body" marginBottom="xs" color="text">
          Score Label: <FormattedMessage id="common.label.score" defaultMessage="Score" />
        </Text>

        <Text variant="body" marginBottom="xs" color="text">
          Quiz Tab: <FormattedMessage id="navigation.tab.quiz" defaultMessage="Quiz" />
        </Text>
      </Box>

      <Box backgroundColor="parchment" padding="m" marginBottom="m" borderRadius="md" shadow="default">
        <Text variant="h6" weight="bold" marginBottom="s" color="text">
          Language Selector:
        </Text>
        <Text variant="bodySmall" color="subText" marginBottom="s">
          Tap to change language
        </Text>

        {Object.entries(SUPPORTED_LOCALES).map(([locale, displayName]) => (
          <TouchableOpacity
            key={locale}
            onPress={() => handleLanguageChange(locale as SupportedLocale)}
            disabled={isLoading}
          >
            <Box
              padding="s"
              backgroundColor={currentLocale === locale ? "primary" : "lightGray"}
              borderRadius="sm"
              marginBottom="xs"
              borderWidth={1}
              borderColor={currentLocale === locale ? "primary" : "gray"}
              center
            >
              <Text
                variant="body"
                color={currentLocale === locale ? "white" : "text"}
                weight={currentLocale === locale ? "bold" : "normal"}
              >
                {locale} - {displayName}
              </Text>
            </Box>
          </TouchableOpacity>
        ))}
      </Box>

      <Box backgroundColor="parchment" padding="m" marginBottom="m" borderRadius="md" shadow="default">
        <Text variant="h6" weight="bold" marginBottom="s" color="text">
          Using useIntl Hook:
        </Text>
        <Text variant="body" color="text">
          Welcome (via hook):{' '}
          {intl.formatMessage({
            id: 'common.message.welcome',
            defaultMessage: 'Welcome to World Explorer!'
          })}
        </Text>
      </Box>

      <Box backgroundColor="parchment" padding="m" borderRadius="md" shadow="default">
        <Text variant="h6" weight="bold" marginBottom="s" color="text">
          Status:
        </Text>
        <Text variant="body" marginBottom="xs" color="subText">
          Loading: {isLoading ? 'Yes' : 'No'}
        </Text>
        <Text variant="body" color="subText">
          Locale: {currentLocale}
        </Text>
      </Box>
    </Box>
  )
}

export default I18nTest
