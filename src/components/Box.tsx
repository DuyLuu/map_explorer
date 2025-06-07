import React, { ReactNode } from 'react'
import { View, ViewProps, ViewStyle } from 'react-native'
import {
  useTheme,
  combineStyles,
  conditionalStyle,
  Spacing,
  BorderRadius,
  ShadowType,
  borderRadius,
} from '../theme'
import { BoxKey } from '../theme/constants'

export interface BoxProps extends Omit<ViewProps, 'style'> {
  /** Child components */
  children?: ReactNode
  /** Custom styles to apply */
  style?: ViewStyle | ViewStyle[]

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
  /** Padding from theme spacing */
  padding?: Spacing
  /** Horizontal padding from theme spacing */
  paddingHorizontal?: Spacing
  /** Vertical padding from theme spacing */
  paddingVertical?: Spacing
  /** Top padding from theme spacing */
  paddingTop?: Spacing
  /** Bottom padding from theme spacing */
  paddingBottom?: Spacing
  /** Right padding from theme spacing */
  paddingRight?: Spacing
  /** Left padding from theme spacing */
  paddingLeft?: Spacing

  // Background and visual styling
  /** Background color - can be theme color key or custom hex/rgb */
  backgroundColor?: string
  /** Border radius from theme or custom number */
  borderRadius?: BorderRadius | number
  /** Apply theme shadow */
  shadow?: ShadowType
  /** Custom shadow color */
  shadowColor?: string
  /** Apply border */
  borderWidth?: number
  /** Border color - can be theme color key or custom hex/rgb */
  borderColor?: string

  // Layout shortcuts
  /** Apply flex: 1 */
  flex?: boolean | number
  /** Flex direction row */
  row?: boolean
  /** Flex direction column (default) */
  column?: boolean
  /** Center align items and justify content */
  center?: boolean
  /** Center align items only */
  centerItems?: boolean
  /** Center justify content only */
  centerContent?: boolean
  /** Justify content space-between */
  spaceBetween?: boolean
  /** Justify content space-around */
  spaceAround?: boolean
  /** Justify content space-evenly */
  spaceEvenly?: boolean
  /** Align items flex-start */
  alignStart?: boolean
  /** Align items flex-end */
  alignEnd?: boolean
  /** Justify content flex-start */
  justifyStart?: boolean
  /** Justify content flex-end */
  justifyEnd?: boolean
  /** Position absolute */
  absolute?: boolean
  /** Apply full width */
  fullWidth?: boolean
  /** Apply full height */
  fullHeight?: boolean
  /** Apply overflow hidden */
  hidden?: boolean
  /** Apply opacity */
  opacity?: number

  // Theme color shortcuts
  /** Use primary background color */
  primary?: boolean
  /** Use secondary background color */
  secondary?: boolean
  /** Use success background color */
  success?: boolean
  /** Use warning background color */
  warning?: boolean
  /** Use danger background color */
  danger?: boolean
}

/**
 * Themed Box component that serves as a flexible container
 *
 * Features:
 * - Theme-based spacing props using BoxKey system
 * - Theme-aware background colors and styling
 * - Layout utility props for common patterns
 * - Shadow and border support
 * - Full customization through style prop
 * - TypeScript support with proper intellisense
 *
 * @example
 * ```tsx
 * <Box padding="m" backgroundColor="white" borderRadius="md" shadow="light">
 *   <Text>Content here</Text>
 * </Box>
 *
 * <Box row spaceBetween paddingHorizontal="l" marginBottom="s">
 *   <Text>Left content</Text>
 *   <Text>Right content</Text>
 * </Box>
 *
 * <Box center flex primary borderRadius="lg">
 *   <Text color="white">Centered content</Text>
 * </Box>
 * ```
 */
