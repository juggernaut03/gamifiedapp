import axios from 'axios';
import apiConfig from './config';

export const login = async (email, password) => {
  try {
    const response = await axios.post(apiConfig.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const response = await axios.post(apiConfig.AUTH.SIGNUP, userData);
    return response.data;
  } catch (error) {
    console.error('Signup API error:', error);
    throw error;
  }
};

export const logout = async (token) => {
  try {
    const response = await axios.post(
      apiConfig.AUTH.LOGOUT,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Logout API error:', error);
    throw error;
  }
};
