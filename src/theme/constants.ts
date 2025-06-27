export enum FontFamily {
  SERIF_BOLD = 'System', // Using system font for serif bold
  SERIF_REGULAR = 'System', // Using system font for serif regular
  SANS_SERIF_BOLD = 'System', // Using system font for sans-serif bold
  SANS_SERIF_REGULAR = 'System', // Using system font for sans-serif regular
  SANS_SERIF_LIGHT = 'System' // Using system font for sans-serif light
}

export const PALLETS = {
  // Adventurer's Journal Palette
  NAVY_BLUE: '#1A3154', // Primary: Deep navy blue
  PARCHMENT: '#F5F0E1', // Primary: Off-white/parchment
  SEPIA: '#704214', // Primary: Sepia tone

  ACCENT_TEAL: '#00A896', // Accent: Vibrant teal
  ACCENT_ORANGE: '#FF6B35', // Accent: Burnt orange
  ACCENT_RED: '#E63946', // Accent: Deep red

  CHARCOAL: '#333333', // Text: Dark charcoal

  // Existing colors that might still be useful or need re-evaluation
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  LIGHT_GRAY: '#A8B5C7',
  GRAY: '#778BA8',
  DARK_GRAY: '#6B80A0',
  LIGHT_BLUE: '#F3F8FC', // Could be used for subtle backgrounds
  RED: '#f8333c', // For danger/error
  GREEN: '#25A278', // For success
  YELLOW: '#FDCC6D', // For warning

  // Add missing colors referenced in variants
  ORANGE: '#FF6B35', // Same as ACCENT_ORANGE
  DARK_BLUE: '#1A3154', // Same as NAVY_BLUE
  LIGHT_ORANGE: '#FFB896', // Light version of orange
  DARK_ORANGE: '#CC5228', // Dark version of orange

  // Opacity functions
  NAVY_BLUE_OPACITY: (o: number) => `rgba(26, 49, 84, ${o})`,
  PARCHMENT_OPACITY: (o: number) => `rgba(245, 240, 225, ${o})`,
  CHARCOAL_OPACITY: (o: number) => `rgba(51, 51, 51, ${o})`,
  WHITE_OPACITY: (o: number) => `rgba(255, 255, 255, ${o})`,
  BLACK_OPACITY: (o: number) => `rgba(0, 0, 0, ${o})`
}

