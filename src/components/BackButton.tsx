import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import SvgUri from 'react-native-svg-uri'
import IMAGES from '../assets/images'
import { Theme } from '../theme/constants'
const BackButton = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <SvgUri fill={Theme.colors.danger} width="24" height="24" source={IMAGES.ic_back} />
    </TouchableOpacity>
  )
}

export default BackButton
