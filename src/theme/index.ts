/**
 * IRISeller Mobile Theme
 * Central theme configuration
 */

import { colors, gradients, shadows } from './colors';
import { typography, fontSizes, fontFamilies, lineHeights, letterSpacing } from './typography';

// Spacing scale
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
  '5xl': 80,
  '6xl': 96,
};

// Border radius
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Breakpoints for responsive design
export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
};

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// Consolidated theme object
export const theme = {
  colors,
  gradients,
  shadows,
  typography,
  fontSizes,
  fontFamilies,
  lineHeights,
  letterSpacing,
  spacing,
  borderRadius,
  breakpoints,
  zIndex,
  animations,
};

export type Theme = typeof theme;

// Export all individual modules
export * from './colors';
export * from './typography';











