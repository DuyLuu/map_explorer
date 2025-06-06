import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { useChallengeQuiz } from '../hooks/useChallengeQuiz'
import ChallengeGameOverModal from '../components/ChallengeGameOverModal'
import NewRecordModal from '../components/NewRecordModal'
import FlagQuizUI from '../components/FlagQuizUI'
import MapQuizUI from '../components/MapQuizUI'
import { calculateChallengeScore, formatTime } from '../../../services/challengeScoringService'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../navigation/types'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const ChallengeQuizScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const [showNewRecordModal, setShowNewRecordModal] = useState(false)

  const {
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
    timeSpent,
    handleSelectAnswer,
    handleSubmit,
    handleNextQuestion,
    restartChallenge,
    exitChallenge,
  } = useChallengeQuiz()

  // Calculate current potential score with bonuses
  const getCurrentPotentialScore = () => {
    if (!scoreBreakdown) return score
    const { finalScore } = calculateChallengeScore(score, currentLevel, timeSpent, scoreBreakdown)
    return finalScore
  }

  // Handle game over with new record modal
  const handleGameOverModalClose = () => {
    if (isNewRecord && finalChallengeScore) {
      setShowNewRecordModal(true)
    }
  }

  const handleNewRecordModalClose = () => {
    setShowNewRecordModal(false)
  }

  const handleViewRecords = () => {
    setShowNewRecordModal(false)
    navigation.navigate('PersonalRecords')
  }

  // Show loading screen while countries are loading or quiz is initializing
  if (isLoadingCountries || isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>
            {isLoadingCountries ? 'Loading countries...' : 'Initializing Challenge...'}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  // Show error screen if there was an error loading countries
  if (countriesError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading countries data</Text>
          <Text style={styles.errorSubtext}>
            Please check your internet connection and try again
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const getLevelName = (level: number): string => {
    const levels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
    return levels[level as keyof typeof levels] || `Level ${level}`
  }

  const getLevelColor = (level: number): string => {
    const colors = { 1: '#4CAF50', 2: '#FF9800', 3: '#F44336' }
    return colors[level as keyof typeof colors] || '#666'
  }

  const getLevelProgress = (questionNumber: number): string => {
    if (questionNumber <= 100) return `Easy (${questionNumber}/100)`
    if (questionNumber <= 200) return `Medium (${questionNumber - 100}/100)`
    return `Hard (${questionNumber - 200}/100)`
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.challengeIndicator}>
          <Text style={styles.challengeLabel}>🏆 CHALLENGE MODE</Text>
          <Text style={styles.challengeSubtext}>Zero tolerance - One mistake ends it all!</Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreRow}>
            <View style={styles.currentScoreSection}>
              <Text style={styles.score}>Score: {score}</Text>
              <Text style={styles.potentialScore}>
                +Bonus: {getCurrentPotentialScore() - score} = {getCurrentPotentialScore()}
              </Text>
            </View>
            <View style={styles.bestScoreSection}>
              <Text style={styles.highScore}>Best: {highScore}</Text>
              <Text style={styles.timeDisplay}>{formatTime(timeSpent)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionNumber} of {questionCount}
        </Text>
        <View style={styles.levelIndicator}>
          <Text style={[styles.levelText, { color: getLevelColor(currentLevel) }]}>
            {getLevelProgress(currentQuestionNumber)}
          </Text>
        </View>
        <View style={styles.quizTypeIndicator}>
          <Text
            style={[
              styles.quizTypeText,
              { color: currentQuizType === 'flag' ? '#007AFF' : '#FF6B35' },
            ]}
          >
            {currentQuizType === 'flag' ? '🏳️ Flag Quiz' : '🗺️ Map Quiz'}
          </Text>
        </View>
      </View>

      {currentQuestion && (
        <View style={styles.questionContainer}>
          {currentQuizType === 'flag' ? (
            // Flag Quiz UI
            <FlagQuizUI
              currentQuestion={currentQuestion}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              onSelectAnswer={handleSelectAnswer}
              onSubmit={handleSubmit}
            />
          ) : (
            // Map Quiz UI
            <MapQuizUI
              currentQuestion={currentQuestion}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              onSelectAnswer={handleSelectAnswer}
              onSubmit={handleSubmit}
            />
          )}

          {/* Next Button */}
          {showFeedback && !gameOver && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
              <Text style={styles.nextButtonText}>
                {currentQuestionNumber < questionCount ? 'Next Question' : 'Finish Challenge'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Game Over Modal */}
      <ChallengeGameOverModal
        visible={gameOver && !showNewRecordModal}
        score={score}
        questionsAnswered={currentQuestionNumber}
        isNewRecord={isNewRecord}
        finalChallengeScore={finalChallengeScore}
        onRestart={restartChallenge}
        onExit={() => {
          handleGameOverModalClose()
          if (!isNewRecord) {
            exitChallenge()
          }
        }}
      />

      {/* New Record Celebration Modal */}
      {finalChallengeScore && (
        <NewRecordModal
          visible={showNewRecordModal}
          challengeScore={finalChallengeScore}
          onViewRecords={handleViewRecords}
          onClose={() => {
            handleNewRecordModalClose()
            exitChallenge()
          }}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  challengeIndicator: {
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  challengeSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  currentScoreSection: {
    alignItems: 'flex-start',
  },
  bestScoreSection: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  potentialScore: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  highScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  timeDisplay: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  levelIndicator: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  quizTypeIndicator: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quizTypeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
})

export default ChallengeQuizScreen
