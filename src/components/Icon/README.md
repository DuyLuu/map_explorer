# Icon Component

A fully integrated IcoMoon icon component that follows the design system patterns.

## Features

- ✅ **IcoMoon Custom Font Integration**: Uses your custom IcoMoon font files
- ✅ **Theme System Integration**: Automatic light/dark mode support
- ✅ **Design System Consistency**: Follows the same patterns as Text, Button, and Box components
- ✅ **Color Shortcuts**: Use `primary`, `secondary`, `success`, etc. for quick theming
- ✅ **Spacing Props**: Full BoxKey spacing system support (margins)
- ✅ **Multiple Size Options**: Theme-based sizes (`xs`, `sm`, `md`, etc.) or custom numbers
- ✅ **Animation Support**: Built-in support for react-native-reanimated
- ✅ **TypeScript Support**: Full type safety with proper intellisense
- ✅ **Accessibility**: Proper accessibility label support

## Usage Examples

### Basic Usage

```tsx
import { Icon } from '../components'

// Simple icon with theme size
<Icon name="search" size="md" />

// Icon with custom size
<Icon name="heart" size={32} />
```

### Theme Color Shortcuts

```tsx
// Use theme colors
<Icon name="star" primary />
<Icon name="check" success />
<Icon name="warning" danger />
<Icon name="info" secondary />
```

### Custom Colors

```tsx
// Custom hex color
<Icon name="heart" color="#FF0000" />

// Theme color key
<Icon name="star" color="primaryGradient" />
```

### Spacing Props

```tsx
// Add margins using theme spacing
<Icon name="search" marginRight="sm" />
<Icon name="heart" margin="m" />
<Icon name="star" marginTop="lg" marginBottom="xs" />
```

### Animation Support

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'

const MyComponent = () => {
  const rotation = useSharedValue(0)

  const animatedProps = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }))

  return <Icon name="settings" animated animatedProps={animatedProps} size="lg" primary />
}
```

### Complete Example

```tsx
import { Icon } from '../components'

const SearchButton = () => {
  return (
    <TouchableOpacity>
      <Icon name="search" size="md" primary marginRight="sm" accessibilityLabel="Search" />
    </TouchableOpacity>
  )
}
```

## Available Sizes

The component supports theme-based sizes:

- `xs` (12px)
- `sm` (16px)
- `base` (20px) - default
- `md` (24px)
- `lg` (28px)
- `xl` (32px)
- `2xl` (40px)
- `3xl` (48px)
- `4xl` (64px)

Or any custom number value.

## Available Color Shortcuts

- `primary` - Theme primary color
- `secondary` - Theme secondary color
- `success` - Success color
- `warning` - Warning color
- `danger` - Danger color
- `muted` - Subdued text color
- `light` - Light color
- `gray` - Gray color

## Migration from Old Vector Icons

If you were using the old vector icon components:

```tsx
// Old way ❌
<VectorIcon name="search" family="FontAwesome6" primary={true} size={24} />

// New way ✅
<Icon name="search" primary size="md" />
```

## Integration with Other Components

The Icon works seamlessly with other design system components:

```tsx
import { Button, Text, Box, Icon } from '../components'

const ActionButton = () => (
  <Button variant="primary" size="medium">
    <Icon name="plus" marginRight="xs" />
    <Text variant="button">Add Item</Text>
  </Button>
)
```
