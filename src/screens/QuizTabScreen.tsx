import React from 'react'
import { StyleSheet, SafeAreaView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { FormattedMessage } from 'react-intl'
import { useCountries } from 'hooks/useCountries'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'

type RootStackParamList = {
  FlagRegionSelection: undefined
  MapRegionSelection: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const QuizTabScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { isLoading } = useCountries()

  return (
    <SafeAreaView style={styles.container}>
      <Box flex padding="xl" center>
        <Text variant="h1" primary center>
          Quiz Mode
        </Text>
        <Text variant="body" muted center style={styles.subtitle}>
          <FormattedMessage
            id="navigation.screen.description.quiz"
            defaultMessage="Test your geography knowledge!"
          />
        </Text>

        <Box style={[styles.buttonContainer, { width: '100%' }]}>
          <Button
            style={[styles.button, styles.flagButton]}
            onPress={() => navigation.navigate('FlagRegionSelection')}
            disabled={isLoading}
            loading={isLoading}
            padding="xl"
            borderRadius={16}
            backgroundColor="#007AFF"
            fullWidth
            center
          >
            {!isLoading && (
              <>
                <Text size={24} style={styles.buttonIcon}>
                  🏳️
                </Text>
                <Text variant="h6" weight="bold" color="#fff" style={styles.buttonText}>
                  Flag Quiz
                </Text>
                <Text variant="bodySmall" color="rgba(255, 255, 255, 0.8)" center>
                  Identify country flags
                </Text>
              </>
            )}
          </Button>

          {/* Map Quiz button - iOS only */}
          {Platform.OS === 'ios' && (
            <Button
              style={[styles.button, styles.mapButton]}
              onPress={() => navigation.navigate('MapRegionSelection')}
              disabled={isLoading}
              loading={isLoading}
              padding="xl"
              borderRadius={16}
              backgroundColor="#34A853"
              fullWidth
              center
            >
              {!isLoading && (
                <>
                  <Text size={24} style={styles.buttonIcon}>
                    🗺️
                  </Text>
                  <Text variant="h6" weight="bold" color="#fff" style={styles.buttonText}>
                    Map Quiz
                  </Text>
                  <Text variant="bodySmall" color="rgba(255, 255, 255, 0.8)" center>
                    Locate countries on map
                  </Text>
                </>
              )}
            </Button>
          )}
        </Box>
      </Box>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subtitle: {
    marginBottom: 24,
  },
  buttonContainer: {
    gap: 16,
    marginTop: 32,
  },
  button: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flagButton: {
    backgroundColor: '#007AFF',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  mapButton: {
    backgroundColor: '#34A853',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
})

export default QuizTabScreen
