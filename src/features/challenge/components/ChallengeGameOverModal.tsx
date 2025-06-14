import React, { useRef, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import GorhomBottomSheet from '@gorhom/bottom-sheet'
import { ChallengeScore, getScoreDescription } from 'services/challengeScoringService'

import { BottomSheet, BottomSheetScrollView } from '../../../components'
import { CHALLENGE_QUESTIONS } from '../constants'

interface ChallengeGameOverModalProps {
  visible: boolean
  score: number
  questionsAnswered: number
  finalChallengeScore: ChallengeScore | null
  onRestart: () => void
  onExit: () => void
}

const ChallengeGameOverModal: React.FC<ChallengeGameOverModalProps> = ({
  visible,
  score,
  questionsAnswered,
  finalChallengeScore,
  onRestart,
  onExit
}) => {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null)
  const isPerfectScore = score === CHALLENGE_QUESTIONS
  const completedChallenge = questionsAnswered === CHALLENGE_QUESTIONS

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [visible])

  const handleSheetClose = () => {
    onExit()
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['80%', '95%']}
      index={-1}
      enableBackdrop
      backdropOpacity={0.6}
      enablePanDownToClose={false}
      onClose={handleSheetClose}
    >
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <Box padding="xl">
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

          {/* Score Section */}
          <Box>
            <Box centerItems marginBottom="m">
              <Text style={styles.scoreLabel}>Base Score</Text>
              <Text style={styles.scoreValue}>{score}</Text>
              <Text style={styles.questionsLabel}>
                Questions Answered: {questionsAnswered} / {CHALLENGE_QUESTIONS}
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
                      {score === CHALLENGE_QUESTIONS && (
                        <Text style={styles.bonusItem}>Perfect Score: +50</Text>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Final Score */}
                <Box centerItems marginBottom="m">
                  <Text style={styles.finalScoreLabel}>Final Score</Text>
                  <Text style={styles.finalScoreValue}>{finalChallengeScore.finalScore}</Text>
                  <Text style={styles.performanceText}>{getScoreDescription(score)}</Text>
                </Box>
              </>
            )}
          </Box>

          {/* Buttons */}
          <Box marginTop="m">
            <Button style={[styles.button, styles.primaryButton]} onPress={onRestart}>
              <Text style={styles.buttonText}>
                {isPerfectScore ? 'Can You Do It Again?' : 'Try Again'}
              </Text>
            </Button>

            <Button style={[styles.button, styles.secondaryButton]} onPress={onExit}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Exit Challenge</Text>
            </Button>
          </Box>
        </Box>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8
  },
  perfectTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  perfectSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 8
  },
  completeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center'
  },
  completeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8
  },
  newRecordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  questionsLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8
  },
  bonusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8
  },
  bonusValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center'
  },
  bonusItem: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginVertical: 2
  },
  finalScoreLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8
  },
  finalScoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center'
  },
  performanceText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic'
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16
  },
  statItem: {
    alignItems: 'center',
    minWidth: 80
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center'
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#FF6B35'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ddd'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
  secondaryButtonText: {
    color: '#666'
  }
})

export default ChallengeGameOverModal
