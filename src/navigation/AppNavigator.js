import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';

// Import screens
import AuthScreen from '../screens/AuthScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import WorkspacesScreen from '../screens/WorkspacesScreen';
import WorkspaceScreen from '../screens/WorkspaceScreen';
import TaskListScreen from '../screens/TaskListScreen';

const Stack = createStackNavigator();

const AppNavigator = ({ isAuthenticated, isOnboarded }) => {
  const scheme = useColorScheme();
  
  // Customize themes
  const LightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#4a6da7',
      background: '#f8f9fa',
      card: '#ffffff',
      text: '#212529',
      border: '#dee2e6',
      notification: '#fa5252',
    },
  };
  
  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#6d8fc8',
      background: '#121212',
      card: '#1e1e1e',
      text: '#f8f9fa',
      border: '#343a40',
      notification: '#ff6b6b',
    },
  };

  return (
    <NavigationContainer theme={scheme === 'dark' ? CustomDarkTheme : LightTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : !isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Workspaces" component={WorkspacesScreen} />
            <Stack.Screen name="Workspace" component={WorkspaceScreen} />
            <Stack.Screen name="TaskList" component={TaskListScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
