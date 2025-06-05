import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { QuizQuestion } from '../types/quiz'
import {
  generateQuizQuestion,
  saveQuizProgress,
  getQuizProgress,
  recordLearnedCountry,
} from '../services/quizService'
import { useCountryStore } from '../stores/countryStore'
import { initializeTts, speakText } from '../services/speechService'

type RootStackParamList = {
  NameInput: { score: number; questionCount: number }
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export const useQuiz = () => {
  const { questionCount, selectedLevel, selectedRegion } = useCountryStore()
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [usedFlags, setUsedFlags] = useState<string[]>([])
  const navigation = useNavigation<NavigationProp>()

  useEffect(() => {
    loadNextQuestion()
    loadHighScore()
    initializeTts()
  }, [])

  const handleTimeout = () => {
    setShowFeedback(true)
  }

  const restartGame = () => {
    setScore(0)
    setCurrentQuestionNumber(1)
    setShowFeedback(false)
    setSelectedAnswer(null)
    setUsedFlags([])
    loadNextQuestion()
  }

  const loadHighScore = async () => {
    const progress = await getQuizProgress(selectedLevel)
    setHighScore(progress)
  }

  const handleSelectAnswer = async (answer: string) => {
    setSelectedAnswer(answer)
    await speakText(answer)
  }

  const handleSubmit = async () => {
    if (!selectedAnswer) return

    setShowFeedback(true)
    if (selectedAnswer === currentQuestion?.correctAnswer) {
      const newScore = score + 1
      setScore(newScore)
      if (newScore > highScore) {
        setHighScore(newScore)
      }

      // Record the learned country for progress tracking
      if (currentQuestion?.id) {
        try {
          const countryId = parseInt(currentQuestion.id, 10)
          await recordLearnedCountry(selectedRegion, selectedLevel, countryId)
        } catch (error) {
          console.error('Error recording learned country:', error)
          // Don't break the quiz flow if progress tracking fails
        }
      }
    }
  }

  const loadNextQuestion = async () => {
    setIsImageLoading(true)
    const newQuestion = await generateQuizQuestion(selectedLevel, selectedRegion, usedFlags)
    setCurrentQuestion(newQuestion)
    setUsedFlags(prev => [...prev, newQuestion.id])
    setShowFeedback(false)
    setSelectedAnswer(null)
  }

  const handleNextQuestion = async () => {
    if (currentQuestionNumber < questionCount) {
      setCurrentQuestionNumber(prev => prev + 1)
      await loadNextQuestion()
    } else {
      await saveQuizProgress(selectedLevel, highScore)
      navigation.navigate('NameInput', { score, questionCount })
    }
  }

  return {
    currentQuestion,
    score,
    highScore,
    showFeedback,
    selectedAnswer,
    isImageLoading,
    currentQuestionNumber,
    questionCount,
    handleSelectAnswer,
    handleSubmit,
    handleNextQuestion,
    setIsImageLoading,
  }
}
