import React, { useRef, useEffect } from 'react'
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
      snapPoints={['60%', '75%']}
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
                <Text variant="h3" weight="bold" color="highlight" center>
                  🏆 PERFECT SCORE! 🏆
                </Text>
                <Text variant="h5" weight="bold" color="success" center marginTop="s">
                  LEGENDARY EXPLORER!
                </Text>
              </>
            ) : completedChallenge ? (
              <>
                <Text variant="h3" weight="bold" color="success" center>
                  🎉 Challenge Complete! 🎉
                </Text>
                <Text variant="body" color="subText" center marginTop="s">
                  Amazing endurance!
                </Text>
              </>
            ) : (
              <>
                <Text variant="h3" weight="bold" color="text" center>
                  Challenge Ended
                </Text>
                <Text variant="body" color="subText" center marginTop="s">
                  One wrong answer ends the challenge
                </Text>
              </>
            )}
          </Box>

          {/* Score Section */}
          <Box>
            <Box centerItems marginBottom="m">
              <Text variant="body" color="subText" center marginBottom="xs">
                Base Score
              </Text>
              <Text variant="h1" color="primary">
                {score}
              </Text>
              <Text variant="caption" color="subText" center marginTop="s">
                Questions Answered: {questionsAnswered} / {CHALLENGE_QUESTIONS}
              </Text>
            </Box>

            {finalChallengeScore && (
              <>
                {/* Bonus Points */}
                {finalChallengeScore.bonusPoints > 0 && (
                  <Box marginBottom="m">
                    <Text variant="h5" weight="bold" color="success" center marginBottom="s">
                      Bonus Points
                    </Text>
                    <Text variant="h2" weight="bold" color="success" center>
                      +{finalChallengeScore.bonusPoints}
                    </Text>
                    <Box marginTop="xs">
                      {finalChallengeScore.breakdown.mediumCorrect > 0 && (
                        <Text variant="body" color="success" center marginVertical="xxs">
                          Medium Level: +
                          {Math.floor(finalChallengeScore.breakdown.mediumCorrect * 0.5)}
                        </Text>
                      )}
                      {finalChallengeScore.breakdown.hardCorrect > 0 && (
                        <Text variant="body" color="success" center marginVertical="xxs">
                          Hard Level: +{finalChallengeScore.breakdown.hardCorrect}
                        </Text>
                      )}
                      {finalChallengeScore.levelReached >= 2 && (
                        <Text variant="body" color="success" center marginVertical="xxs">
                          Level Progression: +10
                        </Text>
                      )}
                      {finalChallengeScore.levelReached >= 3 && (
                        <Text variant="body" color="success" center marginVertical="xxs">
                          Hard Level Reached: +20
                        </Text>
                      )}
                      {score === CHALLENGE_QUESTIONS && (
                        <Text variant="body" color="success" center marginVertical="xxs">
                          Perfect Score: +50
                        </Text>
                      )}
                    </Box>
                  </Box>
                )}

                {/* Final Score */}
                <Box centerItems marginBottom="m">
                  <Text variant="h4" weight="bold" color="text" center marginBottom="s">
                    Final Score
                  </Text>
                  <Text variant="displaySmall" color="primary" center>
                    {finalChallengeScore.finalScore}
                  </Text>
                  <Text variant="body" color="subText" center marginTop="s">
                    {getScoreDescription(score)}
                  </Text>
                </Box>
              </>
            )}
          </Box>

          {/* Buttons */}
          <Box marginTop="m">
            <Button
              onPress={onRestart}
              fullWidth
              backgroundColor="primary"
              borderRadius="md"
              padding="m"
              marginBottom="s"
            >
              <Text variant="button" weight="bold" color="white">
                {isPerfectScore ? 'Can You Do It Again?' : 'Try Again'}
              </Text>
            </Button>

            <Button
              onPress={onExit}
              fullWidth
              variant="outlined"
              borderRadius="md"
              padding="m"
              borderColor="breakLine"
            >
              <Text variant="button" weight="bold" color="text">
                Exit Challenge
              </Text>
            </Button>
          </Box>
        </Box>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

export default ChallengeGameOverModal
