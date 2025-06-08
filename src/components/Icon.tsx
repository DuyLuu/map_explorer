// Search for icons here:
// https://oblador.github.io/react-native-vector-icons/
import React from 'react'
import { TextStyle } from 'react-native'
import { useTheme, IconSize, Spacing } from '../theme'

// Import different icon families from react-native-vector-icons
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import Foundation from 'react-native-vector-icons/Foundation'
import Octicons from 'react-native-vector-icons/Octicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Zocial from 'react-native-vector-icons/Zocial'
import Fontisto from 'react-native-vector-icons/Fontisto'

export type IconFamily =
  | 'Ionicons'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'Foundation'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial'
  | 'Fontisto'

export interface IconProps {
  /** Icon name - must be valid for the selected family */
  name: string
  /** Icon family/library to use */
  family?: IconFamily
  /** Icon size - theme size or custom number */
  size?: IconSize | number
  /** Icon color - theme color key or custom hex/rgb */
  color?: string
  /** Custom styles to apply */
  style?: TextStyle | TextStyle[]

  // BoxKey spacing props following theme system
  /** Margin from theme spacing */
  margin?: Spacing
  /** Horizontal margin from theme spacing */
  marginHorizontal?: Spacing
  /** Vertical margin from theme spacing */
  marginVertical?: Spacing
  /** Top margin from theme spacing */
  marginTop?: Spacing
  /** Bottom margin from theme spacing */
  marginBottom?: Spacing
  /** Right margin from theme spacing */
  marginRight?: Spacing
  /** Left margin from theme spacing */
  marginLeft?: Spacing

  // Theme color shortcuts
  /** Use primary color */
  primary?: boolean
  /** Use secondary color */
  secondary?: boolean
  /** Use success color */
  success?: boolean
  /** Use warning color */
  warning?: boolean
  /** Use danger color */
  danger?: boolean
  /** Use muted color */
  muted?: boolean
  /** Use white color */
  white?: boolean
  /** Use black color */
  black?: boolean

  // Accessibility
  /** Accessibility label */
  accessibilityLabel?: string
  /** Whether icon is decorative only */
  accessibilityIgnoresInvertColors?: boolean
}

