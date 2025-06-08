import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Region, REGION_INFO } from 'types/region'
import ProgressRing from 'components/ProgressRing'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'

interface MapRegionOptionProps {
  region: Region
  isSelected: boolean
  onPress: () => void
  correctAnswers: number
  totalQuestions: number
  isUnlocked: boolean
}

const MapRegionOption: React.FC<MapRegionOptionProps> = ({
  region,
  isSelected,
  onPress,
  correctAnswers,
  totalQuestions,
  isUnlocked,
}) => {
  const regionInfo = REGION_INFO[region]
  const completion = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0

  // If it's locked (map quiz), show locked state
  if (!isUnlocked) {
    return (
      <Button
        style={[styles.option, styles.lockedOption]}
        disabled
        padding="m"
        borderRadius={12}
        backgroundColor="#f0f0f0"
      >
        <Text style={styles.regionName}>{regionInfo.displayName}</Text>
        <Box centerItems>
          <Text style={styles.lockText}>🔒</Text>
          <Text style={styles.lockSubtext}>Complete previous regions</Text>
        </Box>
      </Button>
    )
  }

  return (
    <Button
      style={
        [
          styles.option,
          isSelected && styles.selectedOption,
          completion === 100 && styles.completedOption,
        ].filter(Boolean) as import('react-native').ViewStyle[]
      }
      onPress={onPress}
      padding="m"
      borderRadius={12}
      backgroundColor="#fff"
      marginBottom="sm"
    >
      {/* Region Info and Progress Ring */}
      <Box row centerItems flex>
        <Box flex>
          <Box row centerItems marginBottom="xs">
            <Text style={styles.regionName}>{regionInfo.displayName}</Text>
          </Box>
        </Box>

        <Box centerItems marginLeft="m">
          <ProgressRing
            percentage={completion}
            size={50}
            strokeWidth={4}
            color={completion === 100 ? '#4CAF50' : '#2196F3'}
            backgroundColor="#E0E0E0"
            showPercentage={false}
          />
          <Text style={styles.progressText}>{Math.round(completion)}%</Text>
        </Box>
      </Box>

      {completion === 100 && <Text style={styles.completionBadge}>✅ Completed</Text>}
    </Button>
  )
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedOption: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  completedOption: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  regionName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  lockText: {
    fontSize: 24,
    color: '#888',
    marginBottom: 2,
  },
  lockSubtext: {
    fontSize: 12,
    color: '#888',
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  completionBadge: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 8,
    fontWeight: 'bold',
  },
})

export default MapRegionOption
