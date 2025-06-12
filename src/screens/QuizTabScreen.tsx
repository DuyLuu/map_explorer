import React from 'react'
import { StyleSheet, SafeAreaView, Platform, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { FormattedMessage } from 'react-intl'
import { useCountries } from 'hooks/useCountries'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Theme } from 'theme/constants'
import IMAGES from 'assets/images'

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
          <FormattedMessage id="navigation.screen.title.quiz" defaultMessage="Quiz Mode" />
        </Text>
        <Text variant="body" muted center style={styles.subtitle}>
          <FormattedMessage
            id="navigation.screen.description.quiz"
            defaultMessage="Test your geography knowledge!"
          />
        </Text>

        <Box style={[styles.buttonContainer, { width: '100%' }]}>
          <Button
            style={[styles.button]}
            onPress={() => navigation.navigate('FlagRegionSelection')}
            disabled={isLoading}
            loading={isLoading}
            borderRadius={16}
            backgroundColor={Theme.colors.light}
            fullWidth
            center
          >
            {!isLoading && (
              <Box row center flex>
                <Image source={IMAGES.flag} style={styles.flagImage} resizeMode="contain" />
                <Box flex marginLeft="m">
                  <Text variant="h6" weight="bold" color={Theme.colors.baseBlack}>
                    <FormattedMessage
                      id="navigation.screen.title.flagQuiz"
                      defaultMessage="Flag Quiz"
                    />
                  </Text>
                  <Text variant="bodySmall" color={Theme.colors.subText}>
                    <FormattedMessage
                      id="navigation.screen.description.flagQuiz"
                      defaultMessage="Identify country flags"
                    />
                  </Text>
                </Box>
              </Box>
            )}
          </Button>

          {/* Map Quiz button - iOS only */}
          {Platform.OS === 'ios' && (
            <Button
              style={[styles.button]}
              onPress={() => navigation.navigate('MapRegionSelection')}
              disabled={isLoading}
              loading={isLoading}
              borderRadius={16}
              backgroundColor={Theme.colors.light}
              fullWidth
              center
            >
              {!isLoading && (
                <Box row center>
                  <Image source={IMAGES.map} style={styles.mapImage} resizeMode="stretch" />
                  <Box flex marginLeft="s">
                    <Text variant="h6" weight="bold" color={Theme.colors.baseBlack}>
                      <FormattedMessage
                        id="navigation.screen.title.mapQuiz"
                        defaultMessage="Map Quiz"
                      />
                    </Text>
                    <Text variant="bodySmall" color={Theme.colors.subText}>
                      <FormattedMessage
                        id="navigation.screen.description.mapQuiz"
                        defaultMessage="Locate countries on map"
                      />
                    </Text>
                  </Box>
                </Box>
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
    backgroundColor: '#fff'
  },
  subtitle: {
    marginBottom: 24
  },
  buttonContainer: {
    gap: 16,
    marginTop: 32
  },
  button: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: Theme.colors.breakLine,
    borderStyle: 'solid'
  },

  buttonIcon: {
    fontSize: 24,
    marginBottom: 8
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  mapImage: {
    width: 100,
    aspectRatio: 1
  },
  flagImage: {
    width: 90,
    aspectRatio: 1,
    borderRadius: 50
  }
})

export default QuizTabScreen
