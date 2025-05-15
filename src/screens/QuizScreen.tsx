import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { QuizQuestion } from '../types/quiz'
import {
  generateQuizQuestion,
  saveQuizProgress,
  getQuizProgress,
} from '../services/quizService'
import { useCountryStore } from '../stores/countryStore'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { initializeTts, speakText } from '../services/speechService'

type RootStackParamList = {
  NameInput: { score: number; questionCount: number }
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const QuizScreen: React.FC = () => {
  const { questionCount } = useCountryStore()
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isTimeout, setIsTimeout] = useState(false)
  const navigation = useNavigation<NavigationProp>()

  useEffect(() => {
    loadNextQuestion()
    loadHighScore()
    initializeTts()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!showFeedback && !isTimeout) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleTimeout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [showFeedback, isTimeout])

  const handleTimeout = () => {
    setShowFeedback(true)
    setIsTimeout(true)
  }

  const restartGame = () => {
    setScore(0)
    setCurrentQuestionNumber(1)
    setShowFeedback(false)
    setSelectedAnswer(null)
    setIsTimeout(false)
    setTimeLeft(10)
    loadNextQuestion()
  }

  const loadHighScore = async () => {
    const progress = await getQuizProgress()
    setHighScore(progress)
  }

  const handleSelectAnswer = async (answer: string) => {
    setSelectedAnswer(answer)
    await speakText(answer)
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return

    setShowFeedback(true)
    if (selectedAnswer === currentQuestion?.correctAnswer) {
      const newScore = score + 1
      setScore(newScore)
      if (newScore > highScore) {
        setHighScore(newScore)
      }
    }
  }

  const loadNextQuestion = async () => {
    setIsImageLoading(true)
    const newQuestion = await generateQuizQuestion()
    setCurrentQuestion(newQuestion)
    setShowFeedback(false)
    setSelectedAnswer(null)
  }

  const handleNextQuestion = async () => {
    if (isTimeout) {
      restartGame()
      return
    }
    
    if (currentQuestionNumber < questionCount) {
      setCurrentQuestionNumber(prev => prev + 1)
      setTimeLeft(10)
      await loadNextQuestion()
    } else {
      await saveQuizProgress(highScore)
      navigation.navigate('NameInput', { score, questionCount })
    }
  }

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
        <Text style={[styles.timer, timeLeft <= 3 && styles.timerWarning]}>
          Time: {timeLeft}s
        </Text>
      </View>

      {currentQuestion && (
        <View style={styles.questionContainer}>
          <View style={styles.flagContainer}>
            {isImageLoading && (
              <ActivityIndicator
                size="large"
                color="#007AFF"
                style={styles.loader}
              />
            )}
            <FastImage
              style={styles.flagImage}
              source={{ uri: currentQuestion.flagUrl }}
              resizeMode={FastImage.resizeMode.contain}
              onLoadEnd={() => setIsImageLoading(false)}
            />
          </View>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && styles.selectedOption,
                  showFeedback &&
                    option === currentQuestion.correctAnswer &&
                    styles.correctOption,
                  showFeedback &&
                    selectedAnswer === option &&
                    option !== currentQuestion.correctAnswer &&
                    styles.wrongOption,
                ]}
                onPress={() => handleSelectAnswer(option)}
                disabled={showFeedback}>
                <Text
                  style={[
                    styles.optionText,
                    showFeedback &&
                      option === currentQuestion.correctAnswer &&
                      styles.correctText,
                    showFeedback &&
                      selectedAnswer === option &&
                      option !== currentQuestion.correctAnswer &&
                      styles.wrongText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedAnswer && !showFeedback && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          )}

          {showFeedback && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextQuestion}>
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
  flagContainer: {
    width: 300,
    height: 200,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
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
