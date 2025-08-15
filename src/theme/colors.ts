/**
 * IRISeller Brand Color Palette
 * Consistent with web application branding
 */

export const colors = {
  iris: {
    // Core Brand Colors
    offBlack: '#09171F',      // Off Black - Darkest shade
    inkyBlue: '#153539',      // Inky Blue - Dark blue
    peacock: '#265E5A',       // Peacock - Medium dark teal
    turquoise: '#06868D',     // True Turquoise - Main brand color
    plexBlue: '#2EE5EA',      // Plex Blue - Light bright teal
    sky: '#A0B8D0',           // Sky - Light blue/gray
    
    // Opacity variations
    turquoise10: 'rgba(6, 134, 141, 0.1)',
    turquoise20: 'rgba(6, 134, 141, 0.2)',
    turquoise30: 'rgba(6, 134, 141, 0.3)',
    turquoise50: 'rgba(6, 134, 141, 0.5)',
    turquoise80: 'rgba(6, 134, 141, 0.8)',
    
    sky10: 'rgba(160, 184, 208, 0.1)',
    sky20: 'rgba(160, 184, 208, 0.2)',
    sky30: 'rgba(160, 184, 208, 0.3)',
    sky50: 'rgba(160, 184, 208, 0.5)',
    
    peacock10: 'rgba(38, 94, 90, 0.1)',
    peacock20: 'rgba(38, 94, 90, 0.2)',
    peacock30: 'rgba(38, 94, 90, 0.3)',
    peacock50: 'rgba(38, 94, 90, 0.5)',
  },
  
  // Semantic Colors
  primary: '#06868D',        // iris.turquoise
  secondary: '#265E5A',      // iris.peacock
  accent: '#2EE5EA',         // iris.plexBlue
  
  // Status Colors
  success: '#10B981',        // Emerald
  warning: '#F59E0B',        // Amber
  error: '#EF4444',          // Red
  info: '#06868D',           // iris.turquoise
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    dark: '#09171F',
  },
  
  // Text Colors
  text: {
    primary: '#09171F',      // iris.offBlack
    secondary: '#153539',    // iris.inkyBlue
    tertiary: '#6B7280',     // gray.500
    inverse: '#FFFFFF',
    link: '#06868D',         // iris.turquoise
  },
  
  // Border Colors
  border: {
    light: '#E5E7EB',        // gray.200
    medium: '#D1D5DB',       // gray.300
    dark: '#6B7280',         // gray.500
    focus: '#06868D',        // iris.turquoise
  },
};

// Gradients
export const gradients = {
  primary: ['#06868D', '#265E5A'],        // turquoise to peacock
  light: ['#2EE5EA', '#A0B8D0'],          // plexBlue to sky
  hero: ['#09171F', '#265E5A'],           // offBlack to peacock
  subtle: ['rgba(160, 184, 208, 0.1)', 'rgba(160, 184, 208, 0.2)'], // sky gradients
  success: ['#10B981', '#059669'],
  warning: ['#F59E0B', '#D97706'],
  error: ['#EF4444', '#DC2626'],
};

// Shadows
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.iris.turquoise,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.iris.turquoise,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.iris.turquoise,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: colors.iris.turquoise,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
