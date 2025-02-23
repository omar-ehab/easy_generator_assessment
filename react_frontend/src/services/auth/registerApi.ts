import API_ENDPOINTS from '@/lib/apiPaths.ts';
import axiosInstance from '@/lib/axios';
import AuthResponse from '@/types/AuthResponse.ts';

export type RegisterArgs = {
  name: string;
  email: string;
  password: string;
};


export const registerApi = async ({ name, email, password }: RegisterArgs) => {
  const {
    data: { payload },
  } = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
    name,
    email,
    password,
    mode: 'cookie',
  });

  return payload;
};
