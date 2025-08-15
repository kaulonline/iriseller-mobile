/**
 * IrisText Component
 * Typography component with IRIS branding
 */

import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

type TextVariant = 
  | 'display1' 
  | 'display2' 
  | 'display3'
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodyRegular'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'button';

type TextColor = 
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'link'
  | 'success'
  | 'warning'
  | 'error'
  | 'turquoise'
  | 'peacock'
  | 'plexBlue'
  | 'sky';

interface IrisTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right' | 'justify';
  style?: TextStyle;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export const IrisText: React.FC<IrisTextProps> = ({
  children,
  variant = 'bodyRegular',
  color = 'primary',
  align = 'left',
  style,
  numberOfLines,
  ellipsizeMode = 'tail',
}) => {
  return (
    <Text
      style={[
        typography[variant],
        styles[color],
        { textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  // Text colors
  primary: {
    color: colors.text.primary,
  },
  secondary: {
    color: colors.text.secondary,
  },
  tertiary: {
    color: colors.text.tertiary,
  },
  inverse: {
    color: colors.text.inverse,
  },
  link: {
    color: colors.text.link,
    textDecorationLine: 'underline',
  },
  success: {
    color: colors.success,
  },
  warning: {
    color: colors.warning,
  },
  error: {
    color: colors.error,
  },
  turquoise: {
    color: colors.iris.turquoise,
  },
  peacock: {
    color: colors.iris.peacock,
  },
  plexBlue: {
    color: colors.iris.plexBlue,
  },
  sky: {
    color: colors.iris.sky,
  },
});











