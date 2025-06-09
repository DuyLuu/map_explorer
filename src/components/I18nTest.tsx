/**
 * I18n Test Component
 * Simple component to test that internationalization is working correctly
 */

import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLanguage } from '../i18n'
import { SUPPORTED_LOCALES, SupportedLocale } from '../i18n/config'

const I18nTest: React.FC = () => {
  const intl = useIntl()
  const { currentLocale, setLocale, isLoading } = useLanguage()

  const handleLanguageChange = async (locale: SupportedLocale) => {
    await setLocale(locale)
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🌍 Internationalization Test</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Language:</Text>
        <Text style={styles.currentLanguage}>
          {currentLocale} - {SUPPORTED_LOCALES[currentLocale]}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Translated Messages:</Text>

        <Text style={styles.messageItem}>
          Welcome Message:{' '}
          <FormattedMessage
            id="common.message.welcome"
            defaultMessage="Welcome to World Explorer!"
          />
        </Text>

        <Text style={styles.messageItem}>
          Start Button: <FormattedMessage id="common.button.start" defaultMessage="Start" />
        </Text>

        <Text style={styles.messageItem}>
          Score Label: <FormattedMessage id="common.label.score" defaultMessage="Score" />
        </Text>

        <Text style={styles.messageItem}>
          Quiz Tab: <FormattedMessage id="navigation.tab.quiz" defaultMessage="Quiz" />
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language Selector:</Text>
        <Text style={styles.subtitle}>Tap to change language</Text>

        {Object.entries(SUPPORTED_LOCALES).map(([locale, displayName]) => (
          <TouchableOpacity
            key={locale}
            style={[styles.languageButton, currentLocale === locale && styles.activeLanguageButton]}
            onPress={() => handleLanguageChange(locale as SupportedLocale)}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.languageButtonText,
                currentLocale === locale && styles.activeLanguageButtonText,
              ]}
            >
              {locale} - {displayName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Using useIntl Hook:</Text>
        <Text style={styles.messageItem}>
          Welcome (via hook):{' '}
          {intl.formatMessage({
            id: 'common.message.welcome',
            defaultMessage: 'Welcome to World Explorer!',
          })}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status:</Text>
        <Text style={styles.status}>Loading: {isLoading ? 'Yes' : 'No'}</Text>
        <Text style={styles.status}>Locale: {currentLocale}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  currentLanguage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  messageItem: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  languageButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeLanguageButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  languageButtonText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  activeLanguageButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  status: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
})

export default I18nTest
