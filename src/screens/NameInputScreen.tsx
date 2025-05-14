import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { useLeaderboardStore } from '../stores/leaderboardStore'
import { useNavigation, useRoute } from '@react-navigation/native'

const NameInputScreen: React.FC = () => {
  const [name, setName] = useState('')
  const { addEntry } = useLeaderboardStore()
  const navigation = useNavigation()
  const route = useRoute()
  const { score, questionCount } = route.params as {
    score: number
    questionCount: number
  }

  const handleSubmit = () => {
    if (name.trim()) {
      addEntry({
        name: name.trim(),
        score,
        questionCount,
      })
      navigation.navigate('Leaderboard')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Game Over!</Text>
        <Text style={styles.score}>
          Your Score: {score}/{questionCount}
        </Text>

        <Text style={styles.label}>Enter your name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          maxLength={20}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!name.trim()}>
          <Text style={styles.buttonText}>Save Score</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { marginTop: 24 }]}
          onPress={() => navigation.navigate('Leaderboard')}>
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>
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
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  score: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default NameInputScreen
