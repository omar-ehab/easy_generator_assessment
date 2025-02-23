import API_ENDPOINTS from '@/lib/apiPaths.ts';
import axiosInstance from '@/lib/axios';
import AuthResponse from '@/types/AuthResponse.ts';

export type LoginArgs = {
  email: string;
  password: string;
};

export const loginApi = async ({ email, password }: LoginArgs) => {
  const {
    data: { payload },
  } = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
    mode: 'cookie',
  });

  return payload;
};

