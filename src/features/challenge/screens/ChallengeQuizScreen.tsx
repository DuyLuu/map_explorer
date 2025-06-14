import React from 'react'
import { StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native'
import { calculateChallengeScore, formatTime } from 'services/challengeScoringService'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'navigation/types'
import Text from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Theme } from 'theme/constants'

import MapQuizUI from '../components/MapQuizUI'
import FlagQuizUI from '../components/FlagQuizUI'
import NewRecordModal from '../components/NewRecordModal'
import ChallengeGameOverModal from '../components/ChallengeGameOverModal'
import { useChallengeQuiz } from '../hooks/useChallengeQuiz'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const ChallengeQuizScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()

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
    exitChallenge
  } = useChallengeQuiz()

  // Calculate current potential score with bonuses
  const getCurrentPotentialScore = () => {
    if (!scoreBreakdown) return score
    const { finalScore } = calculateChallengeScore(score, currentLevel, timeSpent, scoreBreakdown)
    return finalScore
  }

  // Show loading screen while countries are loading or quiz is initializing
  if (isLoadingCountries || isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex center padding="ml">
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text variant="body" weight="bold" center marginTop="m">
            {isLoadingCountries ? 'Loading countries...' : 'Initializing Challenge...'}
          </Text>
        </Box>
      </SafeAreaView>
    )
  }

  // Show error screen if there was an error loading countries
  if (countriesError) {
    return (
      <SafeAreaView style={styles.container}>
        <Box flex center padding="ml">
          <Text style={styles.errorText}>Error loading countries data</Text>
          <Text style={styles.errorSubtext}>
            Please check your internet connection and try again
          </Text>
        </Box>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Box padding="m" backgroundColor="white" style={styles.headerBorder}>
        <Box centerItems marginBottom="sm">
          <Text style={styles.challengeLabel}>🏆 CHALLENGE MODE</Text>
          <Text style={styles.challengeSubtext}>Zero tolerance - One mistake ends it all!</Text>
        </Box>
        <Button variant="outlined" onPress={exitChallenge} style={styles.exitButton}>
          Exit
        </Button>

        <Box row spaceBetween centerItems>
          <Box row spaceBetween centerItems fullWidth>
            <Box alignStart>
              <Text style={styles.score}>Score: {score}</Text>
              <Text style={styles.potentialScore}>
                +Bonus: {getCurrentPotentialScore() - score} = {getCurrentPotentialScore()}
              </Text>
            </Box>
            <Box alignEnd>
              <Text style={styles.highScore}>Best: {highScore}</Text>
              <Text style={styles.timeDisplay}>{formatTime(timeSpent)}</Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box paddingTop="m" centerItems backgroundColor="white" style={styles.progressBorder}>
        <Text style={styles.progressText}>
          Question {currentQuestionNumber} of {questionCount}
        </Text>
      </Box>

      {currentQuestion && (
        <Box flex padding="ml">
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
        </Box>
      )}

      {/* Game Over Modal - Only show if no new record */}
      <ChallengeGameOverModal
        visible={gameOver && !isNewRecord}
        score={score}
        questionsAnswered={currentQuestionNumber}
        finalChallengeScore={finalChallengeScore}
        onRestart={restartChallenge}
        onExit={exitChallenge}
      />

      {/* New Record Modal - Only show if new record */}
      {finalChallengeScore && (
        <NewRecordModal
          visible={gameOver && isNewRecord}
          challengeScore={finalChallengeScore}
          onClose={exitChallenge}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  exitButton: {
    position: 'absolute',
    top: 0,
    right: 12,
    borderWidth: 1,
    borderColor: Theme.colors.breakLine
  },
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  progressBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 8
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },
  challengeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35'
  },
  challengeSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  potentialScore: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2
  },
  highScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  timeDisplay: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  quizTypeText: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center'
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  }
})

export default ChallengeQuizScreen
