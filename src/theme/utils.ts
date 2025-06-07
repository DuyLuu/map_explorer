import { ViewStyle, TextStyle, ImageStyle } from 'react-native'
import { Theme, DarkTheme, ThemeMode, PALLETS } from './constants'
import { layout, getResponsiveSize } from './layout'

// Get theme based on mode
export const getTheme = (mode: ThemeMode = 'light') => {
  return mode === 'dark' ? DarkTheme : Theme
}

// Color utility functions
export const hexToRgba = (hex: string, opacity: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return hex

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const adjustOpacity = (color: string, opacity: number): string => {
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color.replace(/[\d\.]+\)$/g, `${opacity})`)
  }

  // Handle hex colors
  if (color.startsWith('#')) {
    return hexToRgba(color, opacity)
  }

  // Return as is for other formats
  return color
}

export const darkenColor = (color: string, amount: number = 0.1): string => {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.round(255 * amount))
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.round(255 * amount))
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.round(255 * amount))

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
      .toString(16)
      .padStart(2, '0')}`
  }

  return color
}

export const lightenColor = (color: string, amount: number = 0.1): string => {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(255 * amount))
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(255 * amount))
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(255 * amount))

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
      .toString(16)
      .padStart(2, '0')}`
  }

  return color
}

// Spacing utilities
export const getSpacing = (multiplier: number = 1, baseUnit: number = 8): number => {
  return baseUnit * multiplier
}

export const createSpacing = (top?: number, right?: number, bottom?: number, left?: number) => {
  const spacing = Theme.spacing

  return {
    paddingTop: top !== undefined ? spacing.xs * top : undefined,
    paddingRight: right !== undefined ? spacing.xs * right : undefined,
    paddingBottom: bottom !== undefined ? spacing.xs * bottom : undefined,
    paddingLeft: left !== undefined ? spacing.xs * left : undefined,
  }
}

export const createMargin = (top?: number, right?: number, bottom?: number, left?: number) => {
  const spacing = Theme.spacing

  return {
    marginTop: top !== undefined ? spacing.xs * top : undefined,
    marginRight: right !== undefined ? spacing.xs * right : undefined,
    marginBottom: bottom !== undefined ? spacing.xs * bottom : undefined,
    marginLeft: left !== undefined ? spacing.xs * left : undefined,
  }
}

// Shadow utilities
export const createShadow = (
  color: string = PALLETS.DARK_BLUE,
  offset: { width: number; height: number } = { width: 0, height: 2 },
  opacity: number = 0.1,
  radius: number = 4,
  elevation: number = 2
): ViewStyle => ({
  shadowColor: color,
  shadowOffset: offset,
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation: elevation,
})

// Platform-specific utilities
export const createPlatformStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  ios: T,
  android: T,
  web?: T
): T => {
  const Platform = require('react-native').Platform

  if (Platform.OS === 'ios') return ios
  if (Platform.OS === 'android') return android
  if (Platform.OS === 'web' && web) return web

  return ios // fallback
}

// Responsive utilities
export const createResponsiveStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  small: T,
  medium?: T,
  large?: T
): T => {
  const { width } = layout.screen

  if (width >= Theme.breakpoints.tablet && large) return large
  if (width >= Theme.breakpoints.phone && medium) return medium

  return small
}

// Theme-aware style creators
export const createThemedStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  lightStyle: T,
  darkStyle: T,
  mode: ThemeMode = 'light'
): T => {
  return mode === 'dark' ? darkStyle : lightStyle
}

// Animation utilities
export const createTransition = (
  property: string,
  duration: number = 300,
  easing: string = 'ease-in-out'
) => ({
  transition: `${property} ${duration}ms ${easing}`,
})

// Layout utilities
export const centerContent: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
}

export const fillContainer: ViewStyle = {
  flex: 1,
}

export const absoluteFill: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export const row: ViewStyle = {
  flexDirection: 'row',
}

export const column: ViewStyle = {
  flexDirection: 'column',
}

export const spaceBetween: ViewStyle = {
  justifyContent: 'space-between',
}

export const spaceAround: ViewStyle = {
  justifyContent: 'space-around',
}

export const spaceEvenly: ViewStyle = {
  justifyContent: 'space-evenly',
}

export const alignStart: ViewStyle = {
  alignItems: 'flex-start',
}

export const alignEnd: ViewStyle = {
  alignItems: 'flex-end',
}

export const alignCenter: ViewStyle = {
  alignItems: 'center',
}

export const justifyStart: ViewStyle = {
  justifyContent: 'flex-start',
}

export const justifyEnd: ViewStyle = {
  justifyContent: 'flex-end',
}

export const justifyCenter: ViewStyle = {
  justifyContent: 'center',
}

// Style composition utilities
export const combineStyles = <T extends ViewStyle | TextStyle | ImageStyle>(
  ...styles: (T | T[] | undefined | null | false)[]
): T => {
  const flatStyles = styles.filter(Boolean).flat().filter(Boolean) as T[]

  return Object.assign({}, ...flatStyles)
}

// Conditional styling
export const conditionalStyle = <T extends ViewStyle | TextStyle | ImageStyle>(
  condition: boolean,
  trueStyle: T,
  falseStyle?: T
): T | {} => {
  if (condition) return trueStyle
  if (falseStyle) return falseStyle
  return {}
}

// Percentage-based sizing
export const percentage = (value: number): string => `${value}%`

// Screen percentage utilities
export const screenWidth = (percentage: number): number => {
  return (layout.screen.width * percentage) / 100
}

export const screenHeight = (percentage: number): number => {
  return (layout.screen.height * percentage) / 100
}

// Safe area utilities
export const withSafeArea = (style: ViewStyle): ViewStyle => ({
  ...style,
  paddingTop: (typeof style.paddingTop === 'number' ? style.paddingTop : 0) + layout.safeArea.top,
  paddingBottom:
    (typeof style.paddingBottom === 'number' ? style.paddingBottom : 0) + layout.safeArea.bottom,
})

// Typography utilities
export const createTextShadow = (
  color: string = PALLETS.BLACK_OPACITY(0.3),
  offset: { width: number; height: number } = { width: 1, height: 1 },
  radius: number = 2
): TextStyle => ({
  textShadowColor: color,
  textShadowOffset: offset,
  textShadowRadius: radius,
})

// Utility type for style functions
export type StyleFunction<T = ViewStyle> = (theme: typeof Theme) => T

// Apply theme to style function
export const applyTheme = <T = ViewStyle>(
  styleFunction: StyleFunction<T>,
  mode: ThemeMode = 'light'
): T => {
  const theme = getTheme(mode)
  return styleFunction(theme)
}
