import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native'
import { useQuiz } from '../hooks/useQuiz'
import Flag from '../components/Flag'
import { ActivityIndicator } from 'react-native'

const QuizScreen: React.FC = () => {
  const {
    currentQuestion,
    score,
    highScore,
    showFeedback,
    selectedAnswer,
    currentQuestionNumber,
    timeLeft,
    isTimeout,
    questionCount,
    handleSelectAnswer,
    handleSubmit,
    handleNextQuestion,
    setIsImageLoading,
  } = useQuiz()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.highScore}>High Score: {highScore}</Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionNumber} of {questionCount}
        </Text>
        <Text style={[styles.timer, timeLeft <= 3 && styles.timerWarning]}>Time: {timeLeft}s</Text>
      </View>

      {currentQuestion && (
        <View style={styles.questionContainer}>
          <Flag flagUrl={currentQuestion.flagUrl} />

          <View style={styles.optionsContainer}>
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
                    styles.wrongOption,
                ]}
                onPress={() => handleSelectAnswer(option)}
                disabled={showFeedback}
              >
                <Text
                  style={[
                    styles.optionText,
                    showFeedback && option === currentQuestion.correctAnswer && styles.correctText,
                    showFeedback &&
                      selectedAnswer === option &&
                      option !== currentQuestion.correctAnswer &&
                      styles.wrongText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedAnswer && !showFeedback && (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          )}

          {showFeedback && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
              <Text style={styles.nextButtonText}>
                {isTimeout
                  ? 'Restart Game'
                  : currentQuestionNumber < questionCount
                  ? 'Next Question'
                  : 'Finish Quiz'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  highScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressContainer: {
    padding: 16,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  questionContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: '#e0e0e0',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
  correctText: {
    color: '#fff',
  },
  wrongText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  timerWarning: {
    color: '#F44336',
    fontWeight: 'bold',
  },
})

export default QuizScreen
