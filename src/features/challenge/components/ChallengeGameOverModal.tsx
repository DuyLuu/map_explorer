import React from 'react'
import { StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { Text } from '../../../components/Text'
import { Box } from '../../../components/Box'
import {
  ChallengeScore,
  formatTime,
  getScoreDescription,
} from '../../../services/challengeScoringService'

interface ChallengeGameOverModalProps {
  visible: boolean
  score: number
  questionsAnswered: number
  isNewRecord: boolean
  finalChallengeScore: ChallengeScore | null
  onRestart: () => void
  onExit: () => void
}

const ChallengeGameOverModal: React.FC<ChallengeGameOverModalProps> = ({
  visible,
  score,
  questionsAnswered,
  isNewRecord,
  finalChallengeScore,
  onRestart,
  onExit,
}) => {
  const isPerfectScore = score === 300
  const completedChallenge = questionsAnswered === 300

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Box flex center backgroundColor="rgba(0, 0, 0, 0.85)" padding="ml">
        <Box
          backgroundColor="white"
          borderRadius="xl"
          padding="xl"
          fullWidth
          style={styles.modalConstraints}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Box centerItems marginBottom="ml">
              {isPerfectScore ? (
                <>
                  <Text style={styles.perfectTitle}>🏆 PERFECT SCORE! 🏆</Text>
                  <Text style={styles.perfectSubtitle}>LEGENDARY EXPLORER!</Text>
                </>
              ) : completedChallenge ? (
                <>
                  <Text style={styles.completeTitle}>🎉 Challenge Complete! 🎉</Text>
                  <Text style={styles.completeSubtitle}>Amazing endurance!</Text>
                </>
              ) : (
                <>
                  <Text style={styles.title}>Challenge Ended</Text>
                  <Text style={styles.subtitle}>One wrong answer ends the challenge</Text>
                </>
              )}
            </Box>

            {/* New Record Banner */}
            {isNewRecord && (
              <Box
                backgroundColor="#4CAF50"
                paddingVertical="sm"
                paddingHorizontal="m"
                borderRadius="lg"
                marginBottom="m"
                centerItems
              >
                <Text style={styles.newRecordText}>🆕 NEW PERSONAL RECORD! 🆕</Text>
              </Box>
            )}

            {/* Score Section */}
            <Box>
              <Box centerItems marginBottom="m">
                <Text style={styles.scoreLabel}>Base Score</Text>
                <Text style={styles.scoreValue}>{score}</Text>
                <Text style={styles.questionsLabel}>
                  Questions Answered: {questionsAnswered} / 300
                </Text>
              </Box>

              {finalChallengeScore && (
                <>
                  {/* Bonus Points */}
                  {finalChallengeScore.bonusPoints > 0 && (
                    <Box marginBottom="m">
                      <Text style={styles.bonusLabel}>Bonus Points</Text>
                      <Text style={styles.bonusValue}>+{finalChallengeScore.bonusPoints}</Text>
                      <Box marginTop="xs">
                        {finalChallengeScore.breakdown.mediumCorrect > 0 && (
                          <Text style={styles.bonusItem}>
                            Medium Level: +
                            {Math.floor(finalChallengeScore.breakdown.mediumCorrect * 0.5)}
                          </Text>
                        )}
                        {finalChallengeScore.breakdown.hardCorrect > 0 && (
                          <Text style={styles.bonusItem}>
                            Hard Level: +{finalChallengeScore.breakdown.hardCorrect}
                          </Text>
                        )}
                        {finalChallengeScore.levelReached >= 2 && (
                          <Text style={styles.bonusItem}>Level Progression: +10</Text>
                        )}
                        {finalChallengeScore.levelReached >= 3 && (
                          <Text style={styles.bonusItem}>Hard Level Reached: +20</Text>
                        )}
                        {score === 300 && <Text style={styles.bonusItem}>Perfect Score: +50</Text>}
                      </Box>
                    </Box>
                  )}

                  {/* Final Score */}
                  <Box centerItems marginBottom="m">
                    <Text style={styles.finalScoreLabel}>Final Score</Text>
                    <Text style={styles.finalScoreValue}>{finalChallengeScore.finalScore}</Text>
                    <Text style={styles.performanceText}>{getScoreDescription(score)}</Text>
                  </Box>

                  {/* Stats Breakdown */}
                  <Box marginBottom="m">
                    <Text style={styles.statsTitle}>Performance Breakdown</Text>
                    <Box row spaceAround marginBottom="xs">
                      <Box centerItems>
                        <Text style={styles.statValue}>
                          {finalChallengeScore.breakdown.easyCorrect}
                        </Text>
                        <Text style={styles.statLabel}>Easy</Text>
                      </Box>
                      <Box centerItems>
                        <Text style={styles.statValue}>
                          {finalChallengeScore.breakdown.mediumCorrect}
                        </Text>
                        <Text style={styles.statLabel}>Medium</Text>
                      </Box>
                      <Box centerItems>
                        <Text style={styles.statValue}>
                          {finalChallengeScore.breakdown.hardCorrect}
                        </Text>
                        <Text style={styles.statLabel}>Hard</Text>
                      </Box>
                    </Box>
                    <Box row spaceAround>
                      <Box centerItems>
                        <Text style={styles.statValue}>
                          {finalChallengeScore.breakdown.flagQuestions}
                        </Text>
                        <Text style={styles.statLabel}>🏳️ Flags</Text>
                      </Box>
                      <Box centerItems>
                        <Text style={styles.statValue}>
                          {finalChallengeScore.breakdown.mapQuestions}
                        </Text>
                        <Text style={styles.statLabel}>🗺️ Maps</Text>
                      </Box>
                      <Box centerItems>
                        <Text style={styles.statValue}>
                          {formatTime(finalChallengeScore.timeSpent)}
                        </Text>
                        <Text style={styles.statLabel}>Time</Text>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            {/* Buttons */}
            <Box marginTop="m">
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onRestart}>
                <Text style={styles.buttonText}>
                  {isPerfectScore ? 'Can You Do It Again?' : 'Try Again'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onExit}>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Exit Challenge</Text>
              </TouchableOpacity>
            </Box>
          </ScrollView>
        </Box>
      </Box>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalConstraints: {
    maxWidth: 380,
    maxHeight: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  perfectTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  perfectSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 8,
  },
  completeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  newRecordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  questionsLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  bonusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  bonusValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  bonusItem: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 2,
  },
  finalScoreLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  finalScoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
  },
  performanceText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FF6B35',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#666',
  },
})

export default ChallengeGameOverModal
