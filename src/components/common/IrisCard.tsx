/**
 * IrisCard Component
 * Reusable card component with IRIS branding
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../theme';

interface IrisCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
  elevated?: boolean;
  variant?: 'default' | 'gradient' | 'outlined';
}

export const IrisCard: React.FC<IrisCardProps> = ({
  children,
  style,
  padding = 'medium',
  onPress,
  elevated = true,
  variant = 'default',
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.95 : 1}
      style={[
        styles.base,
        styles[variant],
        styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles],
        elevated && styles.elevated,
        style,
      ]}
    >
      {children}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
  },
  
  // Variants
  default: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  gradient: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.iris.sky20,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.iris.turquoise,
  },
  
  // Padding variants
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: spacing.sm,
  },
  paddingMedium: {
    padding: spacing.lg,
  },
  paddingLarge: {
    padding: spacing.xl,
  },
  
  // Elevation
  elevated: {
    ...shadows.md,
  },
});











