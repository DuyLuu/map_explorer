import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Region, REGION_INFO } from '../../../types/region'
import ProgressRing from '../../../components/ProgressRing'
import { getRegionLevelProgress } from '../../../services/quizService'

interface MapRegionOptionProps {
  region: Region
  isSelected: boolean
  onPress: () => void
}

const getRegionDescription = (region: Region): string => {
  const descriptions: Record<Region, string> = {
    [Region.WORLD]: 'All countries worldwide',
    [Region.EUROPE]: '47 European countries',
    [Region.AFRICA]: '54 African countries',
    [Region.ASIA]: '48 Asian countries',
    [Region.NORTH_AMERICA]: '23 North American countries',
    [Region.SOUTH_AMERICA]: '12 South American countries',
    [Region.OCEANIA]: '14 Oceanian countries',
  }
  return descriptions[region] || 'Explore this region'
}

const MapRegionOption: React.FC<MapRegionOptionProps> = ({ region, isSelected, onPress }) => {
  const [progress, setProgress] = React.useState<number>(0)
  const [learned, setLearned] = React.useState<number>(0)
  const [total, setTotal] = React.useState<number>(0)

  React.useEffect(() => {
    loadProgress()
  }, [region])

  const loadProgress = async () => {
    try {
      const progressData = await getRegionLevelProgress(region, 1) // Level 1 (Easy) for overview
      setProgress(progressData.completionPercentage)
      setLearned(progressData.learnedCountries.length)
      setTotal(progressData.totalCountries)
    } catch (error) {
      console.error('Error loading progress for region:', region, error)
    }
  }

  const getProgressColor = (percentage: number): string => {
    if (percentage === 100) return '#4CAF50' // Green for complete
    if (percentage > 0) return '#FF9800' // Orange for in progress
    return '#f0f0f0' // Gray for not started
  }

  return (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.selectedOption]}
      onPress={onPress}
    >
      <View style={styles.regionHeader}>
        <View style={styles.regionTextContainer}>
          <Text style={[styles.optionName, isSelected && styles.selectedText]}>
            {REGION_INFO[region].displayName}
          </Text>
          <Text style={[styles.optionDescription, isSelected && styles.selectedText]}>
            {getRegionDescription(region)}
          </Text>
          {progress > 0 && (
            <Text style={[styles.progressText, isSelected && styles.selectedText]}>
              {learned}/{total} countries learned (Easy)
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
            <Text style={[styles.progressPercentage, isSelected && styles.selectedText]}>
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
    backgroundColor: '#FF6B35',
    borderColor: '#E55A2B',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'left',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'left',
    marginBottom: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'left',
  },
  progressPercentage: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
    marginTop: 2,
  },
  selectedText: {
    color: '#fff',
  },
})

export default MapRegionOption
