import React, { ReactNode } from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme, combineStyles, BorderRadius, ShadowType, borderRadius } from '../theme';

export interface VisualBoxProps extends React.PropsWithChildren<any>, Omit<ViewProps, 'style'> {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
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
}

export const VisualBox: React.FC<VisualBoxProps> = ({
  children,
  style,
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
  ...props
}) => {
  const { theme } = useTheme();

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
    {
      backgroundColor: getBackgroundColor(),
      borderRadius: getBorderRadius(),
      ...(borderWidth !== undefined && { borderWidth }),
      borderColor: getBorderColor(),
      ...(opacity !== undefined && { opacity }),
    } as ViewStyle,
    getShadowStyles(),
    Array.isArray(style) ? style.filter(Boolean) : style ? [style] : []
  );

  return (
    <View style={combinedStyles} {...props}>
      {children}
    </View>
  );
};
