import React from 'react'
import { StyleSheet } from 'react-native'
import { Region, REGION_INFO } from '../types/region'
import ProgressRing from './ProgressRing'
import { getRegionProgress } from '../services/quizService'
import { getRegionDescription } from '../utils/regionUtils'
import { Text } from './Text'
import { Box } from './Box'
import { Button } from './Button'

interface RegionOptionProps {
  region: Region
  isSelected: boolean
  onPress: () => void
}

const RegionOption: React.FC<RegionOptionProps> = ({ region, isSelected, onPress }) => {
  const [progress, setProgress] = React.useState<number>(0)
  const [learned, setLearned] = React.useState<number>(0)
  const [total, setTotal] = React.useState<number>(0)

  React.useEffect(() => {
    loadProgress()
  }, [region])

  const loadProgress = async () => {
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
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage === 100) return '#4CAF50' // Green for complete
    if (percentage > 0) return '#007AFF' // Blue for in progress (flag quiz color)
    return '#f0f0f0' // Gray for not started
  }

  return (
    <Button
      onPress={onPress}
      variant={isSelected ? 'primary' : 'outlined'}
      style={[styles.optionButton, isSelected && styles.selectedOption]}
      paddingVertical="sm"
      paddingHorizontal="m"
      fullWidth
    >
      <Box row spaceBetween centerItems>
        <Box flex alignStart>
          <Text
            variant="h6"
            weight="bold"
            color={isSelected ? '#fff' : '#333'}
            style={styles.optionName}
          >
            {REGION_INFO[region].displayName}
          </Text>
          <Text
            variant="bodySmall"
            color={isSelected ? '#fff' : '#666'}
            style={styles.optionDescription}
          >
            {getRegionDescription(region)}
          </Text>
          {progress > 0 && (
            <Text
              variant="caption"
              color={isSelected ? '#fff' : '#888'}
              style={styles.progressText}
            >
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
              color={isSelected ? '#fff' : '#666'}
              style={styles.progressPercentage}
            >
              {Math.round(progress)}%
            </Text>
          )}
        </Box>
      </Box>
    </Button>
  )
}

const styles = StyleSheet.create({
  optionButton: {
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'stretch',
  },
  selectedOption: {
    // Additional selected styles if needed
  },
  optionName: {
    marginBottom: 2,
  },
  optionDescription: {
    marginBottom: 2,
  },
  progressText: {
    marginTop: 2,
  },
  progressPercentage: {
    marginTop: 2,
  },
})

export default RegionOption
