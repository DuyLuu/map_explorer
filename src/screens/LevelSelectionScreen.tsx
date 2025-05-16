import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { useCountryStore } from '../stores/countryStore'
import { useNavigation } from '@react-navigation/native'

const LevelSelectionScreen: React.FC = () => {
  const { selectedLevel, setSelectedLevel } = useCountryStore()
  const navigation = useNavigation()

  const levels = [
    { id: 1, name: 'Easy', description: 'Most popular countries' },
    { id: 2, name: 'Medium', description: 'Moderately known countries' },
    { id: 3, name: 'Hard', description: 'Less known countries' },
  ]

  const handleSelect = (level: number) => {
    setSelectedLevel(level)
  }

  const onConfirm = () => {
    navigation.navigate('Quiz')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Difficulty Level</Text>
      <View style={styles.optionsContainer}>
        {levels.map(level => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.optionButton,
              selectedLevel === level.id && styles.selectedOption,
            ]}
            onPress={() => handleSelect(level.id)}>
            <Text
              style={[
                styles.levelName,
                selectedLevel === level.id && styles.selectedText,
              ]}>
              {level.name}
            </Text>
            <Text
              style={[
                styles.levelDescription,
                selectedLevel === level.id && styles.selectedText,
              ]}>
              {level.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity 
        style={[styles.confirmButton, !selectedLevel && styles.disabledButton]} 
        onPress={onConfirm}
        disabled={!selectedLevel}>
        <Text style={styles.confirmButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
    marginHorizontal: 24,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#25A278',
    borderColor: '#1a8c63',
  },
  levelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#F47D42',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginHorizontal: 24,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default LevelSelectionScreen 