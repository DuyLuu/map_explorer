import React from 'react'
import { StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native'
import { useQuiz } from 'hooks/useQuiz'
import Flag from 'components/Flag'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'

const QuizScreen: React.FC = () => {
  const {
    currentQuestion,
    score,
    highScore,
    showFeedback,
    selectedAnswer,
    currentQuestionNumber,
    questionCount,
    currentLevel,
    isLoadingCountries,
    isInitializing,
    countriesError,
    handleSelectAnswer,
    handleSubmit,
    handleNextQuestion,
  } = useQuiz()

  const getLevelName = (level: number): string => {
    const levels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
    return levels[level as keyof typeof levels] || `Level ${level}`
  }

  const getLevelColor = (level: number): string => {
    const colors = { 1: '#4CAF50', 2: '#FF9800', 3: '#F44336' }
    return colors[level as keyof typeof colors] || '#666'
  }

  // Show loading screen while countries are loading or quiz is initializing
  if (isLoadingCountries || isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex center padding="l">
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>
            {isLoadingCountries ? 'Loading countries...' : 'Initializing quiz...'}
          </Text>
        </Box>
      </SafeAreaView>
    )
  }

  // Show error screen if there was an error loading countries
  if (countriesError) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex center padding="l">
          <Text style={styles.errorText}>Error loading countries data</Text>
          <Text style={styles.errorSubtext}>
            Please check your internet connection and try again
          </Text>
        </Box>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Box
        padding="m"
        row
        spaceBetween
        centerItems
        style={{ borderBottomWidth: 1, borderBottomColor: '#eee' }}
      >
        <Box flex>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.highScore}>High Score: {highScore}</Text>
        </Box>
      </Box>

      <Box padding="m" centerItems>
        <Text style={styles.progressText}>
          Question {currentQuestionNumber} of {questionCount}
        </Text>
        <Box style={styles.levelIndicator}>
          <Text style={[styles.levelText, { color: getLevelColor(currentLevel) }]}>
            {getLevelName(currentLevel)}
          </Text>
        </Box>
      </Box>

      {currentQuestion && (
        <Box style={styles.questionContainer}>
          <Flag flagAsset={currentQuestion.flagAsset} />

          <Box style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const optionStyles = [
                styles.optionButton,
                selectedAnswer === option ? styles.selectedOption : null,
                showFeedback && option === currentQuestion.correctAnswer
                  ? styles.correctOption
                  : null,
                showFeedback &&
                selectedAnswer === option &&
                option !== currentQuestion.correctAnswer
                  ? styles.wrongOption
                  : null,
              ].filter(Boolean) as import('react-native').ViewStyle[]
              return (
                <Button
                  key={index}
                  style={optionStyles}
                  onPress={() => handleSelectAnswer(option)}
                  disabled={showFeedback}
                  padding="m"
                  borderRadius={8}
                  fullWidth
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
                        : []),
                    ]}
                  >
                    {option}
                  </Text>
                </Button>
              )
            })}
          </Box>

          {selectedAnswer && !showFeedback && (
            <Button
              style={styles.submitButton}
              onPress={handleSubmit}
              padding="m"
              borderRadius={8}
              backgroundColor="#007AFF"
              fullWidth
            >
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </Button>
          )}

          {showFeedback && (
            <Button
              style={styles.nextButton}
              onPress={handleNextQuestion}
              padding="m"
              borderRadius={8}
              backgroundColor="#007AFF"
              fullWidth
            >
              <Text style={styles.nextButtonText}>
                {currentQuestionNumber < questionCount ? 'Next Question' : 'Finish Quiz'}
              </Text>
            </Button>
          )}
        </Box>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreContainer: {
    flex: 1,
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
  levelIndicator: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default QuizScreen
