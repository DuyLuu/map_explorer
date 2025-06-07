import { Button } from './Button'
import { useNavigation } from '@react-navigation/native'
import SvgUri from 'react-native-svg-uri'
import IMAGES from '../assets/images'
import { Theme } from '../theme/constants'

const BackButton = ({ onBack }: { onBack?: () => void }) => {
  const navigation = useNavigation()

  return (
    <Button
      onPress={() => (onBack ? onBack() : navigation.goBack())}
      variant="ghost"
      padding="xs"
      accessibilityLabel="Back"
    >
      <SvgUri fill={Theme.colors.danger} width="24" height="24" source={IMAGES.ic_back} />
    </Button>
  )
}

export default BackButton
