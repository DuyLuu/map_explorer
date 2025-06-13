import { useNavigation } from '@react-navigation/native'

import { Theme } from '../theme/constants'

import { Button } from './Button'
import { Icon } from './Icon'

const BackButton = ({ onBack }: { onBack?: () => void }) => {
  const navigation = useNavigation()

  return (
    <Button
      onPress={() => (onBack ? onBack() : navigation.goBack())}
      variant="ghost"
      padding="xs"
      accessibilityLabel="Back"
    >
      <Icon name="arrow_left" size={20} color={Theme.colors.baseBlack} />
    </Button>
  )
}

export default BackButton
