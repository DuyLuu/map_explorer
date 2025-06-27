import React from 'react'
import { ActivityIndicator } from 'react-native'
import { Box, Text } from 'components/index'
import { useTheme } from '../theme'

interface LoadingScreenProps {
  message?: string
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  const { theme } = useTheme()
  return (
    <Box flex={1} center backgroundColor="background">
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text marginTop="m" variant="body" color="subText">
        {message}
      </Text>
    </Box>
  )
}

export default LoadingScreen