export const Theme = {
  // define static theme here
  shadowColor: {
    popupBackground: PALLETS.PARCHMENT // Adjusted for new theme
  },
  shadow: {
    default: {
      shadowColor: PALLETS.NAVY_BLUE, // Using new primary dark color
      shadowOffset: {
        width: 0.5,
        height: 2
      },
      shadowRadius: 5,
      elevation: 2,
      shadowOpacity: 0.15
    },
    light: {
      shadowColor: PALLETS.NAVY_BLUE,
      shadowOffset: {
        width: 0.25,
        height: 1
      },
      shadowRadius: 2,
      elevation: 1,
      shadowOpacity: 0.125
    },
    dark: {
      shadowColor: PALLETS.NAVY_BLUE,
      shadowOffset: {
        width: 0.25,
        height: 2
      },
      shadowRadius: 2,
      elevation: 4,
      shadowOpacity: 0.25
    },
    darker: {
      shadowColor: PALLETS.NAVY_BLUE,
      shadowOffset: { width: 0.5, height: 6 },
      shadowRadius: 8,
      elevation: 4,
      shadowOpacity: 0.25
    },
    blackDark: {
      shadowColor: PALLETS.CHARCOAL, // Using new text color for dark shadows
      shadowOffset: { width: 0.5, height: 6 },
      shadowRadius: 8,
      elevation: 9,
      shadowOpacity: 1
    }
  },
  spacing: {
    xxl: 40,
    xl: 32,
    l: 24,
    ml: 20,
    m: 16,
    sm: 12,
    s: 8,
    xs: 4,
    xxs: 2
  },
  breakpoints: {
    smallPhone: 0,
    phone: 321,
    tablet: 768
  },
  responsiveLayout: {
    smallPhone: 0,
    phone: 0,
    tablet: 576
  },
  font: {
    serifBold: FontFamily.SERIF_BOLD,
    serifRegular: FontFamily.SERIF_REGULAR,
    sansSerifBold: FontFamily.SANS_SERIF_BOLD,
    sansSerifRegular: FontFamily.SANS_SERIF_REGULAR,
    sansSerifLight: FontFamily.SANS_SERIF_LIGHT
  },

  // define dynamic theme here
  colors: {
    // Core theme colors
    primary: PALLETS.NAVY_BLUE,
    secondary: PALLETS.PARCHMENT,
    accent: PALLETS.ACCENT_TEAL, // Default accent
    text: PALLETS.CHARCOAL,
    subText: PALLETS.DARK_GRAY, // Lighter charcoal or dark gray

    // Backgrounds
    background: PALLETS.PARCHMENT,
    popupBackground: PALLETS.WHITE, // Still white for popups

    // Specific UI elements
    mainText: PALLETS.CHARCOAL,
    breakLine: PALLETS.NAVY_BLUE_OPACITY(0.1),
    headerGradient: [PALLETS.NAVY_BLUE, PALLETS.NAVY_BLUE], // Solid color for now, can be gradient later
    loadingGradient: [PALLETS.PARCHMENT_OPACITY(0.5), PALLETS.PARCHMENT_OPACITY(0.1)],
    highlight: PALLETS.ACCENT_ORANGE, // Using one of the accents for highlight
    danger: PALLETS.RED,
    success: PALLETS.GREEN,
    warning: PALLETS.YELLOW,
    borderCover: PALLETS.NAVY_BLUE_OPACITY(0.1),
    iconButtonBackground: PALLETS.WHITE_OPACITY(0.1),

    // Existing colors re-mapped or kept if still relevant
    white: PALLETS.WHITE,
    black: PALLETS.BLACK,
    lightGray: PALLETS.LIGHT_GRAY,
    gray: PALLETS.GRAY,
    darkGray: PALLETS.DARK_GRAY,
    lightBlue: PALLETS.LIGHT_BLUE, // Can be used for subtle background elements

    // Add commonly referenced colors
    blue: PALLETS.NAVY_BLUE,
    light: PALLETS.PARCHMENT,
    baseBlack: PALLETS.CHARCOAL,

    // Opacity variants for common colors
    navyBlueOpacity: PALLETS.NAVY_BLUE_OPACITY,
    parchmentOpacity: PALLETS.PARCHMENT_OPACITY,
    charcoalOpacity: PALLETS.CHARCOAL_OPACITY,
    whiteOpacity: PALLETS.WHITE_OPACITY,
    blackOpacity: PALLETS.BLACK_OPACITY,

    // Placeholder for gradients if needed later
    primaryGradient: [PALLETS.NAVY_BLUE, PALLETS.SEPIA],
    secondaryGradient: [PALLETS.PARCHMENT, PALLETS.WHITE]

    // Remove specific navy/grey/white objects if not needed, or re-evaluate
    // For now, keeping them flat for simplicity
  }
}

export const DarkTheme = {
  ...Theme,
  shadowColor: {
    popupBackground: PALLETS.CHARCOAL // Darker background for popups in dark mode
  },
  // define dynamic theme here
  colors: {
    ...Theme.colors,
    mainText: PALLETS.PARCHMENT, // Light text on dark background
    subText: PALLETS.LIGHT_GRAY,
    background: PALLETS.CHARCOAL, // Dark background
    popupBackground: PALLETS.SEPIA, // Sepia for popups in dark mode
    breakLine: PALLETS.PARCHMENT_OPACITY(0.2),
    headerGradient: [PALLETS.CHARCOAL, PALLETS.NAVY_BLUE],
    loadingGradient: [PALLETS.CHARCOAL_OPACITY(0.5), PALLETS.CHARCOAL_OPACITY(0.1)],
    borderCover: PALLETS.PARCHMENT_OPACITY(0.2),
    iconButtonBackground: PALLETS.BLACK_OPACITY(0.2),
    success: PALLETS.GREEN // Keep success green
  }
}

export type BreakPoint = keyof typeof Theme.breakpoints
export type Spacing = keyof typeof Theme.spacing
export type Color = keyof typeof Theme.colors
export type ShadowType = keyof typeof Theme.shadow

export const ThemeModeArray = ['light', 'dark'] as const
export type ThemeMode = (typeof ThemeModeArray)[number]
export type ThemeModeConfig = ThemeMode | 'system'
export type ThemeSource = 'mode' | 'tabMode'

export enum BoxKey {
  margin = 'margin',
  marginHorizontal = 'marginHorizontal',
  marginVertical = 'marginVertical',
  marginTop = 'marginTop',
  marginBottom = 'marginBottom',
  marginRight = 'marginRight',
  marginLeft = 'marginLeft',

  padding = 'padding',
  paddingHorizontal = 'paddingHorizontal',
  paddingVertical = 'paddingVertical',
  paddingTop = 'paddingTop',
  paddingBottom = 'paddingBottom',
  paddingRight = 'paddingRight',
  paddingLeft = 'paddingLeft'
}
