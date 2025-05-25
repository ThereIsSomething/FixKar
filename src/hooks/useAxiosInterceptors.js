import { useEffect } from 'react';
import { useToken } from '../context/TokenContext';
import { setupAxiosInterceptors } from '../utils/apiClient';

export const useAxiosInterceptors = () => {
  const tokenContext = useToken();

  useEffect(() => {
    setupAxiosInterceptors(tokenContext);
  }, [tokenContext.accessToken, tokenContext.refreshToken]);

  return tokenContext;
};
