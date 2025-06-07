import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Modal, Animated } from 'react-native'
import { Text } from '../../../components/Text'
import { Box } from '../../../components/Box'
import { Button } from '../../../components/Button'
import {
  ChallengeScore,
  formatTime,
  getScoreDescription,
} from '../../../services/challengeScoringService'

interface NewRecordModalProps {
  visible: boolean
  challengeScore: ChallengeScore
  onViewRecords: () => void
  onClose: () => void
}

const NewRecordModal: React.FC<NewRecordModalProps> = ({
  visible,
  challengeScore,
  onViewRecords,
  onClose,
}) => {
  const [celebrationAnim] = useState(new Animated.Value(0))
  const [scaleAnim] = useState(new Animated.Value(0))
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (visible) {
      // Reset animations
      celebrationAnim.setValue(0)
      scaleAnim.setValue(0)
      setShowDetails(false)

      // Start celebration animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Show details after animation
        setTimeout(() => setShowDetails(true), 300)
      })
    }
  }, [visible])

  const isPerfectScore = challengeScore.score === 300
  const reachedHard = challengeScore.levelReached >= 3
  const gotBigBonus = challengeScore.bonusPoints >= 50

  const celebrationEmojis = isPerfectScore
    ? ['🏆', '👑', '⭐', '🎉', '💎']
    : reachedHard
    ? ['🎉', '🔥', '⚡', '🏆', '🎊']
    : ['🎉', '✨', '🎊', '👏', '🌟']

  const getRecordTitle = () => {
    if (isPerfectScore) return 'PERFECT SCORE!'
    if (reachedHard) return 'INCREDIBLE NEW RECORD!'
    return 'NEW PERSONAL BEST!'
  }

  const getRecordSubtitle = () => {
    if (isPerfectScore) return 'You are a LEGEND!'
    if (reachedHard) return 'You reached the hardest level!'
    return "You've improved your best score!"
  }

  const rotateZ = celebrationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Box flex center backgroundColor="rgba(0, 0, 0, 0.9)" padding="ml">
        <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
          {/* Celebration Background */}
          <Box style={styles.celebrationContainer}>
            {celebrationEmojis.map((emoji, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.celebrationEmoji,
                  {
                    transform: [{ rotate: rotateZ }],
                    opacity: celebrationAnim,
                  },
                  {
                    left: `${20 + index * 15}%`,
                    top: `${10 + (index % 2) * 20}%`,
                  },
                ]}
              >
                {emoji}
              </Animated.Text>
            ))}
          </Box>

          {/* Header */}
          <Box centerItems marginBottom="ml">
            <Text style={[styles.title, ...(isPerfectScore ? [styles.perfectTitle] : [])]}>
              {getRecordTitle()}
            </Text>
            <Text style={styles.subtitle}>{getRecordSubtitle()}</Text>
          </Box>

          {/* Main Score Display */}
          <Box>
            <Box
              backgroundColor="#FF6B35"
              paddingVertical="sm"
              paddingHorizontal="m"
              borderRadius="lg"
              marginBottom="m"
              centerItems
            >
              <Text style={styles.newRecordText}>🆕 NEW PERSONAL RECORD 🆕</Text>
            </Box>

            <Box centerItems marginBottom="m">
              <Text style={styles.scoreLabel}>Final Score</Text>
              <Text
                style={[styles.scoreValue, ...(isPerfectScore ? [styles.perfectScoreValue] : [])]}
              >
                {challengeScore.finalScore}
              </Text>
              <Text style={styles.performanceText}>
                {getScoreDescription(challengeScore.score)}
              </Text>
            </Box>

            {/* Quick Stats */}
            <Box row spaceAround marginBottom="m">
              <Box centerItems>
                <Text style={styles.quickStatValue}>{challengeScore.score}</Text>
                <Text style={styles.quickStatLabel}>Questions</Text>
              </Box>
              <Box centerItems>
                <Text style={styles.quickStatValue}>+{challengeScore.bonusPoints}</Text>
                <Text style={styles.quickStatLabel}>Bonus</Text>
              </Box>
              <Box centerItems>
                <Text style={styles.quickStatValue}>{formatTime(challengeScore.timeSpent)}</Text>
                <Text style={styles.quickStatLabel}>Time</Text>
              </Box>
            </Box>

            {/* Achievement Highlights */}
            <Box marginBottom="m" style={{ gap: 8 }}>
              {isPerfectScore && (
                <Box
                  backgroundColor="#FFD700"
                  paddingVertical="xs"
                  paddingHorizontal="sm"
                  borderRadius="lg"
                  centerItems
                >
                  <Text style={styles.achievementText}>👑 PERFECT SCORE LEGEND</Text>
                </Box>
              )}
              {reachedHard && !isPerfectScore && (
                <Box
                  backgroundColor="#FF4444"
                  paddingVertical="xs"
                  paddingHorizontal="sm"
                  borderRadius="lg"
                  centerItems
                >
                  <Text style={styles.achievementText}>🔥 HARD LEVEL MASTER</Text>
                </Box>
              )}
              {gotBigBonus && (
                <Box
                  backgroundColor="#4CAF50"
                  paddingVertical="xs"
                  paddingHorizontal="sm"
                  borderRadius="lg"
                  centerItems
                >
                  <Text style={styles.achievementText}>⚡ BONUS POINT CHAMPION</Text>
                </Box>
              )}
              {challengeScore.breakdown.easyCorrect +
                challengeScore.breakdown.mediumCorrect +
                challengeScore.breakdown.hardCorrect >=
                100 && (
                <Box
                  backgroundColor="#9C27B0"
                  paddingVertical="xs"
                  paddingHorizontal="sm"
                  borderRadius="lg"
                  centerItems
                >
                  <Text style={styles.achievementText}>🎯 CENTURY SCORER</Text>
                </Box>
              )}
            </Box>

            {/* Detailed Breakdown (appears after delay) */}
            {showDetails && (
              <Animated.View
                style={[
                  styles.detailsSection,
                  {
                    opacity: celebrationAnim,
                    transform: [
                      {
                        translateY: celebrationAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.detailsTitle}>🏆 Record Breakdown</Text>
                <Box row spaceAround>
                  <Box centerItems>
                    <Text style={styles.breakdownValue}>
                      {challengeScore.breakdown.easyCorrect}
                    </Text>
                    <Text style={styles.breakdownLabel}>Easy</Text>
                  </Box>
                  <Box centerItems>
                    <Text style={styles.breakdownValue}>
                      {challengeScore.breakdown.mediumCorrect}
                    </Text>
                    <Text style={styles.breakdownLabel}>Medium</Text>
                  </Box>
                  <Box centerItems>
                    <Text style={styles.breakdownValue}>
                      {challengeScore.breakdown.hardCorrect}
                    </Text>
                    <Text style={styles.breakdownLabel}>Hard</Text>
                  </Box>
                </Box>
              </Animated.View>
            )}
          </Box>

          {/* Action Buttons */}
          <Box marginTop="m" style={{ gap: 12 }}>
            <Button
              style={[styles.button, styles.primaryButton]}
              onPress={onViewRecords}
              padding="m"
              borderRadius={12}
              backgroundColor="#FF6B35"
              fullWidth
            >
              <Text style={styles.buttonText}>🏆 View All Records</Text>
            </Button>

            <Button
              style={[styles.button, styles.secondaryButton]}
              onPress={onClose}
              padding="m"
              borderRadius={12}
              backgroundColor="#fff"
              fullWidth
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                {isPerfectScore ? 'Bask in Glory' : 'Continue'}
              </Text>
            </Button>
          </Box>
        </Animated.View>
      </Box>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    maxHeight: '90%',
    position: 'relative',
  },
  celebrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  celebrationEmoji: {
    fontSize: 24,
    position: 'absolute',
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 8,
  },
  perfectTitle: {
    color: '#FFD700',
    fontSize: 32,
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  newRecordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
    marginBottom: 8,
  },
  perfectScoreValue: {
    color: '#FFD700',
    textShadowColor: '#FFA500',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  performanceText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  achievementText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  detailsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  breakdownValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  button: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
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

export default NewRecordModal
