import { memo } from 'react'
import { ColorValue, TextStyle } from 'react-native'
import { useTheme, iconSizes } from '../../theme'
import createIconSet from '@react-native-vector-icons/icomoon'

import { IconProps } from './Icon.d'
import icoMoonConfig from './assets/selection.json'

// Create the base icon component using react-native-vector-icons
const BaseIcon = createIconSet(icoMoonConfig, 'icomoon', 'icomoon.ttf')

/**
 * Themed IcoMoon Icon component that integrates with the design system
 *
 * Features:
 * - IcoMoon custom font integration using @react-native-vector-icons/icomoon
 * - Theme-based sizing using iconSizes
 * - Theme-aware colors with shortcuts
 * - Spacing props for margins following BoxKey system
 * - TypeScript support
 * - Accessibility support
 * - Optimized with react-native-vector-icons for better performance
 *
 * @example
 * ```tsx
 * <Icon name="search" size="md" primary />
 * <Icon name="heart" size={24} color="#FF0000" />
 * <Icon name="star" size="lg" secondary marginRight="sm" />
 * ```
 */
const Icon = ({
  name,
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
  light,
  gray,
  ...props
}: IconProps) => {
  const { theme } = useTheme()

  // Get icon size
  const getIconSize = (): number => {
    if (typeof size === 'number') {
      return size
    }
    return iconSizes[size as keyof typeof iconSizes] || iconSizes.base
  }

  // Get icon color
  const getIconColor = (): ColorValue => {
    // Color shortcuts take priority
    if (primary) return theme.colors.primary
    if (secondary) return theme.colors.secondary
    if (success) return theme.colors.success
    if (warning) return theme.colors.warning
    if (danger) return theme.colors.danger
    if (muted) return theme.colors.subText
    if (light) return theme.colors.light
    if (gray) return theme.colors.gray

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

  // Common props
  const commonProps = {
    name,
    size: getIconSize(),
    color: getIconColor(),
    style: combinedStyle,
    ...props
  }

  return <BaseIcon {...commonProps} />
}

export default memo(Icon)
export { BaseIcon as CustomIcon }
