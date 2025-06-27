import React from 'react'
import { SafeAreaView, ActivityIndicator } from 'react-native'
import { calculateChallengeScore, formatTime } from 'services/challengeScoringService'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from 'navigation/types'
import Text from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'

import { useTheme } from '../../../theme'
import MapQuizUI from '../components/MapQuizUI'
import FlagQuizUI from '../components/FlagQuizUI'
import NewRecordModal from '../components/NewRecordModal'
import ChallengeGameOverModal from '../components/ChallengeGameOverModal'
import { useChallengeQuiz } from '../hooks/useChallengeQuiz'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const ChallengeQuizScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const { theme } = useTheme()

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
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Box flex center padding="ml">
          <ActivityIndicator size="large" color={theme.colors.primary} />
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
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Box flex center padding="ml">
          <Text variant="body" weight="bold" center marginTop="m" color="subText">
            Error loading countries data
          </Text>
          <Text variant="body" center marginTop="s" color="subText">
            Please check your internet connection and try again
          </Text>
        </Box>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Box padding="m" backgroundColor="background" borderColor="breakLine">
        <Box centerItems marginBottom="sm">
          <Text variant="h4" weight="bold" color="highlight">
            🏆 CHALLENGE MODE
          </Text>
          <Text variant="bodySmall" color="subText" marginTop="xxs">
            Zero tolerance - One mistake ends it all!
          </Text>
        </Box>
        <Button variant="outlined" onPress={exitChallenge} absolute right="m" top="m">
          Exit
        </Button>

        <Box row spaceBetween centerItems>
          <Box row spaceBetween centerItems fullWidth>
            <Box alignStart>
              <Text variant="h5" weight="bold" color="text">
                Score: {score}
              </Text>
              <Text variant="bodySmall" color="success">
                +Bonus: {getCurrentPotentialScore() - score} = {getCurrentPotentialScore()}
              </Text>
            </Box>
            <Box alignEnd>
              <Text variant="h5" weight="bold" color="success">
                Best: {highScore}
              </Text>
              <Text variant="bodySmall" color="subText">
                {formatTime(timeSpent)}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box paddingTop="m" centerItems backgroundColor="background" borderColor="breakLine">
        <Text variant="h5" weight="bold" color="text">
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
            <Button
              onPress={handleNextQuestion}
              fullWidth
              marginTop="m"
              backgroundColor="success"
              borderRadius="md"
              padding="m"
            >
              <Text variant="button" weight="bold" color="white">
                {currentQuestionNumber < questionCount ? 'Next Question' : 'Finish Challenge'}
              </Text>
            </Button>
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

export default ChallengeQuizScreen
