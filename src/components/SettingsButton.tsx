import { TouchableOpacity } from 'react-native'
import SvgUri from 'react-native-svg-uri'
import IMAGES from '../assets/images'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/types'
import { Theme } from '../theme/constants'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

const SettingsButton = () => {
  const navigation = useNavigation<NavigationProp>()
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
      <SvgUri width="24" height="24" source={IMAGES.ic_settings} />
    </TouchableOpacity>
  )
}
export default SettingsButton
