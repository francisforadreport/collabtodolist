import React from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';

// Updated Input component with minimalist vif.today-inspired design
const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false, 
  error = null,
  multiline = false,
  maxLength = null,
  style,
  onBlur = () => {}
}) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[
          styles.label, 
          { 
            color: theme.colors.text,
            fontSize: theme.typography.fontSize.s,
            marginBottom: theme.spacing.xs
          }
        ]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input, 
          { 
            borderColor: error ? theme.colors.notification : theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.card,
            height: multiline ? 100 : 48,
            borderRadius: theme.borderRadius.s,
            paddingHorizontal: theme.spacing.m,
            fontSize: theme.typography.fontSize.m
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.secondary + '80'}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        maxLength={maxLength}
        textAlignVertical={multiline ? 'top' : 'center'}
        onBlur={onBlur}
      />
      {error && (
        <Text style={[
          styles.errorText, 
          { 
            color: theme.colors.notification,
            fontSize: theme.typography.fontSize.xs,
            marginTop: theme.spacing.xs
          }
        ]}>
          {error}
        </Text>
      )}
      {maxLength && (
        <Text style={[
          styles.charCount,
          {
            color: theme.colors.secondary,
            fontSize: theme.typography.fontSize.xs,
            marginTop: theme.spacing.xs
          }
        ]}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    paddingVertical: 12,
  },
  errorText: {
    fontWeight: '500',
  },
  charCount: {
    textAlign: 'right',
  }
});

export default Input;
