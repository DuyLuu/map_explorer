import React from 'react'
import Svg, { Circle } from 'react-native-svg'
import { useTheme } from '../theme'

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
  color,
  backgroundColor,
  showPercentage = true,
  textSize = 16,
  textColor
}) => {
  const { theme } = useTheme()
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const progressColor = color || theme.colors.primary
  const trackColor = backgroundColor || theme.colors.lightGray
  const labelColor = textColor || theme.colors.text

  return (
    <Box center style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
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
          <Text variant="label" weight="bold" size={textSize} color={labelColor} center>
            {Math.round(percentage)}%
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default ProgressRing
