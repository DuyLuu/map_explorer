import React from 'react'

import { useTheme } from '../theme'

import { Text } from './Text'
import { Box } from './Box'

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
  color,
  backgroundColor,
  showLabel = false,
  label = '',
  showPercentage = false
}) => {
  const { theme } = useTheme()
  const clampedPercentage = Math.max(0, Math.min(100, percentage))

  const progressColor = color || theme.colors.primary
  const trackColor = backgroundColor || theme.colors.lightGray

  return (
    <Box alignStart>
      {showLabel && (
        <Box row spaceBetween fullWidth marginBottom="xs">
          <Text variant="label" muted>
            {label}
          </Text>
          {showPercentage && (
            <Text variant="label" weight="bold" color="text">
              {Math.round(clampedPercentage)}%
            </Text>
          )}
        </Box>
      )}
      <Box borderRadius="xs" hidden style={{ width, height }} backgroundColor={trackColor}>
        <Box
          borderRadius="xs"
          style={{ width: `${clampedPercentage}%` }}
          backgroundColor={progressColor}
        />
      </Box>
    </Box>
  )
}

export default ProgressBar
