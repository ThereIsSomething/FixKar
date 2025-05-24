// auth.js - Authentication utility functions

/**
 * Get user email from session storage
 */
export const getUserEmail = () => {
  return sessionStorage.getItem('userEmail');
};

/**
 * Set user email in session storage
 */
export const setUserEmail = (email) => {
  sessionStorage.setItem('userEmail', email);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!sessionStorage.getItem('userEmail');
};

/**
 * Clear all authentication state
 */
export const clearAuthenticationState = () => {
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('userProfile');
  sessionStorage.removeItem('userLocation');
  sessionStorage.removeItem('authToken');
};

/**
 * Set authentication token
 */
export const setAuthToken = (token) => {
  sessionStorage.setItem('authToken', token);
};

/**
 * Get authentication token
 */
export const getAuthToken = () => {
  return sessionStorage.getItem('authToken');
};

/**
 * Set user role
 */
export const setUserRole = (role) => {
  sessionStorage.setItem('userRole', role);
};

/**
 * Get user role
 */
export const getUserRole = () => {
  return sessionStorage.getItem('userRole');
};
