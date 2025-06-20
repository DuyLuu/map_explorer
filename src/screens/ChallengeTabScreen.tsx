import React, { useEffect, useState } from 'react'
import { StyleSheet, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useCountries } from 'hooks/useCountries'
import {
  getChallengeStats,
  getChallengeHistory,
  formatTime,
  getScoreDescription,
  ChallengeStats,
  ChallengeScore
} from 'services/challengeScoringService'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Theme } from 'theme/constants'

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
        getChallengeHistory()
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
        <Box style={styles.emptyCard}>
          <Text variant="body" weight="bold" center marginTop="m">
            No Records Yet
          </Text>
          <Text variant="body" center marginTop="m">
            Complete a challenge to see your best score!
          </Text>
        </Box>
      )
    }

    const bestScore = stats.bestScore
    return (
      <Box style={styles.bestScoreCard}>
        <Box style={styles.cardHeader}>
          <Text variant="body" weight="bold" center marginTop="m">
            🏆 Personal Best
          </Text>
          <Text variant="body" center marginTop="m">
            {new Date(bestScore.achievedAt).toLocaleDateString()}
          </Text>
        </Box>

        <Box style={styles.scoreDisplayContainer}>
          <Box style={styles.mainScoreDisplay}>
            <Text variant="body" weight="bold" center marginTop="m">
              Final Score
            </Text>
            <Text variant="h1" weight="bold" center marginTop="m" primary>
              {bestScore.finalScore}
            </Text>
            <Text variant="body" weight="bold" center marginTop="m">
              {getScoreDescription(bestScore.score)}
            </Text>
          </Box>

          <Box style={styles.scoreBreakdown}>
            <Box style={styles.breakdownRow}>
              <Text variant="body" weight="bold" center marginTop="m">
                Base Score:
              </Text>
              <Text variant="body" weight="bold" center marginTop="m">
                {bestScore.score}
              </Text>
            </Box>

            <Box style={styles.breakdownRow}>
              <Text variant="body" weight="bold" center marginTop="m">
                Time Spent:
              </Text>
              <Text variant="body" weight="bold" center marginTop="m">
                {formatTime(bestScore.timeSpent)}
              </Text>
            </Box>
            {history.length > 1 && (
              <Box style={styles.breakdownRow}>
                <Text variant="body" weight="bold" center marginTop="m">
                  Previous Record:
                </Text>

                <Text variant="body" weight="bold" center marginTop="m">
                  {history[history.length - 1].finalScore}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    )
  }

  if (loadingStats) {
    return (
      <SafeAreaView style={styles.container}>
        <Box style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text variant="body" weight="bold" center marginTop="m">
            Loading challenge data...
          </Text>
        </Box>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Box style={styles.header}>
          {/* Challenge Mode Button */}
          <Button
            style={[styles.button]}
            onPress={() => navigation.navigate('ChallengeQuiz')}
            disabled={isLoading}
            fullWidth
            shadow="default"
            backgroundColor={Theme.colors.blue}
          >
            <Box>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text variant="h1" weight="bold" center marginTop="m">
                    🏆
                  </Text>
                  <Text variant="h2" weight="bold" center marginTop="m" primary>
                    Challenge Mode
                  </Text>
                  <Text variant="body" center marginTop="m">
                    Ultimate questions across all regions and difficulties
                  </Text>
                </>
              )}
            </Box>
          </Button>
        </Box>

        <Box style={styles.content}>{renderBestScore()}</Box>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollContainer: {
    flex: 1
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center'
  },
  content: {
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16
  },
  button: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5
  },

  buttonIcon: {
    fontSize: 24,
    marginBottom: 8
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  buttonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center'
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
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  recordDate: {
    fontSize: 14,
    color: '#666'
  },
  scoreDisplayContainer: {
    marginBottom: 16
  },
  mainScoreDisplay: {
    alignItems: 'center',
    marginBottom: 16
  },
  finalScoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4
  },
  finalScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8
  },
  scoreDescription: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  scoreBreakdown: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666'
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16
  },
  performanceItem: {
    alignItems: 'center'
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
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
    elevation: 3
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center'
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
    elevation: 3
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap'
  },
  statItem: {
    alignItems: 'center',
    minWidth: '23%',
    marginBottom: 12
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  completionStats: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center'
  },
  completionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },
  completionItem: {
    alignItems: 'center',
    minWidth: '23%'
  },
  completionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4
  },
  completionLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center'
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
    elevation: 3
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  historyScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  historyDate: {
    fontSize: 12,
    color: '#666'
  },
  historyDetails: {
    gap: 2
  },
  historyDetail: {
    fontSize: 12,
    color: '#666'
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 16
  }
})

export default ChallengeTabScreen
