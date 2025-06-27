import React, { ReactNode } from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { combineStyles } from '../theme';

export interface LayoutBoxProps extends React.PropsWithChildren<any>, Omit<ViewProps, 'style'> {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
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
}

export const LayoutBox: React.FC<LayoutBoxProps> = ({
  children,
  style,
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
  const combinedStyles = combineStyles(
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
