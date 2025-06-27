import React from 'react'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Box, Text } from 'components/index'
import { Icon } from 'components/index'

import { RootStackParamList } from '../../../navigation/types'
import { CountryWithRegion } from '../../../types/region'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

interface CountryCardProps {
  country: CountryWithRegion
  onPress?: () => void
}

const CountryCard: React.FC<CountryCardProps> = ({ country, onPress }) => {
  const navigation = useNavigation<NavigationProp>()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      navigation.navigate('CountryDetail', { country })
    }
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <Box
        row
        centerItems
        padding="m"
        backgroundColor="parchment"
        borderRadius="md"
        shadow="default"
        marginBottom="m"
      >
        <FastImage
          source={{ uri: country.flagUrl }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 6
          }}
        />
        <Box flex={1} marginLeft="m">
          <Text variant="h6" numberOfLines={1} color="text">
            {country.name}
          </Text>
          <Text variant="body" numberOfLines={1} color="subText">
            {country.region} • {country.subregion}
          </Text>
          <Text variant="caption" color="subText">
            Population: {country.population?.toLocaleString() || 'N/A'}
          </Text>
        </Box>
        <Icon name="chevron_right" size="md" color="subText" />
      </Box>
    </TouchableOpacity>
  )
}

export default CountryCard
