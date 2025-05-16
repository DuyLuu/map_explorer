import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { QuizQuestion } from '../types/quiz'
import { generateQuizQuestion, saveQuizProgress, getQuizProgress } from '../services/quizService'
import { useCountryStore } from '../stores/countryStore'
import { initializeTts, speakText } from '../services/speechService'

type RootStackParamList = {
  NameInput: { score: number; questionCount: number }
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export const useQuiz = () => {
  const { questionCount, selectedLevel } = useCountryStore()
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isTimeout, setIsTimeout] = useState(false)
  const [usedFlags, setUsedFlags] = useState<string[]>([])
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
        setTimeLeft(prev => {
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
    const newQuestion = await generateQuizQuestion(selectedLevel, usedFlags)
    setCurrentQuestion(newQuestion)
    setUsedFlags(prev => [...prev, newQuestion.id])
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
    timeLeft,
    isTimeout,
    questionCount,
    handleSelectAnswer,
    handleSubmit,
    handleNextQuestion,
    setIsImageLoading,
  }
}
