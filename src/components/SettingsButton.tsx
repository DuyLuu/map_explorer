import { Button } from './Button'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { Theme } from '../theme/constants'
import { Box } from './Box'
import { FeatherIcon } from './Icon'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const SettingsButton = () => {
  const navigation = useNavigation<NavigationProp>()
  return (
    <Box marginRight="m">
      <Button onPress={() => navigation.navigate('Settings')} variant="ghost" padding="xs">
        <FeatherIcon name="settings" size={24} color={Theme.colors.baseBlack} />
      </Button>
    </Box>
  )
}

export default SettingsButton
