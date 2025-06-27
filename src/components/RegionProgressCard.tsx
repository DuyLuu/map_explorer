import React, { useEffect, useState } from 'react'
import { getRegionLevelProgress } from 'services/quizService'

import { useTheme } from '../theme'
import { Region, REGION_INFO } from '../types/region'
import { RegionLevelProgress } from '../types/progress'

import ProgressRing from './ProgressRing'
import ProgressBar from './ProgressBar'
import { Text } from './Text'
import { Box } from './Box'
import { Button } from './Button'

interface RegionProgressCardProps {
  region: Region
  level: number
  onPress?: () => void
  showDetailedStats?: boolean
  size?: 'small' | 'medium' | 'large'
}

const RegionProgressCard: React.FC<RegionProgressCardProps> = ({
  region,
  level,
  onPress,
  showDetailedStats = true,
  size = 'medium'
}) => {
  const { theme } = useTheme()
  const [progress, setProgress] = useState<RegionLevelProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProgress = async () => {
    try {
      setIsLoading(true)
      const progressData = await getRegionLevelProgress(region, level)
      setProgress(progressData)
    } catch (error) {
      console.error('Error loading progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProgress()
  }, [region, level, loadProgress])

  const getDifficultyName = (level: number): string => {
    const levels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
    return levels[level as keyof typeof levels] || `Level ${level}`
  }

  const getDifficultyColor = (level: number): string => {
    switch (level) {
      case 1:
        return theme.colors.success // Green for Easy
      case 2:
        return theme.colors.warning // Orange for Medium
      case 3:
        return theme.colors.danger // Red for Hard
      default:
        return theme.colors.gray // Default color
    }
  }

  const getCardSize = () => {
    switch (size) {
      case 'small':
        return { padding: 's' as const, progressSize: 60 }
      case 'large':
        return { padding: 'l' as const, progressSize: 80 }
      default:
        return { padding: 'm' as const, progressSize: 70 }
    }
  }

  const cardSize = getCardSize()
  const regionInfo = REGION_INFO[region]
  const percentage = progress?.completionPercentage || 0
  const learnedCount = progress?.learnedCountries.length || 0
  const totalCount = progress?.totalCountries || 0

  const CardContent = () => (
    <Box
      backgroundColor="parchment"
      borderRadius="lg"
      shadow="light"
      marginBottom="sm"
      padding={cardSize.padding}
    >
      <Box row spaceBetween centerItems marginBottom="m">
        <Box flex>
          <Text variant="h6" weight="bold" marginBottom="xs" color="text">
            {regionInfo.displayName}
          </Text>
          <Text variant="bodySmall" weight="semi-bold" color={getDifficultyColor(level)}>
            {getDifficultyName(level)}
          </Text>
        </Box>
        <ProgressRing
          percentage={percentage}
          size={cardSize.progressSize}
          color={getDifficultyColor(level)}
          textSize={size === 'small' ? 12 : 14}
        />
      </Box>

      {showDetailedStats && !isLoading && (
        <Box gap="s">
          <ProgressBar
            percentage={percentage}
            width={150}
            height={6}
            color={getDifficultyColor(level)}
            showLabel={true}
            label={`${learnedCount} / ${totalCount} countries`}
            showPercentage={false}
          />

          <Box row spaceAround paddingTop="xs">
            <Box centerItems>
              <Text variant="body" weight="bold" color="text">
                {learnedCount}
              </Text>
              <Text variant="caption" color="subText" marginTop="xs">
                Learned
              </Text>
            </Box>
            <Box centerItems>
              <Text variant="body" weight="bold" color="text">
                {totalCount - learnedCount}
              </Text>
              <Text variant="caption" color="subText" marginTop="xs">
                Remaining
              </Text>
            </Box>
            <Box centerItems>
              <Text variant="body" weight="bold" color="text">
                {totalCount}
              </Text>
              <Text variant="caption" color="subText" marginTop="xs">
                Total
              </Text>
            </Box>
          </Box>
        </Box>
      )}

      {isLoading && (
        <Box centerItems paddingVertical="m">
          <Text variant="bodySmall" color="subText">
            Loading progress...
          </Text>
        </Box>
      )}
    </Box>
  )

  if (onPress) {
    return (
      <Box marginBottom="sm">
        <Button onPress={onPress} variant="ghost" fullWidth alignItems="flex-start">
          <CardContent />
        </Button>
      </Box>
    )
  }

  return <CardContent />
}

export default RegionProgressCard
