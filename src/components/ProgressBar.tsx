import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from './Text'

interface ProgressBarProps {
  percentage: number
  width?: number
  height?: number
  color?: string
  backgroundColor?: string
  showLabel?: boolean
  label?: string
  showPercentage?: boolean
  animated?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  width = 200,
  height = 8,
  color = '#4CAF50',
  backgroundColor = '#f0f0f0',
  showLabel = false,
  label = '',
  showPercentage = false,
  animated = true,
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage))

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text variant="label" muted>
            {label}
          </Text>
          {showPercentage && (
            <Text variant="label" weight="bold">
              {Math.round(clampedPercentage)}%
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.progressTrack,
          {
            width,
            height,
            backgroundColor,
          },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${clampedPercentage}%`,
              height: '100%',
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
  },
  progressTrack: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
    minWidth: 2, // Ensure minimum visible progress
  },
})

export default ProgressBar
