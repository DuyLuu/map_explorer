import { Button } from './Button'
import { useNavigation } from '@react-navigation/native'
import { Theme } from '../theme/constants'
import { AntDesignIcon } from './Icon'

const BackButton = ({ onBack }: { onBack?: () => void }) => {
  const navigation = useNavigation()

  return (
    <Button
      onPress={() => (onBack ? onBack() : navigation.goBack())}
      variant="ghost"
      padding="xs"
      accessibilityLabel="Back"
    >
      <AntDesignIcon name="left" size={24} color={Theme.colors.baseBlack} />
    </Button>
  )
}

export default BackButton
