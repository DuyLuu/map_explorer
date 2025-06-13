import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
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
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Box row centerItems padding="m" backgroundColor="surface" borderRadius="md">
        <FastImage source={{ uri: country.flagUrl }} style={styles.flag} />
        <Box flex={1} marginLeft="m">
          <Text variant="h6" numberOfLines={1}>
            {country.name}
          </Text>
          <Text variant="body" color="subText" numberOfLines={1}>
            {country.region} • {country.subregion}
          </Text>
          <Text variant="caption" color="subText">
            Population: {country.population?.toLocaleString() || 'N/A'}
          </Text>
        </Box>
        <Icon name="chevron_right" size={20} color="#999" />
      </Box>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  flag: {
    width: 64,
    height: 64,
    borderRadius: 6
  }
})

export default CountryCard
