import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import store from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import { auth, createUserProfile } from './services/firebase';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in
        setIsAuthenticated(true);
        
        // Create or update user profile
        await createUserProfile(user);
        
        // Check if user has completed onboarding
        // In a real app, this would be fetched from Firestore
        setIsOnboarded(true); // For demo purposes
      } else {
        // User is signed out
        setIsAuthenticated(false);
        setIsOnboarded(false);
      }
      
      setIsLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // Show loading screen
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <AppNavigator 
          isAuthenticated={isAuthenticated} 
          isOnboarded={isOnboarded} 
        />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