/**
 * Themed Icon component that wraps react-native-vector-icons
 *
 * Features:
 * - Support for multiple icon families (Ionicons, FontAwesome, MaterialIcons, etc.)
 * - Theme-based sizing using iconSizes
 * - Theme-aware colors with shortcuts
 * - Spacing props for margins
 * - TypeScript support
 * - Accessibility support
 *
 * @example
 * ```tsx
 * <Icon name="home" family="Ionicons" size="md" color="primary" />
 * <Icon name="search" family="FontAwesome" size={24} primary />
 * <Icon name="close" size="lg" danger marginRight="sm" />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  family = 'Ionicons',
  size = 'base',
  color,
  style,
  // Spacing props
  margin,
  marginHorizontal,
  marginVertical,
  marginTop,
  marginBottom,
  marginRight,
  marginLeft,
  // Color shortcuts
  primary,
  secondary,
  success,
  warning,
  danger,
  muted,
  white,
  black,
  // Accessibility
  accessibilityLabel,
  accessibilityIgnoresInvertColors,
}) => {
  const { theme } = useTheme()

  // Get icon size
  const getIconSize = (): number => {
    if (typeof size === 'number') {
      return size
    }
    // Use theme layout iconSizes from layout.ts
    const iconSizes = {
      xs: 12,
      sm: 16,
      base: 20,
      md: 24,
      lg: 28,
      xl: 32,
      '2xl': 40,
      '3xl': 48,
      '4xl': 64,
    }
    return iconSizes[size as keyof typeof iconSizes] || 20
  }

  // Get icon color
  const getIconColor = (): string => {
    // Color shortcuts take priority
    if (primary) return theme.colors.primary
    if (secondary) return theme.colors.secondary
    if (success) return theme.colors.success
    if (warning) return theme.colors.warning
    if (danger) return theme.colors.danger
    if (muted) return theme.colors.subText
    if (white) return theme.colors.light
    if (black) return theme.colors.black

    // Custom color or theme color key
    if (color) {
      // Check if it's a theme color key
      if (theme.colors[color as keyof typeof theme.colors]) {
        return theme.colors[color as keyof typeof theme.colors] as string
      }
      // Return as custom color
      return color
    }

    // Default to main text color
    return theme.colors.mainText
  }

  // Get spacing styles
  const getSpacingStyles = (): TextStyle => {
    const spacingStyles: TextStyle = {}

    if (margin) spacingStyles.margin = theme.spacing[margin]
    if (marginHorizontal) spacingStyles.marginHorizontal = theme.spacing[marginHorizontal]
    if (marginVertical) spacingStyles.marginVertical = theme.spacing[marginVertical]
    if (marginTop) spacingStyles.marginTop = theme.spacing[marginTop]
    if (marginBottom) spacingStyles.marginBottom = theme.spacing[marginBottom]
    if (marginRight) spacingStyles.marginRight = theme.spacing[marginRight]
    if (marginLeft) spacingStyles.marginLeft = theme.spacing[marginLeft]

    return spacingStyles
  }

  // Combine styles properly
  const combinedStyle = [getSpacingStyles(), style].filter(Boolean)

  // Get the correct icon component based on family
  const getIconComponent = () => {
    const iconProps = {
      name,
      size: getIconSize(),
      color: getIconColor(),
      style: combinedStyle,
      accessibilityLabel,
      accessibilityIgnoresInvertColors,
    }

    switch (family) {
      case 'Ionicons':
        return <Ionicons {...iconProps} />
      case 'FontAwesome':
        return <FontAwesome {...iconProps} />
      case 'FontAwesome5':
        return <FontAwesome5 {...iconProps} />
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons {...iconProps} />
      case 'AntDesign':
        return <AntDesign {...iconProps} />
      case 'Entypo':
        return <Entypo {...iconProps} />
      case 'EvilIcons':
        return <EvilIcons {...iconProps} />
      case 'Feather':
        return <Feather {...iconProps} />
      case 'Foundation':
        return <Foundation {...iconProps} />
      case 'Octicons':
        return <Octicons {...iconProps} />
      case 'SimpleLineIcons':
        return <SimpleLineIcons {...iconProps} />
      case 'Zocial':
        return <Zocial {...iconProps} />
      case 'Fontisto':
        return <Fontisto {...iconProps} />
      default:
        return <Ionicons {...iconProps} />
    }
  }

  return getIconComponent()
}

// Convenience components for specific icon families
export const IoniconsIcon: React.FC<Omit<IconProps, 'family'>> = props => (
  <Icon {...props} family="Ionicons" />
)

export const FontAwesomeIcon: React.FC<Omit<IconProps, 'family'>> = props => (
  <Icon {...props} family="FontAwesome" />
)

export const FontAwesome5Icon: React.FC<Omit<IconProps, 'family'>> = props => (
  <Icon {...props} family="FontAwesome5" />
)

export const MaterialIcon: React.FC<Omit<IconProps, 'family'>> = props => (
  <Icon {...props} family="MaterialIcons" />
)

export const MaterialCommunityIcon: React.FC<Omit<IconProps, 'family'>> = props => (
  <Icon {...props} family="MaterialCommunityIcons" />
)

export const AntDesignIcon: React.FC<Omit<IconProps, 'family'>> = props => (
  <Icon {...props} family="AntDesign" />
)

export const EntypoIcon: React.FC<Omit<IconProps, 'family'>> = props => (
  <Icon {...props} family="Entypo" />
)

export const FeatherIcon: React.FC<Omit<IconProps, 'family'>> = props => (
  <Icon {...props} family="Feather" />
)

export const FontistoIcon: React.FC<Omit<IconProps, 'family'>> = props => (
  <Icon {...props} family="Fontisto" />
)

export const ChallengeIcon: React.FC<Omit<IconProps, 'family'>> = props => (
  <IoniconsIcon {...props} name="rocket" />
)

export default Icon
