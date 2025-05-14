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

const QuestionCountScreen: React.FC = () => {
  const { questionCount, setQuestionCount } = useCountryStore()
  const navigation = useNavigation()

  const options = [5, 10, 15, 20]

  const handleSelect = (count: number) => {
    setQuestionCount(count)
  }

  const onConfirm = () => {
    navigation.navigate('Quiz')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select Number of Questions</Text>
      <View style={styles.optionsContainer}>
        {options.map(count => (
          <TouchableOpacity
            key={count}
            style={[
              styles.optionButton,
              questionCount === count && styles.selectedOption,
            ]}
            onPress={() => handleSelect(count)}>
            <Text
              style={[
                styles.optionText,
                questionCount === count && styles.selectedText,
              ]}>
              {count} Questions
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
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
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#25A278',
  },
  optionText: {
    fontSize: 18,
    color: '#000',
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
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default QuestionCountScreen
