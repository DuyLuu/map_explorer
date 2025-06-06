import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { QuizQuestion } from '../../../types/quiz'
import {
  generateQuizQuestion,
  saveQuizProgress,
  getQuizProgress,
} from '../../../services/quizService'
import { useCountryStore } from '../../../stores/countryStore'
import { initializeTts, speakText } from '../../../services/speechService'
import { useCountries } from '../../../hooks/useCountries'
import {
  saveChallengeScore,
  getChallengeScore,
  ChallengeScore,
} from '../../../services/challengeScoringService'

type RootStackParamList = {
  ChallengeQuiz: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export const useChallengeQuiz = () => {
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
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [usedFlags, setUsedFlags] = useState<string[]>([])
  const [currentQuizType, setCurrentQuizType] = useState<'flag' | 'map'>('flag')
  const [isInitializing, setIsInitializing] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [questionsAtCurrentLevel, setQuestionsAtCurrentLevel] = useState(0)
  const [usedRegions, setUsedRegions] = useState<string[]>([])

  // Enhanced scoring tracking
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [scoreBreakdown, setScoreBreakdown] = useState({
    easyCorrect: 0,
    mediumCorrect: 0,
    hardCorrect: 0,
    flagQuestions: 0,
    mapQuestions: 0,
  })
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [finalChallengeScore, setFinalChallengeScore] = useState<ChallengeScore | null>(null)

  const navigation = useNavigation<NavigationProp>()

  // Challenge mode: 300 questions total
  const questionCount = 300

  useEffect(() => {
    // Only initialize quiz when countries data is loaded
    if (!isLoadingCountries && countriesData && !countriesError) {
      const initializeQuiz = async () => {
        try {
          await loadNextQuestion()
          await loadHighScore()
          await initializeTts()
        } catch (error) {
          console.error('Error initializing challenge quiz:', error)
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

  const loadHighScore = async () => {
    // Use new challenge scoring service
    const challengeScore = await getChallengeScore()
    setHighScore(challengeScore?.finalScore || 0)
  }

  const handleSelectAnswer = async (answer: string) => {
    setSelectedAnswer(answer)
    await speakText(answer)
  }

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return

    setShowFeedback(true)

    // Update question type counter
    if (currentQuizType === 'flag') {
      setScoreBreakdown(prev => ({ ...prev, flagQuestions: prev.flagQuestions + 1 }))
    } else {
      setScoreBreakdown(prev => ({ ...prev, mapQuestions: prev.mapQuestions + 1 }))
    }

    if (selectedAnswer === currentQuestion.correctAnswer) {
      const newScore = score + 1
      setScore(newScore)

      // Update level-specific counters
      if (currentLevel === 1) {
        setScoreBreakdown(prev => ({ ...prev, easyCorrect: prev.easyCorrect + 1 }))
      } else if (currentLevel === 2) {
        setScoreBreakdown(prev => ({ ...prev, mediumCorrect: prev.mediumCorrect + 1 }))
      } else if (currentLevel === 3) {
        setScoreBreakdown(prev => ({ ...prev, hardCorrect: prev.hardCorrect + 1 }))
      }

      if (newScore > highScore) {
        setHighScore(newScore)
      }
    } else {
      // Challenge mode: Game over on wrong answer
      await handleGameOver()
      return
    }
  }

  const handleGameOver = async () => {
    const timeSpent = Date.now() - startTime

    try {
      const result = await saveChallengeScore({
        score,
        totalQuestions: currentQuestionNumber,
        timeSpent,
        levelReached: currentLevel,
        breakdown: scoreBreakdown,
      })

      setIsNewRecord(result.isNewRecord)
      setFinalChallengeScore(result.challengeScore)

      console.log('Challenge completed:', {
        score,
        isNewRecord: result.isNewRecord,
        finalScore: result.challengeScore.finalScore,
        bonusPoints: result.challengeScore.bonusPoints,
      })
    } catch (error) {
      console.error('Error saving challenge score:', error)
    }

    setGameOver(true)
  }

  const getProgressiveLevel = (questionNumber: number): number => {
    // Progressive difficulty across 300 questions
    // Questions 1-100: Easy (Level 1)
    // Questions 101-200: Medium (Level 2)
    // Questions 201-300: Hard (Level 3)
    if (questionNumber <= 100) return 1
    if (questionNumber <= 200) return 2
    return 3
  }

  const getBalancedQuizType = (questionNumber: number): 'flag' | 'map' => {
    // Ensure roughly 50/50 distribution with some randomness
    // Use question number to create predictable but varied pattern
    const basePattern = questionNumber % 4 // Creates pattern: 0, 1, 2, 3, 0, 1, 2, 3...
    const randomFactor = Math.random() < 0.1 // 10% chance to break pattern for variety

    if (randomFactor) {
      return Math.random() < 0.5 ? 'flag' : 'map'
    }

    // Alternating pattern with slight bias towards flags on odd groups
    return basePattern === 0 || basePattern === 2 ? 'flag' : 'map'
  }

  const getSystematicRegion = (questionNumber: number): string => {
    const regions = ['europe', 'africa', 'asia', 'north_america', 'south_america', 'oceania']
    const regionIndex = (questionNumber - 1) % regions.length
    return regions[regionIndex]
  }

  const generateMixedQuestion = async (): Promise<QuizQuestion> => {
    const level = getProgressiveLevel(currentQuestionNumber)
    const quizType = getBalancedQuizType(currentQuestionNumber)
    const systematicRegion = getSystematicRegion(currentQuestionNumber)

    setCurrentQuizType(quizType)

    // Update level tracking
    if (level !== currentLevel) {
      setCurrentLevel(level)
      setQuestionsAtCurrentLevel(0)
      console.log(`Challenge progressing to level ${level} at question ${currentQuestionNumber}`)
    }
    setQuestionsAtCurrentLevel(prev => prev + 1)

    try {
      // Try systematic region first
      return await generateQuizQuestion(level, systematicRegion as any, usedFlags, [])
    } catch (error) {
      console.warn(`Failed to generate question for ${systematicRegion}, trying fallback`)
      try {
        // Fallback to selected region
        return await generateQuizQuestion(level, selectedRegion, usedFlags, [])
      } catch (fallbackError) {
        console.warn('Fallback to selected region failed, trying random available region')
        // Final fallback - try other regions
        const regions = ['europe', 'africa', 'asia', 'north_america', 'south_america', 'oceania']
        const unusedRegions = regions.filter(r => r !== systematicRegion && r !== selectedRegion)

        for (const region of unusedRegions) {
          try {
            return await generateQuizQuestion(level, region as any, usedFlags, [])
          } catch (regionError) {
            console.warn(`Failed to generate question for ${region}`)
            continue
          }
        }

        // If all regions fail, throw the original error
        throw error
      }
    }
  }

  const loadNextQuestion = async () => {
    try {
      if (!countriesData) {
        console.warn('Countries data not loaded yet, cannot generate question')
        return
      }

      const newQuestion = await generateMixedQuestion()
      setCurrentQuestion(newQuestion)
      setUsedFlags(prev => [...prev, newQuestion.id])
      setShowFeedback(false)
      setSelectedAnswer(null)
    } catch (error) {
      console.error('Error loading next question:', error)
      // If we can't generate more questions, end the quiz
      setGameOver(true)
      await saveQuizProgress(-1, score)
    }
  }

  const handleNextQuestion = async () => {
    if (gameOver) {
      navigation.goBack()
      return
    }

    if (currentQuestionNumber < questionCount) {
      setCurrentQuestionNumber(prev => prev + 1)
      await loadNextQuestion()
    } else {
      // Completed all 300 questions - perfect score!
      await handleGameOver()
    }
  }

  const restartChallenge = () => {
    setScore(0)
    setCurrentQuestionNumber(1)
    setShowFeedback(false)
    setSelectedAnswer(null)
    setUsedFlags([])
    setGameOver(false)
    setCurrentLevel(1)
    setQuestionsAtCurrentLevel(0)
    setUsedRegions([])
    setStartTime(Date.now())
    setScoreBreakdown({
      easyCorrect: 0,
      mediumCorrect: 0,
      hardCorrect: 0,
      flagQuestions: 0,
      mapQuestions: 0,
    })
    setIsNewRecord(false)
    setFinalChallengeScore(null)
    loadNextQuestion()
  }

  const exitChallenge = () => {
    // Reset game state before exiting to ensure modal dismisses properly
    setScore(0)
    setCurrentQuestionNumber(1)
    setShowFeedback(false)
    setSelectedAnswer(null)
    setUsedFlags([])
    setGameOver(false)
    setCurrentLevel(1)
    setQuestionsAtCurrentLevel(0)
    setUsedRegions([])
    setStartTime(Date.now())
    setScoreBreakdown({
      easyCorrect: 0,
      mediumCorrect: 0,
      hardCorrect: 0,
      flagQuestions: 0,
      mapQuestions: 0,
    })
    setIsNewRecord(false)
    setFinalChallengeScore(null)
    navigation.goBack()
  }

  return {
    currentQuestion,
    score,
    highScore,
    showFeedback,
    selectedAnswer,
    currentQuestionNumber,
    questionCount,
    currentQuizType,
    currentLevel,
    isLoadingCountries,
    isInitializing,
    countriesError,
    gameOver,
    isNewRecord,
    finalChallengeScore,
    scoreBreakdown,
    timeSpent: Date.now() - startTime,
    handleSelectAnswer,
    handleSubmit,
    handleNextQuestion,
    restartChallenge,
    exitChallenge,
  }
}
