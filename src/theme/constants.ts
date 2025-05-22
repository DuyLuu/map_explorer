export enum FontFamily {
  XBOLD = 'SVN-GilroyXBold',
  BOLD = 'SVN-GilroyBold',
  SEMI_BOLD = 'SVN-GilroySemiBold',
  MEDIUM = 'SVN-GilroyMedium',
  LIGHT = 'SVN-GilroyLight',
  CAPITALIZE_MEDIUM = 'Bebas Neue Pro Regular',
  CAPITALIZE_BOLD = 'Bebas Neue Pro Bold',
}

export const PALLETS = {
  BASE_BLACK: '#121212',
  BLACK_GRAY: '#272E35',
  BLACK_GRAY_OPACITY: (o: number) => `rgba(39, 46, 53, ${o})`,

  WHITE: '#fff',
  WHITE_OPACITY: (o: number) => `rgba(255,255,255, ${o})`,
  BLACK: '#000',
  BLACK_OPACITY: (o: number) => `rgba(0,0,0, ${o})`,
  LIGHT_ORANGE: '#FFBFA8',
  ORANGE: '#F47D42',
  DARK_ORANGE: '#ED7873',
  ORANGE_OPACITY: (o: number) => `rgba(239,143,109, ${o})`,
  SEA_GREEN: '#00f3c5',
  DARK_BLUE: '#1a3154',
  DARK_BLUE_OPACITY: (o: number) => `rgba(26,49,84, ${o})`,
  LIGHT_GRAY: '#A8B5C7',
  LIGHTER_GRAY: '#A5A7A9',
  GRAY: '#778BA8',
  GRAY_DARK: '#6B80A0',
  GRAY_DARKER: '#53637F',
  LIGHT_BLUE: '#F3F8FC',
  LIGHT_DARK: '#DBEAFA',
  RED: '#f8333c',
  GREEN: '#25A278',
  YELLOW: '#FDCC6D',
  GRADIENT_DARK_BLUE: ['#9ECEF9', '#2B3D5F'],
  GRADIENT_ORANGE: ['#F27672', '#F2A766'],
  GRADIENT_SILVER: ['#7497C145', '#647093E6'],
  PRO_PREMIUM_GRADIENT: ['#EE3E6F', '#662A94'],
  REGION: '#F27672',
  PRO: '#A76DEF',
  DARK_BLACK_BLUE: '#1A1C20',
}

