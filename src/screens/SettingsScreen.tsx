import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import BackButton from '../components/BackButton'

import { Box } from '@duyluu/rn-ui-kit'

type RootStackParamList = {
  Home: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()

  return (
    <SafeAreaView style={styles.container}>
      <Box padding="lg" style={styles.content}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.section}>
            <Text style={styles.sectionTitle}>Purchase Pro</Text>
            <Text style={styles.sectionDescription}>Unlock all features and remove ads</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.sectionDescription}>Learn more about World Explorer</Text>
          </TouchableOpacity>
        </View>
      </Box>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
})

export default SettingsScreen
