import { Dimensions } from 'react-native'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

// Border radius values
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  base: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const

// Icon sizes
export const iconSizes = {
  xs: 12,
  sm: 16,
  base: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const

// Common layout dimensions
export const layout = {
  // Screen dimensions
  screen: {
    width: screenWidth,
    height: screenHeight,
  },

  // Header heights
  header: {
    default: 56,
    large: 80,
    small: 44,
  },

  // Tab bar
  tabBar: {
    height: 60,
    iconSize: iconSizes.md,
  },

  // Button heights
  button: {
    small: 32,
    medium: 40,
    large: 48,
    extraLarge: 56,
  },

  // Input heights
  input: {
    small: 36,
    medium: 44,
    large: 52,
  },

  // Card dimensions
  card: {
    minHeight: 80,
    borderRadius: borderRadius.lg,
    padding: 16,
  },

  // Modal dimensions
  modal: {
    maxWidth: screenWidth * 0.9,
    borderRadius: borderRadius.xl,
    padding: 24,
  },

  // Bottom sheet
  bottomSheet: {
    borderRadius: borderRadius['2xl'],
    handleWidth: 36,
    handleHeight: 4,
  },

  // List item
  listItem: {
    height: 56,
    padding: 16,
  },

  // Avatar sizes
  avatar: {
    xs: 24,
    sm: 32,
    base: 40,
    md: 48,
    lg: 64,
    xl: 80,
    '2xl': 96,
  },

  // Common widths and heights
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },

  // Safe area padding
  safeArea: {
    top: 44, // iOS status bar height
    bottom: 34, // iOS home indicator height
  },

  // Container max widths
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
} as const

// Z-index values for layering
export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const

// Animation durations
export const duration = {
  fastest: 100,
  fast: 200,
  normal: 300,
  slow: 500,
  slowest: 800,
} as const

// Animation easing curves
export const easing = {
  linear: [0, 0, 1, 1] as const,
  ease: [0.25, 0.1, 0.25, 1] as const,
  easeIn: [0.42, 0, 1, 1] as const,
  easeOut: [0, 0, 0.58, 1] as const,
  easeInOut: [0.42, 0, 0.58, 1] as const,
  // Custom easing for smooth animations
  smooth: [0.4, 0, 0.2, 1] as const,
  spring: [0.68, -0.55, 0.265, 1.55] as const,
} as const

// Utility types
export type BorderRadius = keyof typeof borderRadius
export type IconSize = keyof typeof iconSizes
export type Duration = keyof typeof duration
export type Easing = keyof typeof easing
export type ZIndex = keyof typeof zIndex

// Helper functions
export const getResponsiveSize = (size: number, scale: number = 1): number => {
  const baseWidth = 375 // iPhone X width as base
  const scaleFactor = (screenWidth / baseWidth) * scale
  return Math.round(size * scaleFactor)
}

export const isTablet = (): boolean => {
  return screenWidth >= 768
}

export const isSmallScreen = (): boolean => {
  return screenWidth < 375
}
