import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

// Updated Button component with minimalist vif.today-inspired design
const Button = ({ 
  title, 
  onPress, 
  type = 'primary', 
  disabled = false, 
  size = 'medium',
  style 
}) => {
  const theme = useTheme();
  
  const buttonStyles = {
    primary: {
      backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    tertiary: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    danger: {
      backgroundColor: disabled ? '#ffcccc' : theme.colors.notification,
      borderWidth: 0,
    },
    success: {
      backgroundColor: disabled ? '#ccffcc' : theme.colors.success,
      borderWidth: 0,
    },
  };
  
  const textStyles = {
    primary: {
      color: '#ffffff',
    },
    secondary: {
      color: theme.colors.primary,
    },
    tertiary: {
      color: theme.colors.primary,
    },
    danger: {
      color: '#ffffff',
    },
    success: {
      color: '#ffffff',
    },
  };
  
  const sizeStyles = {
    small: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.m,
      borderRadius: theme.borderRadius.s,
    },
    medium: {
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.l,
      borderRadius: theme.borderRadius.m,
    },
    large: {
      paddingVertical: theme.spacing.m,
      paddingHorizontal: theme.spacing.xl,
      borderRadius: theme.borderRadius.m,
    },
  };
  
  const textSizeStyles = {
    small: {
      fontSize: theme.typography.fontSize.s,
    },
    medium: {
      fontSize: theme.typography.fontSize.m,
    },
    large: {
      fontSize: theme.typography.fontSize.l,
    },
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button, 
        buttonStyles[type], 
        sizeStyles[size],
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.text, 
        textStyles[type],
        textSizeStyles[size]
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
