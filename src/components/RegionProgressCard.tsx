import React, { useEffect, useState } from 'react'
import { Region, REGION_INFO } from '../types/region'
import { RegionLevelProgress } from '../types/progress'
import { getRegionLevelProgress } from '../services/quizService'
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
  size = 'medium',
}) => {
  const [progress, setProgress] = useState<RegionLevelProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProgress()
  }, [region, level])

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

  const getDifficultyName = (level: number): string => {
    const levels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
    return levels[level as keyof typeof levels] || `Level ${level}`
  }

  const getDifficultyColor = (level: number): string => {
    const colors = { 1: '#4CAF50', 2: '#FF9800', 3: '#F44336' }
    return colors[level as keyof typeof colors] || '#666'
  }

  const getCardSize = () => {
    switch (size) {
      case 'small':
        return { padding: 12, progressSize: 60 }
      case 'large':
        return { padding: 20, progressSize: 80 }
      default:
        return { padding: 16, progressSize: 70 }
    }
  }

  const cardSize = getCardSize()
  const regionInfo = REGION_INFO[region]
  const percentage = progress?.completionPercentage || 0
  const learnedCount = progress?.learnedCountries.length || 0
  const totalCount = progress?.totalCountries || 0

  const CardContent = () => (
    <Box
      backgroundColor="white"
      borderRadius="lg"
      shadow="light"
      marginBottom="sm"
      style={{ padding: cardSize.padding }}
    >
      <Box row spaceBetween centerItems marginBottom="m">
        <Box flex>
          <Text variant="h6" weight="bold" marginBottom="xs">
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
        <Box style={{ gap: 12 }}>
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
              <Text variant="body" weight="bold">
                {learnedCount}
              </Text>
              <Text variant="caption" muted marginTop="xs">
                Learned
              </Text>
            </Box>
            <Box centerItems>
              <Text variant="body" weight="bold">
                {totalCount - learnedCount}
              </Text>
              <Text variant="caption" muted marginTop="xs">
                Remaining
              </Text>
            </Box>
            <Box centerItems>
              <Text variant="body" weight="bold">
                {totalCount}
              </Text>
              <Text variant="caption" muted marginTop="xs">
                Total
              </Text>
            </Box>
          </Box>
        </Box>
      )}

      {isLoading && (
        <Box centerItems paddingVertical="m">
          <Text variant="bodySmall" muted>
            Loading progress...
          </Text>
        </Box>
      )}
    </Box>
  )

  if (onPress) {
    return (
      <Box marginBottom="sm">
        <Button onPress={onPress} variant="ghost" fullWidth style={{ alignItems: 'flex-start' }}>
          <CardContent />
        </Button>
      </Box>
    )
  }

  return <CardContent />
}

export default RegionProgressCard
