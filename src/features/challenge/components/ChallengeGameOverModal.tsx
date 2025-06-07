import React from 'react'
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native'
import { Text } from '../../../components/Text'
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
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
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
            </View>

            {/* New Record Banner */}
            {isNewRecord && (
              <View style={styles.newRecordBanner}>
                <Text style={styles.newRecordText}>🆕 NEW PERSONAL RECORD! 🆕</Text>
              </View>
            )}

            {/* Score Section */}
            <View style={styles.scoreSection}>
              <View style={styles.mainScore}>
                <Text style={styles.scoreLabel}>Base Score</Text>
                <Text style={styles.scoreValue}>{score}</Text>
                <Text style={styles.questionsLabel}>
                  Questions Answered: {questionsAnswered} / 300
                </Text>
              </View>

              {finalChallengeScore && (
                <>
                  {/* Bonus Points */}
                  {finalChallengeScore.bonusPoints > 0 && (
                    <View style={styles.bonusSection}>
                      <Text style={styles.bonusLabel}>Bonus Points</Text>
                      <Text style={styles.bonusValue}>+{finalChallengeScore.bonusPoints}</Text>
                      <View style={styles.bonusBreakdown}>
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
                      </View>
                    </View>
                  )}

                  {/* Final Score */}
                  <View style={styles.finalScoreSection}>
                    <Text style={styles.finalScoreLabel}>Final Score</Text>
                    <Text style={styles.finalScoreValue}>{finalChallengeScore.finalScore}</Text>
                    <Text style={styles.performanceText}>{getScoreDescription(score)}</Text>
                  </View>

                  {/* Stats Breakdown */}
                  <View style={styles.statsSection}>
                    <Text style={styles.statsTitle}>Performance Breakdown</Text>
                    <View style={styles.statsGrid}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {finalChallengeScore.breakdown.easyCorrect}
                        </Text>
                        <Text style={styles.statLabel}>Easy</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {finalChallengeScore.breakdown.mediumCorrect}
                        </Text>
                        <Text style={styles.statLabel}>Medium</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {finalChallengeScore.breakdown.hardCorrect}
                        </Text>
                        <Text style={styles.statLabel}>Hard</Text>
                      </View>
                    </View>
                    <View style={styles.statsGrid}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {finalChallengeScore.breakdown.flagQuestions}
                        </Text>
                        <Text style={styles.statLabel}>🏳️ Flags</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {finalChallengeScore.breakdown.mapQuestions}
                        </Text>
                        <Text style={styles.statLabel}>🗺️ Maps</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                          {formatTime(finalChallengeScore.timeSpent)}
                        </Text>
                        <Text style={styles.statLabel}>Time</Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onRestart}>
                <Text style={styles.buttonText}>
                  {isPerfectScore ? 'Can You Do It Again?' : 'Try Again'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onExit}>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Exit Challenge</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    maxHeight: '90%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  perfectTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    textAlign: 'center',
  },
  perfectSubtitle: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#4CAF50',
    textAlign: 'center',
  },
  newRecordBanner: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  newRecordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreSection: {
    marginBottom: 24,
  },
  mainScore: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  questionsLabel: {
    fontSize: 14,
    color: '#888',
  },
  bonusSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  bonusLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  bonusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  bonusBreakdown: {
    alignItems: 'center',
  },
  bonusItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  finalScoreSection: {
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  finalScoreLabel: {
    fontSize: 16,
    color: '#1976d2',
    marginBottom: 4,
  },
  finalScoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  performanceText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  statsSection: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
})

export default ChallengeGameOverModal