export const Theme = {
  // define static theme here
  shadowColor: {
    popupBackground: '#E8EAEE',
  },
  shadow: {
    default: {
      shadowColor: PALLETS.DARK_BLUE,
      shadowOffset: {
        width: 0.5,
        height: 2,
      },
      shadowRadius: 5,
      elevation: 2,
      shadowOpacity: 0.15,
    },
    light: {
      shadowColor: PALLETS.DARK_BLUE,
      shadowOffset: {
        width: 0.25,
        height: 1,
      },
      shadowRadius: 2,
      elevation: 1,
      shadowOpacity: 0.125,
    },
    dark: {
      shadowColor: PALLETS.DARK_BLUE,
      shadowOffset: {
        width: 0.25,
        height: 2,
      },
      shadowRadius: 2,
      elevation: 4,
      shadowOpacity: 0.25,
    },
    darker: {
      shadowColor: PALLETS.DARK_BLUE,
      shadowOffset: { width: 0.5, height: 6 },
      shadowRadius: 8,
      elevation: 4,
      shadowOpacity: 0.25,
    },
    blackDark: {
      shadowColor: PALLETS.BASE_BLACK,
      shadowOffset: { width: 0.5, height: 6 },
      shadowRadius: 8,
      elevation: 9,
      shadowOpacity: 1,
    },
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
    xxs: 2,
  },
  breakpoints: {
    smallPhone: 0,
    phone: 321,
    tablet: 768,
  },
  responsiveLayout: {
    smallPhone: 0,
    phone: 0,
    tablet: 576,
  },
  font: {
    bold: FontFamily.BOLD,
    xbold: FontFamily.XBOLD,
    semiBold: FontFamily.SEMI_BOLD,
    medium: FontFamily.MEDIUM,
    light: FontFamily.LIGHT,
    capitalizeMedium: FontFamily.CAPITALIZE_MEDIUM,
    capitalizeBold: FontFamily.CAPITALIZE_BOLD,
  },

  // define dynamic theme here
  colors: {
    baseBlack: PALLETS.BASE_BLACK,
    blackGray: PALLETS.BLACK_GRAY,
    blackGrayOpacity: PALLETS.BLACK_GRAY_OPACITY,

    light: PALLETS.WHITE,
    lightOpacity: PALLETS.WHITE_OPACITY,

    black: PALLETS.BLACK,
    blackOpacity: PALLETS.BLACK_OPACITY,

    lightPrimary: PALLETS.LIGHT_ORANGE,
    darkPrimary: PALLETS.DARK_ORANGE,
    primaryOpacity: PALLETS.ORANGE_OPACITY,

    region: PALLETS.REGION,
    secondary: PALLETS.SEA_GREEN,
    proPremiumGradient: PALLETS.PRO_PREMIUM_GRADIENT,
    pro: PALLETS.PRO,

    dark: PALLETS.DARK_BLUE,
    darkOpacity: PALLETS.DARK_BLUE_OPACITY,
    darkGradient: PALLETS.GRADIENT_DARK_BLUE,
    silverGradient: PALLETS.GRADIENT_SILVER,

    lightGray: PALLETS.LIGHT_GRAY,
    lighterGray: PALLETS.LIGHTER_GRAY,
    gray: PALLETS.GRAY,
    grayDark: PALLETS.GRAY_DARK,
    grayDarker: PALLETS.GRAY_DARKER,

    lightDark: PALLETS.LIGHT_DARK,
    skeleton: '#E1E8EB',

    // theme colors
    primaryGradient: PALLETS.GRADIENT_ORANGE,
    mainText: PALLETS.DARK_BLUE,
    subText: PALLETS.GRAY_DARK,
    background: PALLETS.LIGHT_BLUE,
    popupBackground: PALLETS.WHITE,
    breakLine: 'rgba(26, 49, 84, 0.1)',
    headerGradient: ['#779ECB', '#2B3D5F'],
    loadingGradient: ['rgba(225, 232, 235, 0.5)', 'rgba(225, 232, 235, 0.1)'],
    primary: PALLETS.ORANGE,
    highlight: '#F47D42',
    danger: 'rgba(249, 98, 98, 1)',
    success: '#FFF4E0',
    warning: PALLETS.YELLOW,
    borderCover: 'rgba(26, 49, 84, 0.1)',
    iconButtonBackground: 'rgba(255, 255, 255, 0.1)',
    navy: {
      navy0: '#1A3154',
      navy1: '#2B3E60',
      navy2: '#6B80A0',
      navy3: '#D6E4F3',
      navy4: '#EBF2FA',
    },
    grey: {
      grey0: 'rgba(110, 127, 157, 0.5)',
      grey1: '#747F9F',
      grey2: '#DDE6F1',
    },
    white: {
      white100: 'rgba(255, 255, 255, 1)',
      white80: 'rgba(255, 255, 255, 0.8)',
      white60: 'rgba(255, 255, 255, 0.6)',
      white40: 'rgba(255, 255, 255, 0.4)',
      white25: 'rgba(255, 255, 255, 0.25)',
      white20: 'rgba(255, 255, 255, 0.2)',
      white15: 'rgba(255, 255, 255, 0.15)',
      white10: 'rgba(255, 255, 255, 0.1)',
      white5: 'rgba(255, 255, 255, 0.05)',
    },
  },
}

export const DarkTheme = {
  ...Theme,
  shadowColor: {
    popupBackground: '#39414A',
  },
  // define dynamic theme here
  colors: {
    ...Theme.colors,
    mainText: PALLETS.WHITE,
    subText: PALLETS.LIGHTER_GRAY,
    background: PALLETS.DARK_BLACK_BLUE,
    popupBackground: '#272E35',
    breakLine: '#D2E7FF33',
    headerGradient: ['#1E252B', '#303B4D'],
    loadingGradient: ['rgba(225, 232, 235, 0.2)', 'rgba(225, 232, 235, 0.1)'],
    grayDark: 'rgba(255, 255, 255, 0.6)',
    skeleton: Theme.colors.white.white15,
    borderCover: '#D2E7FF33',
    iconButtonBackground: 'rgba(255, 255, 255, 0.1)',
    success: '#463F33',
  },
}

export type BreakPoint = keyof typeof Theme.breakpoints
export type Spacing = keyof typeof Theme.spacing
export type Color = keyof typeof Theme.colors
export type ShadowType = keyof typeof Theme.shadow

export const ThemeModeArray = ['light', 'dark'] as const
export type ThemeMode = (typeof ThemeModeArray)[number]
export type ThemeModeConfig = ThemeMode | 'system'
export type ThemeSource = 'mode' | 'tabMode'
