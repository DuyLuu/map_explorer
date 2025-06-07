import React, { ReactNode } from 'react'
import { TouchableOpacity, TouchableOpacityProps, ViewStyle, ActivityIndicator } from 'react-native'
import {
  useTheme,
  combineStyles,
  conditionalStyle,
  Spacing,
  BorderRadius,
  ShadowType,
} from '../theme'
import { BoxKey } from '../theme/constants'
import { Text } from './Text'

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'ghost' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  /** Button content */
  children?: ReactNode
  /** Custom styles to apply */
  style?: ViewStyle | ViewStyle[]

  // Button specific props
  /** Button variant */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** Show loading spinner */
  loading?: boolean
  /** Full width button */
  fullWidth?: boolean
  /** Left icon component */
  leftIcon?: ReactNode
  /** Right icon component */
  rightIcon?: ReactNode
  /** Button text (alternative to children) */
  title?: string

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

  // Visual styling
  /** Background color - can be theme color key or custom hex/rgb */
  backgroundColor?: string
  /** Border radius from theme or custom number */
  borderRadius?: BorderRadius | number
  /** Apply theme shadow. Uses theme.shadow[name] */
  shadow?: ShadowType
  /** Custom shadow color */
  shadowColor?: string
  /** Apply border */
  borderWidth?: number
  /** Border color - can be theme color key or custom hex/rgb */
  borderColor?: string
  /** Apply opacity */
  opacity?: number

  // Layout shortcuts
  /** Apply flex: 1 */
  flex?: boolean | number
  /** Center align items and justify content */
  center?: boolean
  /** Center align items only */
  centerItems?: boolean
  /** Center justify content only */
  centerContent?: boolean
  /** Position absolute */
  absolute?: boolean
  /** Apply overflow hidden */
  hidden?: boolean

  // Theme color shortcuts (for custom variants)
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
 * Themed Button component that serves as a touchable action element
 *
 * Features:
 * - Theme-based spacing props using BoxKey system
 * - Multiple variants (primary, secondary, outlined, ghost, danger)
 * - Three sizes (small, medium, large) with proper text scaling
 * - Loading state with spinner
 * - Icon support (left/right)
 * - Theme-aware background colors and styling
 * - Layout utility props for common patterns
 * - Shadow and border support
 * - Full customization through style prop
 * - TypeScript support with proper intellisense
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="medium" onPress={handlePress}>
 *   Submit
 * </Button>
 *
 * <Button variant="outlined" loading marginTop="m" fullWidth>
 *   Loading...
 * </Button>
 *
 * <Button
 *   variant="secondary"
 *   leftIcon={<Icon name="plus" />}
 *   paddingHorizontal="l"
 * >
 *   Add Item
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  style,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  title,
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
  opacity,
  // Layout shortcuts
  flex,
  center,
  centerItems,
  centerContent,
  absolute,
  hidden,
  // Theme color shortcuts
  primary,
  secondary,
  success,
  warning,
  danger,
  disabled,
  ...props
}) => {
  const { theme } = useTheme()

  // Get size-specific styles
  const getSizeStyles = (): ViewStyle => {
    const sizes = {
      small: {
        minHeight: 32,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
      },
      medium: {
        minHeight: 44,
        paddingHorizontal: theme.spacing.m,
        paddingVertical: theme.spacing.s,
      },
      large: {
        minHeight: 56,
        paddingHorizontal: theme.spacing.ml,
        paddingVertical: theme.spacing.sm,
      },
    }
    return sizes[size]
  }

  // Get variant-specific styles
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        }
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          borderWidth: 0,
        }
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        }
      case 'danger':
        return {
          backgroundColor: theme.colors.danger,
          borderWidth: 0,
        }
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderWidth: 0,
        }
    }
  }

  // Get text color based on variant
  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return theme.colors.light
      case 'outlined':
      case 'ghost':
        return theme.colors.primary
      default:
        return theme.colors.light
    }
  }

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

    // Padding styles (only apply if not using size default)
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
        return (theme.colors as any)[backgroundColor] as string
      }
      return backgroundColor
    }

    if (primary) return theme.colors.primary as string
    if (secondary) return theme.colors.secondary as string
    if (success) return theme.colors.success as string
    if (warning) return theme.colors.warning as string
    if (danger) return theme.colors.danger as string

    // Use variant default
    return getVariantStyles().backgroundColor as string
  }

  // Get border color
  const getBorderColor = (): string | undefined => {
    if (!borderColor) return getVariantStyles().borderColor as string | undefined

    // Check if it's a theme color key
    if (borderColor in theme.colors) {
      return (theme.colors as any)[borderColor] as string
    }
    return borderColor
  }

  // Get border radius
  const getBorderRadius = (): number | undefined => {
    if (borderRadiusProp !== undefined) {
      if (typeof borderRadiusProp === 'number') {
        return borderRadiusProp
      }
      // Handle BorderRadius theme keys if needed
      return 8 // default
    }
    return 8 // default border radius
  }

  // Get shadow styles
  const getShadowStyles = (): ViewStyle => {
    if (!shadow) return {}
    const shadowStyle = theme.shadow[shadow]
    return {
      ...shadowStyle,
      ...(shadowColor && { shadowColor }),
    }
  }

  // Build the final style
  const finalStyle = combineStyles(
    // Base button styles
    {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: getBorderRadius(),
    },
    // Size styles
    getSizeStyles(),
    // Variant styles
    getVariantStyles(),
    // Spacing styles
    getSpacingStyles(),
    // Custom background color
    conditionalStyle(!!(backgroundColor || primary || secondary || success || warning || danger), {
      backgroundColor: getBackgroundColor(),
    }),
    // Border styles
    conditionalStyle(borderWidth !== undefined, { borderWidth }),
    conditionalStyle(borderColor !== undefined, { borderColor: getBorderColor() }),
    // Shadow styles
    getShadowStyles(),
    // Layout shortcuts
    conditionalStyle(!!fullWidth, { width: '100%' }),
    conditionalStyle(typeof flex === 'number', { flex: flex as number }),
    conditionalStyle(flex === true, { flex: 1 }),
    conditionalStyle(!!center, {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    }),
    conditionalStyle(!!centerItems, { alignItems: 'center' as const }),
    conditionalStyle(!!centerContent, { justifyContent: 'center' as const }),
    conditionalStyle(!!absolute, { position: 'absolute' as const }),
    conditionalStyle(!!hidden, { overflow: 'hidden' as const }),
    conditionalStyle(opacity !== undefined, { opacity }),
    conditionalStyle(!!disabled, { opacity: 0.6 }),
    style
  )

  // Get text variant based on size
  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'label'
      case 'medium':
        return 'button'
      case 'large':
        return 'bodyLarge'
      default:
        return 'button'
    }
  }

  const content = title || children

  return (
    <TouchableOpacity style={finalStyle} disabled={disabled || loading} {...props}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={{ marginRight: content ? theme.spacing.xs : 0 }}
        />
      )}

      {!loading && leftIcon && <>{leftIcon}</>}

      {content && (
        <Text
          variant={getTextVariant()}
          color={getTextColor()}
          style={{
            marginLeft: !loading && leftIcon ? theme.spacing.xs : 0,
            marginRight: rightIcon ? theme.spacing.xs : 0,
          }}
        >
          {content}
        </Text>
      )}

      {rightIcon && <>{rightIcon}</>}
    </TouchableOpacity>
  )
}

// Convenience components for common variants
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="primary" {...props} />
)

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="secondary" {...props} />
)

export const OutlinedButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="outlined" {...props} />
)

export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="ghost" {...props} />
)

export const DangerButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="danger" {...props} />
)
