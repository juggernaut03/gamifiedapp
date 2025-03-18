import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../styles/theme';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    // Load theme preference from storage
    const loadThemePreference = async () => {
      try {
        const themePreference = await AsyncStorage.getItem('themePreference');
        if (themePreference === 'dark') {
          setIsDarkMode(true);
          setTheme(darkTheme);
        }
      } catch (e) {
        console.log('Failed to load theme preference', e);
      }
    };

    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setTheme(newMode ? darkTheme : lightTheme);
    
    try {
      await AsyncStorage.setItem('themePreference', newMode ? 'dark' : 'light');
    } catch (e) {
      console.log('Failed to save theme preference', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
