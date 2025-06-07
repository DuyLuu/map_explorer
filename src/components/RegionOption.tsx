import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Region, REGION_INFO } from '../types/region'
import ProgressRing from './ProgressRing'
import { getRegionProgress } from '../services/quizService'
import { getRegionDescription } from '../utils/regionUtils'
import { Text } from './Text'

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
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOption]}
      onPress={onPress}
    >
      <View style={styles.regionHeader}>
        <View style={styles.regionTextContainer}>
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
        </View>
        <View style={styles.progressContainer}>
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
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#0056CC',
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  progressContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },
  optionName: {
    marginBottom: 4,
    textAlign: 'left',
  },
  optionDescription: {
    textAlign: 'left',
    marginBottom: 2,
  },
  progressText: {
    textAlign: 'left',
  },
  progressPercentage: {
    marginTop: 2,
  },
})

export default RegionOption
