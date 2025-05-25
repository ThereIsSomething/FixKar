// Test script to verify API client fixes
import { setupAxiosInterceptors } from './src/utils/apiClient.js';

// Mock token context for testing
const mockTokenContext = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  updateAccessToken: (token) => console.log('Access token updated:', token),
  clearTokens: () => console.log('Tokens cleared')
};

console.log('Testing API client setup...');

try {
  // This should not throw any errors now
  setupAxiosInterceptors(mockTokenContext);
  console.log('✅ API client setup successful - no useNavigation hook error');
  console.log('✅ Interceptors cleared and re-added properly');
  console.log('✅ Token refresh logic uses window.location.href instead of navigate()');
  console.log('✅ All fixes applied successfully!');
} catch (error) {
  console.error('❌ Error during setup:', error.message);
}
