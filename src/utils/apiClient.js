import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
});

// Setup axios interceptors for automatic token refresh
export const setupAxiosInterceptors = (tokenContext) => {
  const { accessToken, refreshToken, updateAccessToken, clearTokens } = tokenContext;

  // Request interceptor to add auth token
  apiClient.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // If request failed with 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
        originalRequest._retry = true;

        try {
          // Make refresh token request
          const refreshResponse = await axios.post(`${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000'}/token/refresh`, {
            refresh_token: refreshToken
          });

          if (refreshResponse.status === 200 && refreshResponse.data.access) {
            const newAccessToken = refreshResponse.data.access;
            updateAccessToken(newAccessToken);

            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default apiClient;
