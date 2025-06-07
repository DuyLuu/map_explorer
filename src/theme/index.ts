// Core theme constants
export {
  FontFamily,
  PALLETS,
  Theme,
  DarkTheme,
  ThemeModeArray,
  type BreakPoint,
  type Spacing,
  type Color,
  type ShadowType,
  type ThemeMode,
  type ThemeModeConfig,
  type ThemeSource,
} from './constants'

// Import for internal use
import { Theme, DarkTheme } from './constants'

// Typography system
export {
  fontSize,
  lineHeight,
  letterSpacing,
  textVariants,
  getTextStyle,
  type FontSize,
  type LineHeight,
  type LetterSpacing,
  type TextVariant,
} from './typography'

// Layout system
export {
  borderRadius,
  iconSizes,
  layout,
  zIndex,
  duration,
  easing,
  getResponsiveSize,
  isTablet,
  isSmallScreen,
  type BorderRadius,
  type IconSize,
  type Duration,
  type Easing,
  type ZIndex,
} from './layout'

// Component variants
export {
  buttonVariants,
  inputVariants,
  cardVariants,
  badgeVariants,
  chipVariants,
  loadingVariants,
  type ButtonSize,
  type ButtonStyle,
  type InputSize,
  type InputState,
  type CardStyle,
  type CardSize,
  type BadgeSize,
  type BadgeStyle,
  type ChipSize,
  type ChipStyle,
  type LoadingSize,
  type LoadingColor,
} from './variants'

// Utility functions
export {
  getTheme,
  hexToRgba,
  adjustOpacity,
  darkenColor,
  lightenColor,
  getSpacing,
  createSpacing,
  createMargin,
  createShadow,
  createPlatformStyle,
  createResponsiveStyle,
  createThemedStyle,
  createTransition,
  centerContent,
  fillContainer,
  absoluteFill,
  row,
  column,
  spaceBetween,
  spaceAround,
  spaceEvenly,
  alignStart,
  alignEnd,
  alignCenter,
  justifyStart,
  justifyEnd,
  justifyCenter,
  combineStyles,
  conditionalStyle,
  percentage,
  screenWidth,
  screenHeight,
  withSafeArea,
  createTextShadow,
  applyTheme,
  type StyleFunction,
} from './utils'

// Theme context and hooks
export {
  ThemeProvider,
  useTheme,
  useThemedStyles,
  withTheme,
  useResponsiveValue,
  useSystemTheme,
  useStatusBarStyle,
} from './context'

// Re-export default theme for convenience
export { Theme as defaultTheme, DarkTheme as defaultDarkTheme }

// Common style presets for quick usage
export const commonStyles = {
  // Flex layouts
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' as const },
  flexColumn: { flexDirection: 'column' as const },
  flexCenter: { justifyContent: 'center' as const, alignItems: 'center' as const },
  flexBetween: { justifyContent: 'space-between' as const },
  flexAround: { justifyContent: 'space-around' as const },
  flexEvenly: { justifyContent: 'space-evenly' as const },

  // Positioning
  absolute: { position: 'absolute' as const },
  relative: { position: 'relative' as const },
  absoluteFill: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Text alignment
  textCenter: { textAlign: 'center' as const },
  textLeft: { textAlign: 'left' as const },
  textRight: { textAlign: 'right' as const },

  // Overflow
  hidden: { overflow: 'hidden' as const },

  // Full width/height
  fullWidth: { width: '100%' },
  fullHeight: { height: '100%' },

  // Opacity variants
  opacity50: { opacity: 0.5 },
  opacity75: { opacity: 0.75 },
  opacity90: { opacity: 0.9 },

  // Common shadows
  shadowLight: Theme.shadow.light,
  shadowDefault: Theme.shadow.default,
  shadowDark: Theme.shadow.dark,
} as const
