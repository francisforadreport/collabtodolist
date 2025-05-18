// Updated theme with vif.today-inspired minimalist design
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E2E2E',       // Dark gray instead of blue for minimalist look
    secondary: '#757575',     // Medium gray for secondary elements
    background: '#FFFFFF',    // Clean white background
    card: '#FAFAFA',          // Very light gray for cards
    text: '#2E2E2E',          // Dark gray text
    border: '#EEEEEE',        // Light gray borders
    notification: '#FF5252',  // Subtle red for notifications
    success: '#4CAF50',       // Subtle green for success states
    personal: '#E0E0E0',      // Light gray for personal workspace
    couple: '#BBDEFB',        // Light blue for couple workspace
    family: '#C8E6C9',        // Light green for family workspace
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      s: 14,
      m: 16,
      l: 18,
      xl: 20,
      xxl: 24,
    },
    lineHeight: {
      xs: 16,
      s: 20,
      m: 24,
      l: 28,
      xl: 32,
      xxl: 36,
    },
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 12,
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#E0E0E0',       // Light gray for dark mode
    secondary: '#9E9E9E',     // Medium gray for secondary elements
    background: '#121212',    // Dark background
    card: '#1E1E1E',          // Slightly lighter than background
    text: '#E0E0E0',          // Light gray text
    border: '#333333',        // Dark gray borders
    notification: '#FF5252',  // Same red for notifications
    success: '#4CAF50',       // Same green for success states
    personal: '#424242',      // Dark gray for personal workspace
    couple: '#1A237E',        // Dark blue for couple workspace
    family: '#1B5E20',        // Dark green for family workspace
  },
  spacing: LightTheme.spacing,
  typography: LightTheme.typography,
  borderRadius: LightTheme.borderRadius,
};

export default {
  light: LightTheme,
  dark: CustomDarkTheme,
};
