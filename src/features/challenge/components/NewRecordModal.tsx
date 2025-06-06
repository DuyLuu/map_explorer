import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native'
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
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
          {/* Celebration Background */}
          <View style={styles.celebrationBackground}>
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
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, isPerfectScore && styles.perfectTitle]}>
              {getRecordTitle()}
            </Text>
            <Text style={styles.subtitle}>{getRecordSubtitle()}</Text>
          </View>

          {/* Main Score Display */}
          <View style={styles.scoreSection}>
            <View style={styles.newRecordBanner}>
              <Text style={styles.newRecordText}>🆕 NEW PERSONAL RECORD 🆕</Text>
            </View>

            <View style={styles.mainScoreDisplay}>
              <Text style={styles.scoreLabel}>Final Score</Text>
              <Text style={[styles.scoreValue, isPerfectScore && styles.perfectScoreValue]}>
                {challengeScore.finalScore}
              </Text>
              <Text style={styles.performanceText}>
                {getScoreDescription(challengeScore.score)}
              </Text>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>{challengeScore.score}</Text>
                <Text style={styles.quickStatLabel}>Questions</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>+{challengeScore.bonusPoints}</Text>
                <Text style={styles.quickStatLabel}>Bonus</Text>
              </View>
              <View style={styles.quickStatItem}>
                <Text style={styles.quickStatValue}>{formatTime(challengeScore.timeSpent)}</Text>
                <Text style={styles.quickStatLabel}>Time</Text>
              </View>
            </View>

            {/* Achievement Highlights */}
            <View style={styles.achievements}>
              {isPerfectScore && (
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementText}>👑 PERFECT SCORE LEGEND</Text>
                </View>
              )}
              {reachedHard && !isPerfectScore && (
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementText}>🔥 HARD LEVEL MASTER</Text>
                </View>
              )}
              {gotBigBonus && (
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementText}>⚡ BONUS POINT CHAMPION</Text>
                </View>
              )}
              {challengeScore.breakdown.easyCorrect +
                challengeScore.breakdown.mediumCorrect +
                challengeScore.breakdown.hardCorrect >=
                100 && (
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementText}>🎯 CENTURY SCORER</Text>
                </View>
              )}
            </View>

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
                <View style={styles.breakdownGrid}>
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownValue}>
                      {challengeScore.breakdown.easyCorrect}
                    </Text>
                    <Text style={styles.breakdownLabel}>Easy</Text>
                  </View>
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownValue}>
                      {challengeScore.breakdown.mediumCorrect}
                    </Text>
                    <Text style={styles.breakdownLabel}>Medium</Text>
                  </View>
                  <View style={styles.breakdownItem}>
                    <Text style={styles.breakdownValue}>
                      {challengeScore.breakdown.hardCorrect}
                    </Text>
                    <Text style={styles.breakdownLabel}>Hard</Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onViewRecords}>
              <Text style={styles.buttonText}>🏆 View All Records</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    maxHeight: '90%',
    position: 'relative',
    overflow: 'hidden',
  },
  celebrationBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  celebrationEmoji: {
    position: 'absolute',
    fontSize: 24,
    opacity: 0.7,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
    textAlign: 'center',
  },
  perfectTitle: {
    color: '#FFD700',
    fontSize: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 10,
  },
  newRecordBanner: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
    transform: [{ rotate: '-2deg' }],
  },
  newRecordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  mainScoreDisplay: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  perfectScoreValue: {
    color: '#FFD700',
  },
  performanceText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  achievements: {
    width: '100%',
    marginBottom: 16,
  },
  achievementBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  achievementText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsSection: {
    width: '100%',
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    padding: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  breakdownGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    zIndex: 10,
  },
  button: {
    padding: 16,
    borderRadius: 16,
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

export default NewRecordModal
