import { ViewStyle, TextStyle } from 'react-native'
import { PALLETS } from './constants'
import { borderRadius, layout } from './layout'
import { textVariants } from './typography'

// Button variants
export const buttonVariants = {
  // Size variants
  sizes: {
    small: {
      container: {
        height: layout.button.small,
        paddingHorizontal: 12,
        borderRadius: borderRadius.base,
      } as ViewStyle,
      text: textVariants.buttonSmall,
    },
    medium: {
      container: {
        height: layout.button.medium,
        paddingHorizontal: 16,
        borderRadius: borderRadius.md,
      } as ViewStyle,
      text: textVariants.button,
    },
    large: {
      container: {
        height: layout.button.large,
        paddingHorizontal: 20,
        borderRadius: borderRadius.lg,
      } as ViewStyle,
      text: textVariants.buttonLarge,
    },
    extraLarge: {
      container: {
        height: layout.button.extraLarge,
        paddingHorizontal: 24,
        borderRadius: borderRadius.lg,
      } as ViewStyle,
      text: textVariants.buttonLarge,
    },
  },

  // Style variants
  styles: {
    primary: {
      container: {
        backgroundColor: PALLETS.ORANGE,
        shadowColor: PALLETS.ORANGE,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
      } as ViewStyle,
      text: {
        color: PALLETS.WHITE,
      } as TextStyle,
    },
    secondary: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: PALLETS.ORANGE,
      } as ViewStyle,
      text: {
        color: PALLETS.ORANGE,
      } as TextStyle,
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
      } as ViewStyle,
      text: {
        color: PALLETS.ORANGE,
      } as TextStyle,
    },
    danger: {
      container: {
        backgroundColor: PALLETS.RED,
      } as ViewStyle,
      text: {
        color: PALLETS.WHITE,
      } as TextStyle,
    },
    success: {
      container: {
        backgroundColor: PALLETS.GREEN,
      } as ViewStyle,
      text: {
        color: PALLETS.WHITE,
      } as TextStyle,
    },
    warning: {
      container: {
        backgroundColor: PALLETS.YELLOW,
      } as ViewStyle,
      text: {
        color: PALLETS.DARK_BLUE,
      } as TextStyle,
    },
    dark: {
      container: {
        backgroundColor: PALLETS.DARK_BLUE,
      } as ViewStyle,
      text: {
        color: PALLETS.WHITE,
      } as TextStyle,
    },
    light: {
      container: {
        backgroundColor: PALLETS.WHITE,
        borderWidth: 1,
        borderColor: PALLETS.LIGHT_GRAY,
      } as ViewStyle,
      text: {
        color: PALLETS.DARK_BLUE,
      } as TextStyle,
    },
  },
} as const

// Input variants
export const inputVariants = {
  sizes: {
    small: {
      container: {
        height: layout.input.small,
        paddingHorizontal: 12,
        borderRadius: borderRadius.base,
      } as ViewStyle,
      text: textVariants.bodySmall,
    },
    medium: {
      container: {
        height: layout.input.medium,
        paddingHorizontal: 16,
        borderRadius: borderRadius.md,
      } as ViewStyle,
      text: textVariants.body,
    },
    large: {
      container: {
        height: layout.input.large,
        paddingHorizontal: 20,
        borderRadius: borderRadius.lg,
      } as ViewStyle,
      text: textVariants.bodyLarge,
    },
  },

  states: {
    default: {
      container: {
        backgroundColor: PALLETS.WHITE,
        borderWidth: 1,
        borderColor: PALLETS.LIGHT_GRAY,
      } as ViewStyle,
      text: {
        color: PALLETS.DARK_BLUE,
      } as TextStyle,
      placeholder: {
        color: PALLETS.GRAY,
      } as TextStyle,
    },
    focused: {
      container: {
        backgroundColor: PALLETS.WHITE,
        borderWidth: 2,
        borderColor: PALLETS.ORANGE,
      } as ViewStyle,
      text: {
        color: PALLETS.DARK_BLUE,
      } as TextStyle,
    },
    error: {
      container: {
        backgroundColor: PALLETS.WHITE,
        borderWidth: 1,
        borderColor: PALLETS.RED,
      } as ViewStyle,
      text: {
        color: PALLETS.DARK_BLUE,
      } as TextStyle,
    },
    disabled: {
      container: {
        backgroundColor: PALLETS.LIGHT_GRAY,
        borderWidth: 1,
        borderColor: PALLETS.LIGHT_GRAY,
      } as ViewStyle,
      text: {
        color: PALLETS.GRAY,
      } as TextStyle,
    },
  },
} as const

