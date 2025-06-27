import React, { ReactNode } from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useTheme, Spacing, combineStyles } from '../theme';

export interface SpacingBoxProps extends React.PropsWithChildren<any>, Omit<ViewProps, 'style'> {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
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
}

export const SpacingBox: React.FC<SpacingBoxProps> = ({
  children,
  style,
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

  const combinedStyles = combineStyles(
    getSpacingStyles(),
    Array.isArray(style) ? style.filter(Boolean) : style ? [style] : []
  );

  return (
    <View style={combinedStyles} {...props}>
      {children}
    </View>
  );
};
