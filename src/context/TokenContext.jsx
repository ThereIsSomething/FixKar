import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TokenContext = createContext();

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};

export const TokenProvider = ({ children }) => {
    
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Load tokens from localStorage on initial mount
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  // Save tokens to localStorage and state
  const saveTokens = (access, refresh) => {
    if (access) {
      localStorage.setItem('accessToken', access);
      setAccessToken(access);
    }
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
      setRefreshToken(refresh);
    }
  };

  // Get current tokens
  const getARTokens = () => {
    return {
      accessToken,
      refreshToken
    };
  };

  // Update only access token (useful for token refresh)
  const updateAccessToken = (newAccessToken) => {
    if (newAccessToken) {
      localStorage.setItem('accessToken', newAccessToken);
      setAccessToken(newAccessToken);
    }
  };

  // Refresh access token using refresh token
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000'}/token/refresh`, {
        refresh_token: refreshToken
      });

      if (response.status === 200 && response.data.access) {
        const newAccessToken = response.data.access;
        updateAccessToken(newAccessToken);
        return newAccessToken;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If refresh fails, clear all tokens and redirect to login
      clearTokens();
      navigate('/login');
      throw error;
    }
  };

  // Make authenticated API request with automatic token refresh
  const makeAuthenticatedRequest = async (config) => {
    try {
      // Add access token to request headers
      const requestConfig = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await axios(requestConfig);
      return response;
    } catch (error) {
      // If request fails with 401 (Unauthorized), try to refresh token
      if (error.response?.status === 401 && refreshToken) {
        try {
          const newAccessToken = await refreshAccessToken();
          
          // Retry the original request with new token
          const retryConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newAccessToken}`
            }
          };
          
          return await axios(retryConfig);
        } catch (refreshError) {
          throw refreshError;
        }
      }
      throw error;
    }
  };

  // Clear all tokens (logout)
  const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    setAccessToken(null);
    setRefreshToken(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!accessToken;
  };

  const value = {
    accessToken,
    refreshToken,
    saveTokens,
    getARTokens,
    updateAccessToken,
    refreshAccessToken,
    makeAuthenticatedRequest,
    clearTokens,
    isAuthenticated
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};
