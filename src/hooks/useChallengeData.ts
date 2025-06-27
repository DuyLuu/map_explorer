import { useState, useEffect } from 'react'
import {
  getChallengeStats,
  getChallengeHistory,
  ChallengeStats,
  ChallengeScore
} from 'services/challengeScoringService'

export const useChallengeData = () => {
  const [stats, setStats] = useState<ChallengeStats | null>(null)
  const [history, setHistory] = useState<ChallengeScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [challengeStats, challengeHistory] = await Promise.all([
          getChallengeStats(),
          getChallengeHistory()
        ])
        setStats(challengeStats)
        setHistory(challengeHistory)
      } catch (error) {
        console.error('Error loading challenge data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { stats, history, loading }
}
