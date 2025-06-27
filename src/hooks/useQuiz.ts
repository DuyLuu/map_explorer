import { useState, useEffect, useCallback } from 'react'
import { useNavigation } from '@react-navigation/native'
import { initializeTts, speakText } from 'services/speechService'

import { useQuizEngine } from './useQuizEngine'
import { useCountries } from './useCountries'

export const useQuiz = () => {
  const {
    currentQuestion,
    score,
    highScore,
    currentLevel,
    questionCount,
    isQuizFinished,
    loadNextQuestion,
    recordAnswer,
    restartQuiz
  } = useQuizEngine()

  const { isLoading: isLoadingCountries, error: countriesError } = useCountries()
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [isInitializing, setIsInitializing] = useState(true)
  const navigation = useNavigation<any>()

  useEffect(() => {
    const init = async () => {
      await initializeTts()
      setIsInitializing(false)
    }
    init()
  }, [])

  const handleSelectAnswer = useCallback(async (answer: string) => {
    setSelectedAnswer(answer)
    await speakText(answer)
  }, [])

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer) return
    setShowFeedback(true)
    recordAnswer(selectedAnswer === currentQuestion?.correctAnswer)
  }, [selectedAnswer, currentQuestion, recordAnswer])

  const handleNextQuestion = useCallback(async () => {
    if (currentQuestionNumber < questionCount) {
      setCurrentQuestionNumber(prev => prev + 1)
      setShowFeedback(false)
      setSelectedAnswer(null)
      setIsImageLoading(true)
      await loadNextQuestion()
    } else {
      navigation.navigate('FlagRegionSelection')
    }
  }, [currentQuestionNumber, questionCount, loadNextQuestion, navigation])

  const restartGame = useCallback(async () => {
    setCurrentQuestionNumber(1)
    setShowFeedback(false)
    setSelectedAnswer(null)
    setIsImageLoading(true)
    await restartQuiz()
  }, [restartQuiz])

  useEffect(() => {
    if (isQuizFinished) {
      navigation.navigate('FlagRegionSelection')
    }
  }, [isQuizFinished, navigation])

  return {
    currentQuestion,
    score,
    highScore,
    showFeedback,
    selectedAnswer,
    isImageLoading,
    currentQuestionNumber,
    questionCount,
    currentLevel,
    isLoadingCountries,
    isInitializing,
    countriesError,
    handleSelectAnswer,
    handleSubmit,
    handleNextQuestion,
    restartGame,
    setIsImageLoading
  }
}
