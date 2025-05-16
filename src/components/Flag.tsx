import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

interface FlagProps {
  flagUrl: string
  onLoadEnd?: () => void
}

const Flag: React.FC<FlagProps> = React.memo(
  ({ flagUrl, onLoadEnd }) => {
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

    return (
      <View style={styles.flagContainer}>
        {isImageLoading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}
        <FastImage
          style={styles.flagImage}
          source={{
            uri: flagUrl,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          resizeMode={FastImage.resizeMode.contain}
          onLoadEnd={handleLoadEnd}
          onError={() => {
            console.error('Failed to load image:', flagUrl)
            handleLoadEnd()
          }}
        />
      </View>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.flagUrl === nextProps.flagUrl
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
