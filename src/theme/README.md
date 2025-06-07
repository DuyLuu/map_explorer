# Design System

A comprehensive design system for the World Explorer React Native app with consistent colors, typography, spacing, and component variants.

## Features

- ✅ **Complete Theme System**: Light and dark theme support with automatic system detection
- ✅ **Typography Scale**: Predefined text variants and font sizes
- ✅ **Color Palette**: Extensive color system with opacity variants
- ✅ **Spacing System**: Consistent spacing values for margins and padding
- ✅ **Component Variants**: Pre-styled variants for buttons, inputs, cards, badges, and more
- ✅ **Layout Utilities**: Border radius, icon sizes, responsive breakpoints
- ✅ **Animation Constants**: Duration and easing values for smooth animations
- ✅ **Utility Functions**: Helper functions for styling and theme manipulation
- ✅ **React Context**: Theme provider and hooks for easy consumption

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import React from 'react'
import { ThemeProvider } from './src/theme'
import App from './App'

export default function AppWrapper() {
  return (
    <ThemeProvider defaultMode="system">
      <App />
    </ThemeProvider>
  )
}
```

### 2. Use the theme in your components

```tsx
import React from 'react'
import { View, Text } from 'react-native'
import { useTheme, textVariants, PALLETS } from '../theme'

export const ExampleComponent = () => {
  const { theme, isDark } = useTheme()

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius?.lg, // Using optional chaining for safety
      }}
    >
      <Text
        style={{
          ...textVariants.h2,
          color: theme.colors.mainText,
          marginBottom: theme.spacing.sm,
        }}
      >
        Hello World!
      </Text>

      <Text
        style={{
          ...textVariants.body,
          color: theme.colors.subText,
        }}
      >
        Current mode: {isDark ? 'Dark' : 'Light'}
      </Text>
    </View>
  )
}
```

### 3. Use component variants

```tsx
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTheme, buttonVariants, cardVariants, combineStyles } from '../theme'

export const ButtonExample = () => {
  const { theme } = useTheme()

  return (
    <View style={cardVariants.styles.default}>
      <TouchableOpacity
        style={combineStyles(
          buttonVariants.sizes.large.container,
          buttonVariants.styles.primary.container
        )}
      >
        <Text
          style={combineStyles(buttonVariants.sizes.large.text, buttonVariants.styles.primary.text)}
        >
          Primary Button
        </Text>
      </TouchableOpacity>
    </View>
  )
}
```

## Typography

### Text Variants

```tsx
import { textVariants } from '../theme'

// Headers
textVariants.h1 // Extra large header
textVariants.h2 // Large header
textVariants.h3 // Medium header
textVariants.h4 // Small header
textVariants.h5 // Extra small header
textVariants.h6 // Tiny header

// Body text
textVariants.bodyLarge // Large body text
textVariants.body // Regular body text
textVariants.bodySmall // Small body text

// Labels and captions
textVariants.label // Label text (semi-bold, small)
textVariants.caption // Caption text (tiny)

// Buttons
textVariants.buttonLarge
textVariants.button
textVariants.buttonSmall

// Special
textVariants.overline // All caps, spaced
textVariants.subtitle1 // Subtitle
textVariants.subtitle2 // Small subtitle
textVariants.displayLarge // Hero text
```

### Usage Example

```tsx
<Text
  style={{
    ...textVariants.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.m,
  }}
>
  Welcome Back!
</Text>
```

## Colors

### Accessing Colors

```tsx
const { theme } = useTheme()

// Primary colors
theme.colors.primary // Orange
theme.colors.secondary // Sea green
theme.colors.highlight // Highlighted orange

// Text colors (theme-aware)
theme.colors.mainText // Main text color
theme.colors.subText // Secondary text color

// Background colors
theme.colors.background // Main background
theme.colors.popupBackground // Modal/popup background

// Status colors
theme.colors.danger // Red for errors
theme.colors.success // Green for success
theme.colors.warning // Yellow for warnings

// Navy variations
theme.colors.navy.navy0 // Darkest navy
theme.colors.navy.navy4 // Lightest navy

// White variations with opacity
theme.colors.white.white100 // Solid white
theme.colors.white.white80 // 80% opacity
theme.colors.white.white10 // 10% opacity
```

## Spacing

### Spacing Scale

```tsx
const { theme } = useTheme()

theme.spacing.xxs // 2px
theme.spacing.xs // 4px
theme.spacing.s // 8px
theme.spacing.sm // 12px
theme.spacing.m // 16px (base)
theme.spacing.ml // 20px
theme.spacing.l // 24px
theme.spacing.xl // 32px
theme.spacing.xxl // 40px
```

### Spacing Utilities

```tsx
import { createSpacing, createMargin } from '../theme'

// Create padding
const padding = createSpacing(2, 4, 2, 4) // top, right, bottom, left
// Results in: paddingTop: 8, paddingRight: 16, paddingBottom: 8, paddingLeft: 16

// Create margin
const margin = createMargin(1, 0, 2, 0) // top, right, bottom, left
// Results in: marginTop: 4, marginRight: 0, marginBottom: 8, marginLeft: 0
```

## Component Variants

### Button Variants

```tsx
import { buttonVariants } from '../theme'

