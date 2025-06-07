import React, { ReactNode } from 'react'
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native'
import {
  useTheme,
  textVariants,
  TextVariant,
  combineStyles,
  conditionalStyle,
  FontFamily,
  Spacing,
} from '../theme'
import { BoxKey } from '../theme/constants'

export interface TextProps extends Omit<RNTextProps, 'style'> {
  /** Text variant from the design system */
  variant?: TextVariant
  /** Text color - can be theme color key or custom hex/rgb */
  color?: string
  /** Center align the text */
  center?: boolean
  /** Custom styles to apply */
  style?: TextStyle | TextStyle[]
  /** Text content */
  children: ReactNode
  /** Apply opacity to the text */
  opacity?: number
  /** Make text selectable */
  selectable?: boolean
  /** Uppercase transform */
  uppercase?: boolean
  /** Lowercase transform */
  lowercase?: boolean
  /** Capitalize transform */
  capitalize?: boolean
  /** Apply underline */
  underline?: boolean
  /** Apply line-through */
  strikethrough?: boolean
  /** Weight override (if not using variant) */
  weight?: 'normal' | 'bold' | 'semi-bold' | 'medium' | 'light'
  /** Size override (if not using variant) */
  size?: number
  /** Line height override */
  lineHeight?: number
  /** Letter spacing override */
  letterSpacing?: number
  /** Theme-aware color shortcuts */
  primary?: boolean
  secondary?: boolean
  success?: boolean
  warning?: boolean
  danger?: boolean
  muted?: boolean

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
}

/**
 * Themed Text component that applies the design system
 *
 * Features:
 * - Uses predefined text variants for consistency
 * - Automatic theme-aware colors
 * - Theme-based spacing props using BoxKey system
 * - Utility props for common text styling
 * - Full customization through style prop
 * - TypeScript support with proper intellisense
 *
 * @example
 * ```tsx
 * <Text variant="h1" primary>Main Title</Text>
 * <Text variant="body" color="#FF0000">Custom color</Text>
 * <Text variant="button" center uppercase marginTop="m">BUTTON TEXT</Text>
 * <Text variant="caption" paddingHorizontal="l" marginBottom="s">Spaced text</Text>
 * ```
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  center,
  style,
  children,
  opacity,
  selectable,
  uppercase,
  lowercase,
  capitalize,
  underline,
  strikethrough,
  weight,
  size,
  lineHeight,
  letterSpacing,
  primary,
  secondary,
  success,
  warning,
  danger,
  muted,
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
  ...props
}) => {
  const { theme } = useTheme()

  // Get base variant style
  const variantStyle = textVariants[variant]

  // Determine color based on props
  const getTextColor = (): string => {
    if (color) return color
    if (primary) return theme.colors.primary
    if (secondary) return theme.colors.secondary
    if (success) return theme.colors.success
    if (warning) return theme.colors.warning
    if (danger) return theme.colors.danger
    if (muted) return theme.colors.subText

    // Default to theme main text color
    return theme.colors.mainText
  }

  // Get font family based on weight
  const getFontFamily = (): string | undefined => {
    if (!weight) return undefined

    switch (weight) {
      case 'bold':
        return FontFamily.BOLD
      case 'semi-bold':
        return FontFamily.SEMI_BOLD
      case 'medium':
        return FontFamily.MEDIUM
      case 'light':
        return FontFamily.LIGHT
      default:
        return FontFamily.MEDIUM
    }
  }

  // Create spacing styles from BoxKey props
  const getSpacingStyles = (): TextStyle => {
    const spacingStyles: TextStyle = {}

    // Margin styles
    if (margin) spacingStyles.margin = theme.spacing[margin]
    if (marginHorizontal) spacingStyles.marginHorizontal = theme.spacing[marginHorizontal]
    if (marginVertical) spacingStyles.marginVertical = theme.spacing[marginVertical]
    if (marginTop) spacingStyles.marginTop = theme.spacing[marginTop]
    if (marginBottom) spacingStyles.marginBottom = theme.spacing[marginBottom]
    if (marginRight) spacingStyles.marginRight = theme.spacing[marginRight]
    if (marginLeft) spacingStyles.marginLeft = theme.spacing[marginLeft]

    // Padding styles
    if (padding) spacingStyles.padding = theme.spacing[padding]
    if (paddingHorizontal) spacingStyles.paddingHorizontal = theme.spacing[paddingHorizontal]
    if (paddingVertical) spacingStyles.paddingVertical = theme.spacing[paddingVertical]
    if (paddingTop) spacingStyles.paddingTop = theme.spacing[paddingTop]
    if (paddingBottom) spacingStyles.paddingBottom = theme.spacing[paddingBottom]
    if (paddingRight) spacingStyles.paddingRight = theme.spacing[paddingRight]
    if (paddingLeft) spacingStyles.paddingLeft = theme.spacing[paddingLeft]

    return spacingStyles
  }

  // Build the final style
  const finalStyle = combineStyles(
    variantStyle,
    {
      color: getTextColor(),
    },
    getSpacingStyles(),
    conditionalStyle(!!center, { textAlign: 'center' as const }),
    conditionalStyle(opacity !== undefined, { opacity }),
    conditionalStyle(!!uppercase, { textTransform: 'uppercase' as const }),
    conditionalStyle(!!lowercase, { textTransform: 'lowercase' as const }),
    conditionalStyle(!!capitalize, { textTransform: 'capitalize' as const }),
    conditionalStyle(!!underline, { textDecorationLine: 'underline' as const }),
    conditionalStyle(!!strikethrough, { textDecorationLine: 'line-through' as const }),
    conditionalStyle(!!weight, {
      fontFamily: getFontFamily(),
    }),
    conditionalStyle(!!size, { fontSize: size }),
    conditionalStyle(!!lineHeight, { lineHeight }),
    conditionalStyle(!!letterSpacing, { letterSpacing }),
    style
  )

  return (
    <RNText style={finalStyle} selectable={selectable} {...props}>
      {children}
    </RNText>
  )
}

// Convenience components for common variants
export const Title = (props: Omit<TextProps, 'variant'>) => <Text variant="h1" {...props} />

export const Heading = (props: Omit<TextProps, 'variant'>) => <Text variant="h2" {...props} />

export const Subheading = (props: Omit<TextProps, 'variant'>) => <Text variant="h3" {...props} />

export const Body = (props: Omit<TextProps, 'variant'>) => <Text variant="body" {...props} />

export const BodyLarge = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="bodyLarge" {...props} />
)

export const BodySmall = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="bodySmall" {...props} />
)

export const Label = (props: Omit<TextProps, 'variant'>) => <Text variant="label" {...props} />

export const Caption = (props: Omit<TextProps, 'variant'>) => <Text variant="caption" {...props} />

export const ButtonText = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="button" {...props} />
)

export const DisplayText = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="displayLarge" {...props} />
)

export default Text
