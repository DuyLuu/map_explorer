import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCountries } from '../hooks/useCountries'
import {
  getChallengeStats,
  getChallengeHistory,
  formatTime,
  getScoreDescription,
  ChallengeStats,
  ChallengeScore,
} from '../services/challengeScoringService'

type RootStackParamList = {
  ChallengeQuiz: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const ChallengeTabScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { isLoading } = useCountries()
  const [stats, setStats] = useState<ChallengeStats | null>(null)
  const [history, setHistory] = useState<ChallengeScore[]>([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoadingStats(true)
      const [challengeStats, challengeHistory] = await Promise.all([
        getChallengeStats(),
        getChallengeHistory(),
      ])
      setStats(challengeStats)
      setHistory(challengeHistory)
    } catch (error) {
      console.error('Error loading challenge data:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const renderBestScore = () => {
    if (!stats?.bestScore) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No Records Yet</Text>
          <Text style={styles.emptySubtitle}>Complete a challenge to see your best score!</Text>
        </View>
      )
    }

    const bestScore = stats.bestScore
    return (
      <View style={styles.bestScoreCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🏆 Personal Best</Text>
          <Text style={styles.recordDate}>
            {new Date(bestScore.achievedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.scoreDisplayContainer}>
          <View style={styles.mainScoreDisplay}>
            <Text style={styles.finalScoreLabel}>Final Score</Text>
            <Text style={styles.finalScoreValue}>{bestScore.finalScore}</Text>
            <Text style={styles.scoreDescription}>{getScoreDescription(bestScore.score)}</Text>
          </View>

          <View style={styles.scoreBreakdown}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Base Score:</Text>
              <Text style={styles.breakdownValue}>{bestScore.score}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Bonus Points:</Text>
              <Text style={styles.breakdownValue}>+{bestScore.bonusPoints}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Time Spent:</Text>
              <Text style={styles.breakdownValue}>{formatTime(bestScore.timeSpent)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Level Reached:</Text>
              <Text style={styles.breakdownValue}>
                {bestScore.levelReached === 1
                  ? 'Easy'
                  : bestScore.levelReached === 2
                  ? 'Medium'
                  : 'Hard'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.performanceGrid}>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceValue}>{bestScore.breakdown.easyCorrect}</Text>
            <Text style={styles.performanceLabel}>Easy</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceValue}>{bestScore.breakdown.mediumCorrect}</Text>
            <Text style={styles.performanceLabel}>Medium</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceValue}>{bestScore.breakdown.hardCorrect}</Text>
            <Text style={styles.performanceLabel}>Hard</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceValue}>{bestScore.breakdown.flagQuestions}</Text>
            <Text style={styles.performanceLabel}>🏳️ Flags</Text>
          </View>
          <View style={styles.performanceItem}>
            <Text style={styles.performanceValue}>{bestScore.breakdown.mapQuestions}</Text>
            <Text style={styles.performanceLabel}>🗺️ Maps</Text>
          </View>
        </View>
      </View>
    )
  }

  const renderOverallStats = () => {
    if (!stats) return null

    return (
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>📊 Overall Statistics</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalAttempts}</Text>
            <Text style={styles.statLabel}>Total Attempts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.averageScore}</Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.bestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatTime(stats.totalTimeSpent)}</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
        </View>

        <View style={styles.completionStats}>
          <Text style={styles.completionTitle}>Level Completions</Text>
          <View style={styles.completionGrid}>
            <View style={styles.completionItem}>
              <Text style={styles.completionValue}>{stats.completionStats.completedEasy}</Text>
              <Text style={styles.completionLabel}>Easy Reached</Text>
            </View>
            <View style={styles.completionItem}>
              <Text style={styles.completionValue}>{stats.completionStats.completedMedium}</Text>
              <Text style={styles.completionLabel}>Medium Reached</Text>
            </View>
            <View style={styles.completionItem}>
              <Text style={styles.completionValue}>{stats.completionStats.completedHard}</Text>
              <Text style={styles.completionLabel}>Hard Reached</Text>
            </View>
            <View style={styles.completionItem}>
              <Text style={styles.completionValue}>{stats.completionStats.perfect300}</Text>
              <Text style={styles.completionLabel}>Perfect Scores</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  const renderRecentAttempts = () => {
    if (history.length === 0) {
      return (
        <View style={styles.historyCard}>
          <Text style={styles.cardTitle}>📈 Recent Attempts</Text>
          <Text style={styles.emptyText}>No attempts yet</Text>
        </View>
      )
    }

    return (
      <View style={styles.historyCard}>
        <Text style={styles.cardTitle}>📈 Recent Attempts</Text>
        {history.slice(0, 5).map((attempt, index) => (
          <View key={index} style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyScore}>{attempt.finalScore}</Text>
              <Text style={styles.historyDate}>
                {new Date(attempt.achievedAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.historyDetails}>
              <Text style={styles.historyDetail}>
                Base: {attempt.score} + Bonus: {attempt.bonusPoints}
              </Text>
              <Text style={styles.historyDetail}>
                Time: {formatTime(attempt.timeSpent)} • Level:{' '}
                {attempt.levelReached === 1
                  ? 'Easy'
                  : attempt.levelReached === 2
                  ? 'Medium'
                  : 'Hard'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    )
  }

  if (loadingStats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading challenge data...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Challenge Mode</Text>
          <Text style={styles.subtitle}>Test your ultimate geography knowledge!</Text>

          {/* Challenge Mode Button */}
          <TouchableOpacity
            style={[styles.button, styles.challengeButton]}
            onPress={() => navigation.navigate('ChallengeQuiz')}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonIcon}>🏆</Text>
                <Text style={styles.buttonText}>Ultimate Challenge</Text>
                <Text style={styles.buttonSubtext}>
                  300 questions across all regions and difficulties
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {renderBestScore()}
          {renderOverallStats()}
          {renderRecentAttempts()}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  button: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  challengeButton: {
    backgroundColor: '#FF6B35',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  // Best Score Card
  bestScoreCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  recordDate: {
    fontSize: 14,
    color: '#666',
  },
  scoreDisplayContainer: {
    marginBottom: 16,
  },
  mainScoreDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  finalScoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  finalScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  scoreBreakdown: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
  },
  performanceItem: {
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Empty State
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

  // Stats Card
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: '23%',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  completionStats: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  completionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  completionItem: {
    alignItems: 'center',
    minWidth: '23%',
  },
  completionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  completionLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },

  // History Card
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  historyDetails: {
    gap: 2,
  },
  historyDetail: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
})

export default ChallengeTabScreen
