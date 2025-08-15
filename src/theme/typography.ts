/**
 * IRISeller Typography System
 * Consistent with web application typography
 */

import { Platform } from 'react-native';

// Font families
export const fontFamilies = {
  // Primary fonts (will load custom fonts)
  primary: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },
  // Display fonts (will be replaced with Futura PT when loaded)
  display: {
    regular: 'FuturaPT-Regular',
    medium: 'FuturaPT-Medium',
    bold: 'FuturaPT-Bold',
  },
  // Serif fonts (will be replaced with Freight Big Pro when loaded)
  serif: {
    regular: 'FreightBigPro-Regular',
    medium: 'FreightBigPro-Medium',
    bold: 'FreightBigPro-Bold',
  },
};

// Font sizes
export const fontSizes = {
  // Display sizes
  display1: 48,
  display2: 40,
  display3: 36,
  
  // Heading sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  
  // Body sizes
  large: 18,
  medium: 16,
  regular: 14,
  small: 12,
  tiny: 10,
  
  // Component specific
  button: 16,
  buttonSmall: 14,
  input: 16,
  label: 14,
  caption: 12,
};

// Line heights
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

// Letter spacing
export const letterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
};

// Typography presets
export const typography = {
  // Display styles
  display1: {
    fontFamily: fontFamilies.display.bold,
    fontSize: fontSizes.display1,
    lineHeight: fontSizes.display1 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  display2: {
    fontFamily: fontFamilies.display.bold,
    fontSize: fontSizes.display2,
    lineHeight: fontSizes.display2 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  display3: {
    fontFamily: fontFamilies.display.bold,
    fontSize: fontSizes.display3,
    lineHeight: fontSizes.display3 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  
  // Heading styles
  h1: {
    fontFamily: fontFamilies.display.bold,
    fontSize: fontSizes.h1,
    lineHeight: fontSizes.h1 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamilies.display.bold,
    fontSize: fontSizes.h2,
    lineHeight: fontSizes.h2 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamilies.display.medium,
    fontSize: fontSizes.h3,
    lineHeight: fontSizes.h3 * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  h4: {
    fontFamily: fontFamilies.display.medium,
    fontSize: fontSizes.h4,
    lineHeight: fontSizes.h4 * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  h5: {
    fontFamily: fontFamilies.primary.medium,
    fontSize: fontSizes.h5,
    lineHeight: fontSizes.h5 * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  h6: {
    fontFamily: fontFamilies.primary.medium,
    fontSize: fontSizes.h6,
    lineHeight: fontSizes.h6 * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // Body styles
  bodyLarge: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: fontSizes.large,
    lineHeight: fontSizes.large * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: fontSizes.medium,
    lineHeight: fontSizes.medium * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  bodyRegular: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: fontSizes.regular,
    lineHeight: fontSizes.regular * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: fontSizes.small,
    lineHeight: fontSizes.small * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // Component styles
  button: {
    fontFamily: fontFamilies.primary.medium,
    fontSize: fontSizes.button,
    lineHeight: fontSizes.button * lineHeights.tight,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none' as const,
  },
  buttonSmall: {
    fontFamily: fontFamilies.primary.medium,
    fontSize: fontSizes.buttonSmall,
    lineHeight: fontSizes.buttonSmall * lineHeights.tight,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none' as const,
  },
  caption: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: fontSizes.caption,
    lineHeight: fontSizes.caption * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  },
  label: {
    fontFamily: fontFamilies.primary.medium,
    fontSize: fontSizes.label,
    lineHeight: fontSizes.label * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  link: {
    fontFamily: fontFamilies.primary.regular,
    fontSize: fontSizes.regular,
    lineHeight: fontSizes.regular * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    textDecorationLine: 'underline' as const,
  },
};











