import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Region, REGION_INFO } from '../../../types/region'
import ProgressRing from '../../../components/ProgressRing'
import { Text } from '../../../components/Text'
import { Box } from '../../../components/Box'

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
      <TouchableOpacity style={[styles.option, styles.lockedOption]} disabled>
        <Text style={styles.regionName}>{regionInfo.displayName}</Text>
        <Box centerItems>
          <Text style={styles.lockText}>🔒</Text>
          <Text style={styles.lockSubtext}>Complete previous regions</Text>
        </Box>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={[
        styles.option,
        isSelected && styles.selectedOption,
        completion === 100 && styles.completedOption,
      ]}
      onPress={onPress}
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
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  lockedOption: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    opacity: 0.6,
  },
  completedOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  regionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  completionBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 8,
  },
  lockText: {
    fontSize: 24,
    marginBottom: 4,
  },
  lockSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
})

export default MapRegionOption
