import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { CountryWithRegion, REGION_INFO } from 'types/region'
import { getFlagAssetByName } from 'services/flagAssetService'
import { Text } from 'components/Text'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { FontAwesomeIcon } from 'components/Icon'
import { Theme } from 'theme/constants'

interface CountryCardProps {
  country: CountryWithRegion
  onPress: (country: CountryWithRegion) => void
}

const CountryCard: React.FC<CountryCardProps> = ({ country, onPress }) => {
  const flagAsset = getFlagAssetByName(country.name)

  return (
    <Button
      onPress={() => onPress(country)}
      activeOpacity={0.7}
      borderRadius={12}
      backgroundColor="#fff"
      marginBottom="sm"
      shadow="default"
    >
      <Box flex row fullWidth padding="xs">
        <Box marginRight="m" fullHeight borderRadius="xs" hidden style={styles.flagImageContainer}>
          {flagAsset ? (
            <Image source={flagAsset} style={styles.flagImage} resizeMode="contain" />
          ) : (
            <Box marginLeft="m" backgroundColor="#f0f0f0" center>
              <Text size={16}>🏳️</Text>
            </Box>
          )}
        </Box>

        <Box row centerItems marginLeft="s" flex spaceBetween>
          <Box>
            <Text variant="h6" weight="bold">
              {country.name}
            </Text>
            <Text variant="bodySmall" muted color={Theme.colors.subText}>
              {REGION_INFO[country.region]?.displayName || country.region}
            </Text>
          </Box>
          <FontAwesomeIcon name="angle-right" size={20} color="#999" />
        </Box>
      </Box>
    </Button>
  )
}

const styles = StyleSheet.create({
  flagImageContainer: {
    height: 64,
    aspectRatio: 1.2,
    borderRadius: 6,
  },
  flagImage: {
    height: 64,
    aspectRatio: 1.2,
    borderRadius: 6,
  },
})

export default CountryCard
