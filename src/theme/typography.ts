import { TextStyle } from 'react-native'
import { FontFamily, PALLETS } from './constants'

// Font sizes following a modular scale
export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 48,
  '7xl': 64,
} as const

// Line heights corresponding to font sizes
export const lineHeight = {
  xs: 14,
  sm: 16,
  base: 20,
  md: 24,
  lg: 28,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
  '5xl': 44,
  '6xl': 56,
  '7xl': 72,
} as const

// Letter spacing values
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const

// Text variants for common use cases
export const textVariants = {
  // Headers
  h1: {
    fontFamily: FontFamily.XBOLD,
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight['5xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  h2: {
    fontFamily: FontFamily.BOLD,
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight['4xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  h3: {
    fontFamily: FontFamily.BOLD,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  h4: {
    fontFamily: FontFamily.SEMI_BOLD,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  h5: {
    fontFamily: FontFamily.SEMI_BOLD,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  h6: {
    fontFamily: FontFamily.SEMI_BOLD,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  body: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  bodySmall: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Labels and captions
  label: {
    fontFamily: FontFamily.SEMI_BOLD,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  caption: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Buttons
  buttonLarge: {
    fontFamily: FontFamily.SEMI_BOLD,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  button: {
    fontFamily: FontFamily.SEMI_BOLD,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  buttonSmall: {
    fontFamily: FontFamily.SEMI_BOLD,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // Special text styles
  overline: {
    fontFamily: FontFamily.CAPITALIZE_MEDIUM,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  } as TextStyle,

  subtitle1: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  subtitle2: {
    fontFamily: FontFamily.MEDIUM,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Display text (for large hero text)
  displayLarge: {
    fontFamily: FontFamily.XBOLD,
    fontSize: fontSize['7xl'],
    lineHeight: lineHeight['7xl'],
    letterSpacing: letterSpacing.tighter,
  } as TextStyle,

  displayMedium: {
    fontFamily: FontFamily.XBOLD,
    fontSize: fontSize['6xl'],
    lineHeight: lineHeight['6xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  displaySmall: {
    fontFamily: FontFamily.BOLD,
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight['5xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,
} as const

// Typography utility types
export type FontSize = keyof typeof fontSize
export type LineHeight = keyof typeof lineHeight
export type LetterSpacing = keyof typeof letterSpacing
export type TextVariant = keyof typeof textVariants

// Helper function to get text style with color
export const getTextStyle = (
  variant: TextVariant,
  color?: string,
  additionalStyles?: TextStyle
): TextStyle => ({
  ...textVariants[variant],
  ...(color && { color }),
  ...additionalStyles,
})
