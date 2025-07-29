import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import * as api from '../services/api';

// API endpoints
const API_BASE_URL = 'http://localhost:8080';
const API_ENDPOINTS = {
  AUTH_CHECK: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  PROFILE: '/api/profile'
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  // DRY function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const profileResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.PROFILE}`, {
        withCredentials: true
      });
      
      // Set user with profile information
      setUser({ 
        isAuthenticated: true,
        email: profileResponse.data.email,
        username: profileResponse.data.username,
        ...profileResponse.data
      });
      
      console.log('User profile fetched:', profileResponse.data.email);
      return profileResponse.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const checkAuth = async () => {
    try {
      await axios.get(`${API_BASE_URL}${API_ENDPOINTS.AUTH_CHECK}`, {
        withCredentials: true
      });
      
      // After confirming authentication, get user profile
      await fetchUserProfile();
    } catch (error) {
      setUser(null);
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      setLoading(true);
      
      // Login using the API service
      const loginResponse = await api.login(userData.username, userData.password);
      console.log('Login response:', loginResponse);
      
      // Short delay to allow cookies to be set
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // After successful login, fetch user profile
      const userProfile = await fetchUserProfile();
      
      if (!userProfile) {
        throw new Error('Failed to fetch user profile after login');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (navigate) => {
    try {
      await axios.get(`${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
        withCredentials: true
      });
      setUser(null);
      
      // Redirect to login page if navigate function is provided
      if (navigate) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
