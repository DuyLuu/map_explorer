import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../theme'

import { Button } from './Button'
import { Icon } from './Icon'

const BackButton = ({ onBack }: { onBack?: () => void }) => {
  const { theme } = useTheme()
  const navigation = useNavigation()

  return (
    <Button
      onPress={() => (onBack ? onBack() : navigation.goBack())}
      variant="ghost"
      padding="xs"
      accessibilityLabel="Back"
    >
      <Icon name="arrow_left" size={20} color={theme.colors.text} />
    </Button>
  )
}

export default BackButton
