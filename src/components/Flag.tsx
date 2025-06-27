import React, { useState } from 'react'
import { ActivityIndicator, ImageSourcePropType, Image } from 'react-native'

import { useTheme } from '../theme'

import { Box } from './Box'

interface FlagProps {
  flagAsset: ImageSourcePropType
  onLoadEnd?: () => void
}

const Flag: React.FC<FlagProps> = React.memo(
  ({ flagAsset, onLoadEnd }) => {
    const { theme } = useTheme()
    const [isImageLoading, setIsImageLoading] = useState(true)

    const handleLoadEnd = () => {
      setIsImageLoading(false)
      onLoadEnd?.()
    }

    // Convert ImageSourcePropType to FastImage compatible source
    const getFastImageSource = (): any => {
      console.log('flagAsset', flagAsset)
      if (typeof flagAsset === 'number') {
        // Local asset (require'd image)
        return flagAsset as any
      } else if (typeof flagAsset === 'object' && flagAsset !== null && 'uri' in flagAsset) {
        // URI-based source
        return {
          uri: flagAsset.uri
        }
      } else {
        // Fallback for local assets
        return flagAsset as any
      }
    }

    return (
      <Box center marginBottom="m" style={{ width: 240, height: 160 }}>
        {isImageLoading && (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ position: 'absolute' }}
          />
        )}
        <Image
          style={{ width: '100%', height: '100%' }}
          source={getFastImageSource()}
          resizeMode="contain"
          onLoadEnd={handleLoadEnd}
          onError={() => {
            console.error('Failed to load flag asset')
            handleLoadEnd()
          }}
        />
      </Box>
    )
  },
  (prevProps, nextProps) => {
    // Compare the asset objects
    return prevProps.flagAsset === nextProps.flagAsset
  }
)

export default Flag
