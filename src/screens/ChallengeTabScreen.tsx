import React from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'

const ChallengeTabScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Challenges</Text>
        <Text style={styles.subtitle}>Special challenges and competitions</Text>

        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>🚀</Text>
          <Text style={styles.placeholderText}>Coming Soon!</Text>
          <Text style={styles.placeholderSubtext}>
            Exciting new challenges and competitions are being prepared
          </Text>
        </View>
      </View>
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
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
    textAlign: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    width: '100%',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
})

export default ChallengeTabScreen
