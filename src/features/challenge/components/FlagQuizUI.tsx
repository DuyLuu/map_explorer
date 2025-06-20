import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'components/Text'
import Flag from 'components/Flag'
import { Box } from 'components/Box'
import { ImageSourcePropType } from 'react-native'

interface Question {
  flagAsset: ImageSourcePropType
  correctAnswer: string
  options: string[]
}

interface FlagQuizUIProps {
  currentQuestion: Question
  selectedAnswer: string | null
  showFeedback: boolean
  onSelectAnswer: (answer: string) => void
  onSubmit: () => void
}

const FlagQuizUI: React.FC<FlagQuizUIProps> = ({
  currentQuestion,
  selectedAnswer,
  showFeedback,
  onSelectAnswer,
  onSubmit
}) => {
  return (
    <Box>
      <Flag flagAsset={currentQuestion.flagAsset} />

      <Box marginTop="ml" style={{ gap: 12 }}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && styles.selectedOption,
              showFeedback && option === currentQuestion.correctAnswer && styles.correctOption,
              showFeedback &&
                selectedAnswer === option &&
                option !== currentQuestion.correctAnswer &&
                styles.wrongOption
            ]}
            onPress={() => onSelectAnswer(option)}
            disabled={showFeedback}
          >
            <Text
              style={[
                styles.optionText,
                ...(showFeedback && option === currentQuestion.correctAnswer
                  ? [styles.correctText]
                  : []),
                ...(showFeedback &&
                selectedAnswer === option &&
                option !== currentQuestion.correctAnswer
                  ? [styles.wrongText]
                  : [])
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </Box>

      {/* Submit Button for Flag Quiz */}
      {selectedAnswer && !showFeedback && (
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitButtonText}>Submit Answer</Text>
        </TouchableOpacity>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0'
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff'
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#f0fff0'
  },
  wrongOption: {
    borderColor: '#F44336',
    backgroundColor: '#fff0f0'
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333'
  },
  correctText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  wrongText: {
    color: '#F44336',
    fontWeight: 'bold'
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  }
})

export default FlagQuizUI
