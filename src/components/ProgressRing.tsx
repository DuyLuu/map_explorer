import React from 'react'
import { StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { Text } from './Text'
import { Box } from './Box'

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showPercentage?: boolean
  textSize?: number
  textColor?: string
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 100,
  strokeWidth = 8,
  color = '#4CAF50',
  backgroundColor = '#f0f0f0',
  showPercentage = true,
  textSize = 16,
  textColor = '#333',
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <Box center style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showPercentage && (
        <Box center>
          <Text variant="label" weight="bold" size={textSize} color={textColor} center>
            {Math.round(percentage)}%
          </Text>
        </Box>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
  },
})

export default ProgressRing
