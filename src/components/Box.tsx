import React, { ReactNode } from 'react';
import { ViewProps, ViewStyle } from 'react-native';
import { combineStyles, Spacing, BorderRadius, ShadowType } from '../theme';
import { SpacingBox, SpacingBoxProps } from './SpacingBox';
import { VisualBox, VisualBoxProps } from './VisualBox';
import { LayoutBox, LayoutBoxProps } from './LayoutBox';

export interface BoxProps extends SpacingBoxProps, VisualBoxProps, LayoutBoxProps {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
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
  borderRadius,
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
  return (
    <SpacingBox
      margin={margin}
      marginHorizontal={marginHorizontal}
      marginVertical={marginVertical}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginRight={marginRight}
      marginLeft={marginLeft}
      padding={padding}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      paddingRight={paddingRight}
      paddingLeft={paddingLeft}
    >
      <VisualBox
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        shadow={shadow}
        shadowColor={shadowColor}
        borderWidth={borderWidth}
        borderColor={borderColor}
        opacity={opacity}
        primary={primary}
        secondary={secondary}
        success={success}
        warning={warning}
        danger={danger}
      >
        <LayoutBox
          flex={flex}
          row={row}
          column={column}
          center={center}
          centerItems={centerItems}
          centerContent={centerContent}
          spaceBetween={spaceBetween}
          spaceAround={spaceAround}
          spaceEvenly={spaceEvenly}
          alignStart={alignStart}
          alignEnd={alignEnd}
          justifyStart={justifyStart}
          justifyEnd={justifyEnd}
          absolute={absolute}
          fullWidth={fullWidth}
          fullHeight={fullHeight}
          hidden={hidden}
          style={style}
          {...props}
        >
          {children}
        </LayoutBox>
      </VisualBox>
    </SpacingBox>
  );
};

export default Box;