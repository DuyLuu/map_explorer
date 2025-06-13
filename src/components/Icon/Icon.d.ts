import { TextStyle } from 'react-native'

import { Spacing, IconSize } from '../../theme'

// TODO: define type name everytime import new icon
type IconName = string

export interface IconProps {
  /** Icon name from IcoMoon font */
  name: string
  /** Icon size - theme size or custom number */
  size?: IconSize | number
  /** Icon color - theme color key or custom hex/rgb */
  color?: string
  /** Custom styles to apply */
  style?: TextStyle | TextStyle[]

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

  // Theme color shortcuts
  /** Use primary color */
  primary?: boolean
  /** Use secondary color */
  secondary?: boolean
  /** Use success color */
  success?: boolean
  /** Use warning color */
  warning?: boolean
  /** Use danger color */
  danger?: boolean
  /** Use muted color */
  muted?: boolean
  /** Use light color */
  light?: boolean
  /** Use gray color */
  gray?: boolean
}
