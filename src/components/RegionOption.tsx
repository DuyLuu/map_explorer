import React, { useCallback } from 'react'
import { getRegionProgress } from 'services/quizService'
import { getRegionDescription } from 'utils/regionUtils'

import { useTheme } from '../theme'
import { Region, REGION_INFO } from '../types/region'

import ProgressRing from './ProgressRing'
import { Text } from './Text'
import { Box } from './Box'
import { Button } from './Button'

interface RegionOptionProps {
  region: Region
  isSelected: boolean
  onPress: () => void
}

const RegionOption: React.FC<RegionOptionProps> = ({ region, isSelected, onPress }) => {
  const { theme } = useTheme()
  const [progress, setProgress] = React.useState<number>(0)
  const [learned, setLearned] = React.useState<number>(0)
  const [total, setTotal] = React.useState<number>(0)

  const loadProgress = useCallback(async () => {
    try {
      // Load overall progress for the region across all levels
      const progressData = await getRegionProgress(region)
      console.log('progressData', progressData)
      setProgress(progressData.completionPercentage)
      setLearned(progressData.learnedCountries.length)
      setTotal(progressData.totalCountries)
    } catch (error) {
      console.error('Error loading progress for region:', region, error)
    }
  }, [region])

  React.useEffect(() => {
    loadProgress()
  }, [loadProgress])

  const getProgressColor = (percentage: number): string => {
    if (percentage === 100) return theme.colors.success // Green for complete
    if (percentage > 0) return theme.colors.primary // Blue for in progress (flag quiz color)
    return theme.colors.lightGray // Gray for not started
  }

  return (
    <Button
      onPress={onPress}
      variant={isSelected ? 'primary' : 'outlined'}
      paddingVertical="sm"
      paddingHorizontal="m"
      fullWidth
      borderRadius="md"
      marginBottom="m"
      borderColor={isSelected ? theme.colors.primary : theme.colors.breakLine}
      backgroundColor={isSelected ? theme.colors.primary : theme.colors.background}
    >
      <Box row flex spaceBetween centerItems>
        <Box flex alignStart>
          <Text variant="h6" weight="bold" color={isSelected ? 'white' : 'text'} marginBottom="xxs">
            {REGION_INFO[region].displayName}
          </Text>
          <Text variant="bodySmall" color={isSelected ? 'white' : 'subText'} marginBottom="xxs">
            {getRegionDescription(region)}
          </Text>
          {progress > 0 && (
            <Text variant="caption" color={isSelected ? 'white' : 'subText'} marginTop="xxs">
              {learned}/{total} countries learned
            </Text>
          )}
        </Box>
        <Box centerItems marginLeft="m">
          <ProgressRing
            percentage={progress}
            size={50}
            strokeWidth={4}
            color={getProgressColor(progress)}
            showPercentage={false}
          />
          {progress > 0 && (
            <Text
              variant="caption"
              weight="bold"
              color={isSelected ? 'white' : 'text'}
              marginTop="xxs"
            >
              {Math.round(progress)}%
            </Text>
          )}
        </Box>
      </Box>
    </Button>
  )
}

export default RegionOption
