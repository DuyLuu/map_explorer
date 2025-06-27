import React, { ReactNode } from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme, combineStyles, Spacing, BorderRadius, ShadowType } from '../theme';
import { borderRadius } from '../theme/layout';

export interface BoxProps extends ViewProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  // Spacing props
  margin?: Spacing;
  marginHorizontal?: Spacing;
  marginVertical?: Spacing;
  marginTop?: Spacing;
  marginBottom?: Spacing;
  marginRight?: Spacing;
  marginLeft?: Spacing;
  padding?: Spacing;
  paddingHorizontal?: Spacing;
  paddingVertical?: Spacing;
  paddingTop?: Spacing;
  paddingBottom?: Spacing;
  paddingRight?: Spacing;
  paddingLeft?: Spacing;
  // Visual props
  backgroundColor?: string;
  borderRadius?: BorderRadius | number;
  shadow?: ShadowType;
  shadowColor?: string;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
  primary?: boolean;
  secondary?: boolean;
  success?: boolean;
  warning?: boolean;
  danger?: boolean;
  // Layout props
  flex?: boolean | number;
  row?: boolean;
  column?: boolean;
  center?: boolean;
  centerItems?: boolean;
  centerContent?: boolean;
  spaceBetween?: boolean;
  spaceAround?: boolean;
  spaceEvenly?: boolean;
  alignStart?: boolean;
  alignEnd?: boolean;
  justifyStart?: boolean;
  justifyEnd?: boolean;
  absolute?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  hidden?: boolean;
  gap?: Spacing;
}

export const Box: React.FC<BoxProps> = ({
  children,
  style,
  // Spacing props
  margin,
  marginHorizontal,
  marginVertical,
  marginTop,
  marginBottom,
  marginRight,
  marginLeft,
  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingRight,
  paddingLeft,
  // Visual props
  backgroundColor,
  borderRadius: borderRadiusProp,
  shadow,
  shadowColor,
  borderWidth,
  borderColor,
  opacity,
  primary,
  secondary,
  success,
  warning,
  danger,
  // Layout props
  flex,
  row,
  column,
  center,
  centerItems,
  centerContent,
  spaceBetween,
  spaceAround,
  spaceEvenly,
  alignStart,
  alignEnd,
  justifyStart,
  justifyEnd,
  absolute,
  fullWidth,
  fullHeight,
  hidden,
  ...props
}) => {
  const { theme } = useTheme();

  const getSpacingStyles = (): ViewStyle => {
    const spacingStyles: ViewStyle = {};

    if (margin !== undefined) spacingStyles.margin = theme.spacing[margin];
    if (marginHorizontal !== undefined) spacingStyles.marginHorizontal = theme.spacing[marginHorizontal];
    if (marginVertical !== undefined) spacingStyles.marginVertical = theme.spacing[marginVertical];
    if (marginTop !== undefined) spacingStyles.marginTop = theme.spacing[marginTop];
    if (marginBottom !== undefined) spacingStyles.marginBottom = theme.spacing[marginBottom];
    if (marginRight !== undefined) spacingStyles.marginRight = theme.spacing[marginRight];
    if (marginLeft !== undefined) spacingStyles.marginLeft = theme.spacing[marginLeft];

    if (padding !== undefined) spacingStyles.padding = theme.spacing[padding];
    if (paddingHorizontal !== undefined) spacingStyles.paddingHorizontal = theme.spacing[paddingHorizontal];
    if (paddingVertical !== undefined) spacingStyles.paddingVertical = theme.spacing[paddingVertical];
    if (paddingTop !== undefined) spacingStyles.paddingTop = theme.spacing[paddingTop];
    if (paddingBottom !== undefined) spacingStyles.paddingBottom = theme.spacing[paddingBottom];
    if (paddingRight !== undefined) spacingStyles.paddingRight = theme.spacing[paddingRight];
    if (paddingLeft !== undefined) spacingStyles.paddingLeft = theme.spacing[paddingLeft];

    return spacingStyles;
  };

  const getBackgroundColor = (): string | undefined => {
    if (backgroundColor) {
      if (backgroundColor in theme.colors) {
        return (theme.colors as any)[backgroundColor];
      }
      return backgroundColor;
    }
    if (primary) return theme.colors.primary;
    if (secondary) return theme.colors.secondary;
    if (success) return theme.colors.success;
    if (warning) return theme.colors.warning;
    if (danger) return theme.colors.danger;
    return undefined;
  };

  const getBorderColor = (): string | undefined => {
    if (!borderColor) return undefined;
    if (borderColor in theme.colors) {
      return (theme.colors as any)[borderColor];
    }
    return borderColor;
  };

  const getBorderRadius = (): number | undefined => {
    if (borderRadiusProp === undefined) return undefined;
    if (typeof borderRadiusProp === 'number') return borderRadiusProp;
    return borderRadius[borderRadiusProp];
  };

  const getShadowStyles = (): ViewStyle => {
    if (!shadow) return {};
    const shadowStyle = theme.shadow[shadow];
    if (!shadowStyle) return {};
    return {
      ...shadowStyle,
      ...(shadowColor && { shadowColor }),
    };
  };

  const combinedStyles = combineStyles(
    getSpacingStyles(),
    {
      backgroundColor: getBackgroundColor(),
      borderRadius: getBorderRadius(),
      ...(borderWidth !== undefined && { borderWidth }),
      borderColor: getBorderColor(),
      ...(opacity !== undefined && { opacity }),
    } as ViewStyle,
    getShadowStyles(),
    {
      ...(flex === true && { flex: 1 }),
      ...(typeof flex === 'number' && { flex }),
      ...(row && { flexDirection: 'row' as const }),
      ...(column && { flexDirection: 'column' as const }),
      ...(center && { justifyContent: 'center' as const, alignItems: 'center' as const }),
      ...(centerItems && { alignItems: 'center' as const }),
      ...(centerContent && { justifyContent: 'center' as const }),
      ...(spaceBetween && { justifyContent: 'space-between' as const }),
      ...(spaceAround && { justifyContent: 'space-around' as const }),
      ...(spaceEvenly && { justifyContent: 'space-evenly' as const }),
      ...(alignStart && { alignItems: 'flex-start' as const }),
      ...(alignEnd && { alignItems: 'flex-end' as const }),
      ...(justifyStart && { justifyContent: 'flex-start' as const }),
      ...(justifyEnd && { justifyContent: 'flex-end' as const }),
      ...(absolute && { position: 'absolute' as const }),
      ...(fullWidth && { width: '100%' }),
      ...(fullHeight && { height: '100%' }),
      ...(hidden && { overflow: 'hidden' as const }),
    } as ViewStyle,
    Array.isArray(style) ? style.filter(Boolean) : style ? [style] : []
  );

  return (
    <View style={combinedStyles} {...props}>
      {children}
    </View>
  );
};

export default Box;