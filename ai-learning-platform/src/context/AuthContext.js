import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const bootstrapAsync = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          // We have a token, set it to state
          setUser({ token: userToken });
        }
      } catch (e) {
        console.log('Failed to load user token', e);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (userData) => {
    try {
      // Here you would call your API to authenticate
      // For now, just store the token
      await AsyncStorage.setItem('userToken', userData.token);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUser(null);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      // Here you would call your API to register a new user
      // Then log them in
      await login(userData);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