export const Box: React.FC<BoxProps> = ({
  children,
  style,
  // BoxKey spacing props
  margin,
  marginHorizontal,
  marginVertical,
  marginTop,
  marginBottom,
  marginRight,
  marginLeft,
  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingRight,
  paddingLeft,
  // Visual styling
  backgroundColor,
  borderRadius: borderRadiusProp,
  shadow,
  shadowColor,
  borderWidth,
  borderColor,
  // Layout shortcuts
  flex,
  row,
  column,
  center,
  centerItems,
  centerContent,
  spaceBetween,
  spaceAround,
  spaceEvenly,
  alignStart,
  alignEnd,
  justifyStart,
  justifyEnd,
  absolute,
  fullWidth,
  fullHeight,
  hidden,
  opacity,
  // Theme color shortcuts
  primary,
  secondary,
  success,
  warning,
  danger,
  ...props
}) => {
  const { theme } = useTheme()

  // Create spacing styles from BoxKey props
  const getSpacingStyles = (): ViewStyle => {
    const spacingStyles: ViewStyle = {}

    // Margin styles
    if (margin !== undefined) spacingStyles.margin = theme.spacing[margin]
    if (marginHorizontal !== undefined)
      spacingStyles.marginHorizontal = theme.spacing[marginHorizontal]
    if (marginVertical !== undefined) spacingStyles.marginVertical = theme.spacing[marginVertical]
    if (marginTop !== undefined) spacingStyles.marginTop = theme.spacing[marginTop]
    if (marginBottom !== undefined) spacingStyles.marginBottom = theme.spacing[marginBottom]
    if (marginRight !== undefined) spacingStyles.marginRight = theme.spacing[marginRight]
    if (marginLeft !== undefined) spacingStyles.marginLeft = theme.spacing[marginLeft]

    // Padding styles
    if (padding !== undefined) spacingStyles.padding = theme.spacing[padding]
    if (paddingHorizontal !== undefined)
      spacingStyles.paddingHorizontal = theme.spacing[paddingHorizontal]
    if (paddingVertical !== undefined)
      spacingStyles.paddingVertical = theme.spacing[paddingVertical]
    if (paddingTop !== undefined) spacingStyles.paddingTop = theme.spacing[paddingTop]
    if (paddingBottom !== undefined) spacingStyles.paddingBottom = theme.spacing[paddingBottom]
    if (paddingRight !== undefined) spacingStyles.paddingRight = theme.spacing[paddingRight]
    if (paddingLeft !== undefined) spacingStyles.paddingLeft = theme.spacing[paddingLeft]

    return spacingStyles
  }

  // Get background color based on props
  const getBackgroundColor = (): string | undefined => {
    if (backgroundColor) {
      // Check if it's a theme color key
      if (backgroundColor in theme.colors) {
        return (theme.colors as any)[backgroundColor]
      }
      return backgroundColor
    }

    if (primary) return theme.colors.primary
    if (secondary) return theme.colors.secondary
    if (success) return theme.colors.success
    if (warning) return theme.colors.warning
    if (danger) return theme.colors.danger

    return undefined
  }

  // Get border color
  const getBorderColor = (): string | undefined => {
    if (!borderColor) return undefined

    // Check if it's a theme color key
    if (borderColor in theme.colors) {
      return (theme.colors as any)[borderColor]
    }
    return borderColor
  }

  // Get border radius
  const getBorderRadius = (): number | undefined => {
    if (borderRadiusProp === undefined) return undefined

    if (typeof borderRadiusProp === 'number') return borderRadiusProp

    // Use theme border radius values
    return borderRadius[borderRadiusProp]
  }

  // Get shadow styles
  const getShadowStyles = (): ViewStyle => {
    if (!shadow) return {}

    const shadowStyle = theme.shadow[shadow]
    if (!shadowStyle) return {}

    return {
      ...shadowStyle,
      ...(shadowColor && { shadowColor }),
    }
  }

  // Build combined styles
  const combinedStyles = combineStyles(
    // Base styles
    {
      // Flex styles
      ...(flex === true && { flex: 1 }),
      ...(typeof flex === 'number' && { flex }),
      ...(row && { flexDirection: 'row' as const }),
      ...(column && { flexDirection: 'column' as const }),

      // Alignment styles
      ...(center && { justifyContent: 'center' as const, alignItems: 'center' as const }),
      ...(centerItems && { alignItems: 'center' as const }),
      ...(centerContent && { justifyContent: 'center' as const }),
      ...(spaceBetween && { justifyContent: 'space-between' as const }),
      ...(spaceAround && { justifyContent: 'space-around' as const }),
      ...(spaceEvenly && { justifyContent: 'space-evenly' as const }),
      ...(alignStart && { alignItems: 'flex-start' as const }),
      ...(alignEnd && { alignItems: 'flex-end' as const }),
      ...(justifyStart && { justifyContent: 'flex-start' as const }),
      ...(justifyEnd && { justifyContent: 'flex-end' as const }),

      // Position and size styles
      ...(absolute && { position: 'absolute' as const }),
      ...(fullWidth && { width: '100%' }),
      ...(fullHeight && { height: '100%' }),
      ...(hidden && { overflow: 'hidden' as const }),
      ...(opacity !== undefined && { opacity }),

      // Visual styles
      backgroundColor: getBackgroundColor(),
      borderRadius: getBorderRadius(),
      ...(borderWidth !== undefined && { borderWidth }),
      borderColor: getBorderColor(),
    } as ViewStyle,

    // Spacing styles from BoxKey props
    getSpacingStyles(),

    // Shadow styles
    getShadowStyles(),

    // Custom styles - filter out undefined
    ...(Array.isArray(style) ? style.filter(Boolean) : style ? [style] : [])
  )

  return (
    <View style={combinedStyles} {...props}>
      {children}
    </View>
  )
}

export default Box
