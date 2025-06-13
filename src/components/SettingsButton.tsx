import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button, Box, Icon } from 'components/index'

import { RootStackParamList } from '../navigation/types'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const SettingsButton = () => {
  const navigation = useNavigation<NavigationProp>()
  return (
    <Box marginRight="m">
      <Button onPress={() => navigation.navigate('Settings')} variant="ghost" padding="xs">
        <Icon name="setting" size="md" color="baseBlack" />
      </Button>
    </Box>
  )
}

export default SettingsButton
