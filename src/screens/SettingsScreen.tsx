import React from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import BackButton from '../components/BackButton'
import { Text } from '../components/Text'
import { Box } from '../components/Box'
import { Button } from '../components/Button'

type RootStackParamList = {
  Home: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()

  return (
    <SafeAreaView style={styles.container}>
      <Box padding="l" flex>
        <Box row centerItems justifyStart marginBottom="l">
          <BackButton />
          <Text variant="h3" primary style={styles.title}>
            Settings
          </Text>
        </Box>

        <Box style={styles.sectionContainer}>
          <Button style={styles.section} padding="l" borderRadius={12} backgroundColor="#f8f8f8">
            <Text variant="h6" weight="bold" primary>
              Purchase Pro
            </Text>
            <Text variant="bodySmall" muted>
              Unlock all features and remove ads
            </Text>
          </Button>

          <Button style={styles.section} padding="l" borderRadius={12} backgroundColor="#f8f8f8">
            <Text variant="h6" weight="bold" primary>
              About
            </Text>
            <Text variant="bodySmall" muted>
              Learn more about World Explorer
            </Text>
          </Button>
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
  title: {
    marginLeft: 16,
  },
  sectionContainer: {
    gap: 16,
  },
  section: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
  },
})

export default SettingsScreen