// Card variants
export const cardVariants = {
  styles: {
    default: {
      backgroundColor: PALLETS.WHITE,
      borderRadius: borderRadius.lg,
      padding: layout.card.padding,
      shadowColor: PALLETS.DARK_BLUE,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    } as ViewStyle,

    elevated: {
      backgroundColor: PALLETS.WHITE,
      borderRadius: borderRadius.lg,
      padding: layout.card.padding,
      shadowColor: PALLETS.DARK_BLUE,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    } as ViewStyle,

    outlined: {
      backgroundColor: PALLETS.WHITE,
      borderRadius: borderRadius.lg,
      padding: layout.card.padding,
      borderWidth: 1,
      borderColor: PALLETS.LIGHT_GRAY,
    } as ViewStyle,

    filled: {
      backgroundColor: PALLETS.LIGHT_BLUE,
      borderRadius: borderRadius.lg,
      padding: layout.card.padding,
    } as ViewStyle,

    gradient: {
      borderRadius: borderRadius.lg,
      padding: layout.card.padding,
    } as ViewStyle,
  },

  sizes: {
    small: {
      padding: 12,
      borderRadius: borderRadius.md,
    } as ViewStyle,

    medium: {
      padding: layout.card.padding,
      borderRadius: borderRadius.lg,
    } as ViewStyle,

    large: {
      padding: 24,
      borderRadius: borderRadius.xl,
    } as ViewStyle,
  },
} as const

// Badge variants
export const badgeVariants = {
  sizes: {
    small: {
      container: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: borderRadius.xs,
        minHeight: 16,
      } as ViewStyle,
      text: {
        fontSize: 10,
        lineHeight: 12,
      } as TextStyle,
    },

    medium: {
      container: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
        minHeight: 20,
      } as ViewStyle,
      text: {
        fontSize: 11,
        lineHeight: 13,
      } as TextStyle,
    },

    large: {
      container: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: borderRadius.base,
        minHeight: 24,
      } as ViewStyle,
      text: {
        fontSize: 12,
        lineHeight: 14,
      } as TextStyle,
    },
  },

  styles: {
    primary: {
      container: {
        backgroundColor: PALLETS.ORANGE,
      } as ViewStyle,
      text: {
        color: PALLETS.WHITE,
      } as TextStyle,
    },

    secondary: {
      container: {
        backgroundColor: PALLETS.LIGHT_GRAY,
      } as ViewStyle,
      text: {
        color: PALLETS.DARK_BLUE,
      } as TextStyle,
    },

    success: {
      container: {
        backgroundColor: PALLETS.GREEN,
      } as ViewStyle,
      text: {
        color: PALLETS.WHITE,
      } as TextStyle,
    },

    warning: {
      container: {
        backgroundColor: PALLETS.YELLOW,
      } as ViewStyle,
      text: {
        color: PALLETS.DARK_BLUE,
      } as TextStyle,
    },

    danger: {
      container: {
        backgroundColor: PALLETS.RED,
      } as ViewStyle,
      text: {
        color: PALLETS.WHITE,
      } as TextStyle,
    },

    outlined: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: PALLETS.ORANGE,
      } as ViewStyle,
      text: {
        color: PALLETS.ORANGE,
      } as TextStyle,
    },
  },
} as const

// Chip variants
export const chipVariants = {
  sizes: {
    small: {
      container: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        height: 24,
      } as ViewStyle,
      text: textVariants.caption,
    },

    medium: {
      container: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        height: 32,
      } as ViewStyle,
      text: textVariants.label,
    },

    large: {
      container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: borderRadius.full,
        height: 40,
      } as ViewStyle,
      text: textVariants.body,
    },
  },

  styles: {
    filled: {
      container: {
        backgroundColor: PALLETS.ORANGE,
      } as ViewStyle,
      text: {
        color: PALLETS.WHITE,
      } as TextStyle,
    },

    outlined: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: PALLETS.ORANGE,
      } as ViewStyle,
      text: {
        color: PALLETS.ORANGE,
      } as TextStyle,
    },

    soft: {
      container: {
        backgroundColor: PALLETS.LIGHT_ORANGE,
      } as ViewStyle,
      text: {
        color: PALLETS.DARK_ORANGE,
      } as TextStyle,
    },
  },
} as const

// Loading variants
export const loadingVariants = {
  sizes: {
    small: {
      size: 16,
      strokeWidth: 2,
    },
    medium: {
      size: 24,
      strokeWidth: 2,
    },
    large: {
      size: 32,
      strokeWidth: 3,
    },
    extraLarge: {
      size: 48,
      strokeWidth: 4,
    },
  },

  colors: {
    primary: PALLETS.ORANGE,
    secondary: PALLETS.GRAY,
    light: PALLETS.WHITE,
    dark: PALLETS.DARK_BLUE,
  },
} as const

// Export types for better TypeScript support
export type ButtonSize = keyof typeof buttonVariants.sizes
export type ButtonStyle = keyof typeof buttonVariants.styles
export type InputSize = keyof typeof inputVariants.sizes
export type InputState = keyof typeof inputVariants.states
export type CardStyle = keyof typeof cardVariants.styles
export type CardSize = keyof typeof cardVariants.sizes
export type BadgeSize = keyof typeof badgeVariants.sizes
export type BadgeStyle = keyof typeof badgeVariants.styles
export type ChipSize = keyof typeof chipVariants.sizes
export type ChipStyle = keyof typeof chipVariants.styles
export type LoadingSize = keyof typeof loadingVariants.sizes
export type LoadingColor = keyof typeof loadingVariants.colors
