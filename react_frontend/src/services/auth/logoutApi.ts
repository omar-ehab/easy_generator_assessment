import API_ENDPOINTS from '@/lib/apiPaths.ts';
import axiosInstance from '@/lib/axios';

export const logoutApi = async () => {
  axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT).finally(() => {
    localStorage.removeItem('at');
  });
};
