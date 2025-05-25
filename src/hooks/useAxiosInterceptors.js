import { useEffect } from 'react';
import { useToken } from '../context/TokenContext';

export const useAxiosInterceptors = () => {
  const tokenContext = useToken();

  // Note: Interceptors are now handled internally by the apiClient instance
  // No need to manually setup interceptors here anymore

  return tokenContext;
};
