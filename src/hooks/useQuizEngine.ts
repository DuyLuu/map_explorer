import { useState, useEffect, useCallback } from 'react'
import {
  generateQuizQuestion,
  saveQuizProgress,
  getQuizProgress,
  recordLearnedCountry,
  getRegionLevelProgress,
  getNextQuizLevel
} from 'services/quizService'
import { useCountryStore } from 'stores/countryStore'

import { QuizQuestion } from '../types/quiz'

export const useQuizEngine = () => {
  const { selectedRegion } = useCountryStore()
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [usedFlags, setUsedFlags] = useState<string[]>([])
  const [learnedCountryIds, setLearnedCountryIds] = useState<number[]>([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [questionsAnsweredAtLevel, setQuestionsAnsweredAtLevel] = useState(0)
  const [isQuizFinished, setIsQuizFinished] = useState(false)

  const questionCount = 10

  const loadLearnedCountries = useCallback(async () => {
    try {
      const progress = await getRegionLevelProgress(selectedRegion, currentLevel)
      setLearnedCountryIds(progress.learnedCountries)
    } catch (error) {
      console.error('Error loading learned countries:', error)
      setLearnedCountryIds([])
    }
  }, [selectedRegion, currentLevel])

  const checkLevelProgression = useCallback(async () => {
    const nextLevel = await getNextQuizLevel(
      selectedRegion,
      currentLevel,
      questionsAnsweredAtLevel,
      3
    )

    if (nextLevel !== currentLevel) {
      setCurrentLevel(nextLevel)
      setQuestionsAnsweredAtLevel(0)
      const newLevelProgress = await getRegionLevelProgress(selectedRegion, nextLevel)
      setLearnedCountryIds(newLevelProgress.learnedCountries)
      setUsedFlags([])
    }
  }, [selectedRegion, currentLevel, questionsAnsweredAtLevel])

  const loadNextQuestion = useCallback(async () => {
    try {
      await checkLevelProgression()
      const newQuestion = await generateQuizQuestion(
        currentLevel,
        selectedRegion,
        usedFlags,
        learnedCountryIds
      )
      setCurrentQuestion(newQuestion)
      setUsedFlags(prev => [...prev, newQuestion.id])
    } catch (error) {
      console.error('Error loading next question:', error)
      setIsQuizFinished(true)
    }
  }, [checkLevelProgression, currentLevel, selectedRegion, usedFlags, learnedCountryIds])

  const recordAnswer = useCallback(
    async (isCorrect: boolean) => {
      if (isCorrect) {
        const newScore = score + 1
        setScore(newScore)
        if (newScore > highScore) {
          setHighScore(newScore)
        }
        if (currentQuestion?.id) {
          try {
            const countryId = parseInt(currentQuestion.id, 10)
            await recordLearnedCountry(selectedRegion, currentLevel, countryId)
            setLearnedCountryIds(prev => [...prev, countryId])
            setQuestionsAnsweredAtLevel(prev => prev + 1)
          } catch (error) {
            console.error('Error recording learned country:', error)
          }
        }
      }
    },
    [score, highScore, currentQuestion, selectedRegion, currentLevel]
  )

  const restartQuiz = useCallback(async () => {
    setScore(0)
    setUsedFlags([])
    setCurrentLevel(1)
    setQuestionsAnsweredAtLevel(0)
    setIsQuizFinished(false)
    await loadLearnedCountries()
    await loadNextQuestion()
  }, [loadLearnedCountries, loadNextQuestion])

  useEffect(() => {
    const initializeQuiz = async () => {
      await loadLearnedCountries()
      await loadNextQuestion()
      const progress = await getQuizProgress(currentLevel)
      setHighScore(progress)
    }
    initializeQuiz()
  }, [loadLearnedCountries, loadNextQuestion, currentLevel])

  useEffect(() => {
    if (isQuizFinished) {
      saveQuizProgress(currentLevel, highScore)
    }
  }, [isQuizFinished, currentLevel, highScore])

  return {
    currentQuestion,
    score,
    highScore,
    currentLevel,
    questionCount,
    isQuizFinished,
    loadNextQuestion,
    recordAnswer,
    restartQuiz
  }
}
