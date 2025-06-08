import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { QuizQuestion } from '../types/quiz'
import {
  generateQuizQuestion,
  saveQuizProgress,
  getQuizProgress,
  recordLearnedCountry,
  getRegionLevelProgress,
  getNextQuizLevel,
} from 'services/quizService'
import { useCountryStore } from 'stores/countryStore'
import { initializeTts, speakText } from 'services/speechService'
import { useCountries } from './useCountries'

export const useQuiz = () => {
  const { selectedRegion } = useCountryStore()
  const {
    data: countriesData,
    isLoading: isLoadingCountries,
    error: countriesError,
  } = useCountries()
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [usedFlags, setUsedFlags] = useState<string[]>([])
  const [learnedCountryIds, setLearnedCountryIds] = useState<number[]>([])
  const [currentLevel, setCurrentLevel] = useState(1) // Start with Easy level
  const [questionsAnsweredAtLevel, setQuestionsAnsweredAtLevel] = useState(0)
  const [isInitializing, setIsInitializing] = useState(true)
  const navigation = useNavigation<any>()

  // Fixed question count of 10
  const questionCount = 10

  useEffect(() => {
    // Only initialize quiz when countries data is loaded
    if (!isLoadingCountries && countriesData && !countriesError) {
      const initializeQuiz = async () => {
        try {
          await loadLearnedCountries()
          await loadNextQuestion()
          await loadHighScore()
          await initializeTts()
        } catch (error) {
          console.error('Error initializing quiz:', error)
        } finally {
          setIsInitializing(false)
        }
      }

      initializeQuiz()
    } else if (countriesError) {
      console.error('Error loading countries:', countriesError)
      setIsInitializing(false)
    }
  }, [isLoadingCountries, countriesData, countriesError])

  const loadLearnedCountries = async () => {
    try {
      // Load learned countries for current level
      const progress = await getRegionLevelProgress(selectedRegion, currentLevel)
      setLearnedCountryIds(progress.learnedCountries)
    } catch (error) {
      console.error('Error loading learned countries:', error)
      setLearnedCountryIds([])
    }
  }

  const handleTimeout = () => {
    setShowFeedback(true)
  }

  const restartGame = async () => {
    setScore(0)
    setCurrentQuestionNumber(1)
    setShowFeedback(false)
    setSelectedAnswer(null)
    setUsedFlags([])
    setCurrentLevel(1) // Reset to Easy level
    setQuestionsAnsweredAtLevel(0)
    await loadLearnedCountries()
    await loadNextQuestion()
  }

  const loadHighScore = async () => {
    const progress = await getQuizProgress(currentLevel)
    setHighScore(progress)
  }

  const handleSelectAnswer = async (answer: string) => {
    setSelectedAnswer(answer)
    await speakText(answer)
  }

  const checkLevelProgression = async () => {
    const nextLevel = await getNextQuizLevel(
      selectedRegion,
      currentLevel,
      questionsAnsweredAtLevel,
      3 // Minimum 3 questions per level
    )

    if (nextLevel !== currentLevel) {
      console.log(`Progressing from level ${currentLevel} to level ${nextLevel}`)
      setCurrentLevel(nextLevel)
      setQuestionsAnsweredAtLevel(0)

      // Reload learned countries for the new level
      const newLevelProgress = await getRegionLevelProgress(selectedRegion, nextLevel)
      setLearnedCountryIds(newLevelProgress.learnedCountries)

      // Clear used flags since we're moving to a new level
      setUsedFlags([])
    }
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
          await recordLearnedCountry(selectedRegion, currentLevel, countryId)
          // Update local learned countries list to prevent this country from appearing again
          setLearnedCountryIds(prev => [...prev, countryId])

          // Increment questions answered at current level
          setQuestionsAnsweredAtLevel(prev => prev + 1)
        } catch (error) {
          console.error('Error recording learned country:', error)
          // Don't break the quiz flow if progress tracking fails
        }
      }
    }
  }

  const loadNextQuestion = async () => {
    try {
      // Don't proceed if countries data isn't loaded yet
      if (!countriesData) {
        console.warn('Countries data not loaded yet, cannot generate question')
        return
      }

      setIsImageLoading(true)

      // Check if we should progress to next level before generating question
      await checkLevelProgression()

      const newQuestion = await generateQuizQuestion(
        currentLevel,
        selectedRegion,
        usedFlags,
        learnedCountryIds
      )
      setCurrentQuestion(newQuestion)
      setUsedFlags(prev => [...prev, newQuestion.id])
      setShowFeedback(false)
      setSelectedAnswer(null)
    } catch (error) {
      console.error('Error loading next question:', error)
      // If we can't generate more questions (all countries learned or used), end the quiz
      if (currentQuestionNumber > 1) {
        await saveQuizProgress(currentLevel, highScore)
        navigation.navigate('FlagRegionSelection')
      }
    }
  }

  const handleNextQuestion = async () => {
    if (currentQuestionNumber < questionCount) {
      setCurrentQuestionNumber(prev => prev + 1)
      await loadNextQuestion()
    } else {
      await saveQuizProgress(currentLevel, highScore)
      navigation.navigate('FlagRegionSelection')
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
    currentLevel, // Expose current level for UI
    isLoadingCountries, // Expose loading state
    isInitializing, // Expose initialization state
    countriesError, // Expose any errors
    handleSelectAnswer,
    handleSubmit,
    handleNextQuestion,
    restartGame,
    setIsImageLoading,
  }
}