// Sizes: small, medium, large, extraLarge
buttonVariants.sizes.large.container
buttonVariants.sizes.large.text

// Styles: primary, secondary, ghost, danger, success, warning, dark, light
buttonVariants.styles.primary.container
buttonVariants.styles.primary.text
```

### Card Variants

```tsx
import { cardVariants } from '../theme'

// Styles: default, elevated, outlined, filled, gradient
cardVariants.styles.elevated

// Sizes: small, medium, large
cardVariants.sizes.large
```

### Input Variants

```tsx
import { inputVariants } from '../theme'

// Sizes: small, medium, large
inputVariants.sizes.medium.container

// States: default, focused, error, disabled
inputVariants.states.focused.container
```

## Layout Utilities

### Border Radius

```tsx
import { borderRadius } from '../theme'

borderRadius.none // 0
borderRadius.xs // 2px
borderRadius.sm // 4px
borderRadius.base // 6px
borderRadius.md // 8px
borderRadius.lg // 12px
borderRadius.xl // 16px
borderRadius['2xl'] // 20px
borderRadius['3xl'] // 24px
borderRadius.full // 9999px (circular)
```

### Icon Sizes

```tsx
import { iconSizes } from '../theme'

iconSizes.xs // 12px
iconSizes.sm // 16px
iconSizes.base // 20px
iconSizes.md // 24px
iconSizes.lg // 28px
iconSizes.xl // 32px
iconSizes['2xl'] // 40px
iconSizes['3xl'] // 48px
iconSizes['4xl'] // 64px
```

## Utility Functions

### Color Manipulation

```tsx
import { hexToRgba, adjustOpacity, darkenColor, lightenColor } from '../theme'

hexToRgba('#FF0000', 0.5) // 'rgba(255, 0, 0, 0.5)'
adjustOpacity(color, 0.7) // Adjust existing color opacity
darkenColor('#FF0000', 0.2) // Darken by 20%
lightenColor('#FF0000', 0.2) // Lighten by 20%
```

### Style Composition

```tsx
import { combineStyles, conditionalStyle } from '../theme'

// Combine multiple styles
const style = combineStyles(baseStyle, conditionalStyle(isActive, activeStyle), additionalStyle)

// Conditional styling
const buttonStyle = conditionalStyle(isPressed, pressedStyle, normalStyle)
```

### Shadow Creation

```tsx
import { createShadow } from '../theme'

const shadow = createShadow(
  '#000000', // color
  { width: 0, height: 2 }, // offset
  0.1, // opacity
  4, // radius
  2 // elevation (Android)
)
```

## Advanced Usage

### Custom Theme Hook

```tsx
import { useThemedStyles } from '../theme'

const MyComponent = () => {
  const styles = useThemedStyles(theme => ({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.m,
      borderRadius: borderRadius.lg,
    },
    title: {
      ...textVariants.h3,
      color: theme.colors.mainText,
      marginBottom: theme.spacing.sm,
    },
  }))

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
    </View>
  )
}
```

### HOC with Theme

```tsx
import { withTheme } from '../theme'

interface Props {
  title: string
  theme: typeof Theme
  isDark: boolean
}

const ThemedComponent = ({ title, theme, isDark }: Props) => (
  <View style={{ backgroundColor: theme.colors.background }}>
    <Text>
      {title} - {isDark ? 'Dark' : 'Light'} mode
    </Text>
  </View>
)

export default withTheme(ThemedComponent)
```

### Responsive Values

```tsx
import { useResponsiveValue } from '../theme'

const MyComponent = () => {
  const fontSize = useResponsiveValue({
    base: 14,
    sm: 16,
    md: 18,
    lg: 20,
  })

  return <Text style={{ fontSize }}>Responsive Text</Text>
}
```

## Theme Switching

```tsx
import { useTheme } from '../theme'

const ThemeToggle = () => {
  const { mode, toggleTheme, setMode } = useTheme()

  return (
    <View>
      <Text>Current mode: {mode}</Text>
      <TouchableOpacity onPress={toggleTheme}>
        <Text>Toggle Theme</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setMode('system')}>
        <Text>Use System Theme</Text>
      </TouchableOpacity>
    </View>
  )
}
```

## Best Practices

1. **Always use theme values**: Don't hardcode colors, spacing, or sizes
2. **Leverage variants**: Use predefined component variants for consistency
3. **Use semantic colors**: Prefer semantic names like `mainText` over specific colors
4. **Compose styles**: Use utility functions to combine and compose styles
5. **Test both themes**: Ensure your components work in both light and dark modes
6. **Use TypeScript**: Take advantage of type safety for better developer experience

## Migration from Old Theme

Your existing `constants.ts` file remains unchanged and is fully integrated. All existing usage will continue to work, while new features are available through the design system.

```tsx
// Old way (still works)
import { PALLETS, Theme } from './theme/constants'

// New way (recommended)
import { useTheme, textVariants, buttonVariants } from './theme'
```
