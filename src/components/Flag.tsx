import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet, ImageSourcePropType } from 'react-native'
import FastImage, { Source } from 'react-native-fast-image'

interface FlagProps {
  flagAsset: ImageSourcePropType
  onLoadEnd?: () => void
}

const Flag: React.FC<FlagProps> = React.memo(
  ({ flagAsset, onLoadEnd }) => {
    const [isImageLoading, setIsImageLoading] = useState(true)

    useEffect(() => {
      return () => {
        FastImage.clearMemoryCache()
      }
    }, [])

    const handleLoadEnd = () => {
      setIsImageLoading(false)
      onLoadEnd?.()
    }

    // Convert ImageSourcePropType to FastImage compatible source
    const getFastImageSource = (): Source => {
      if (typeof flagAsset === 'number') {
        // Local asset (require'd image)
        return flagAsset as Source
      } else if (typeof flagAsset === 'object' && flagAsset !== null && 'uri' in flagAsset) {
        // URI-based source
        return {
          uri: flagAsset.uri,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.immutable,
        }
      } else {
        // Fallback for local assets
        return flagAsset as Source
      }
    }

    return (
      <View style={styles.flagContainer}>
        {isImageLoading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}
        <FastImage
          style={styles.flagImage}
          source={getFastImageSource()}
          resizeMode={FastImage.resizeMode.contain}
          onLoadEnd={handleLoadEnd}
          onError={() => {
            console.error('Failed to load flag asset')
            handleLoadEnd()
          }}
        />
      </View>
    )
  },
  (prevProps, nextProps) => {
    // Compare the asset objects
    return prevProps.flagAsset === nextProps.flagAsset
  }
)

const styles = StyleSheet.create({
  flagContainer: {
    width: 300,
    height: 200,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
  },
})

export default Flag
