import React from 'react'
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
  color = '#4CAF50',
  backgroundColor = '#f0f0f0',
  showLabel = false,
  label = '',
  showPercentage = false,
  animated = true,
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percentage))

  return (
    <Box alignStart>
      {showLabel && (
        <Box row spaceBetween fullWidth marginBottom="xs">
          <Text variant="label" muted>
            {label}
          </Text>
          {showPercentage && (
            <Text variant="label" weight="bold">
              {Math.round(clampedPercentage)}%
            </Text>
          )}
        </Box>
      )}
      <Box
        borderRadius="xs"
        hidden
        style={{
          width,
          height,
          backgroundColor,
        }}
      >
        <Box
          borderRadius="xs"
          style={{
            width: `${clampedPercentage}%`,
            height: '100%',
            backgroundColor: color,
            minWidth: 2, // Ensure minimum visible progress
          }}
        />
      </Box>
    </Box>
  )
}

export default ProgressBar
