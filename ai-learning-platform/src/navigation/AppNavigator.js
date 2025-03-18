import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Return a loading screen here
    return null;
  }

  return user ? <TabNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
