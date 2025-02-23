import API_ENDPOINTS from '@/lib/apiPaths.ts';
import axiosInstance from '@/lib/axios';

type GetAuthUserResponse = {
  payload: {
    id: string;
    name: string;
    email: string;
  };
};

export type AuthUserType = {
  id: string;
  name: string;
  email: string;
};

export const getAuthUserApi = async (): Promise<AuthUserType> => {
  const {
    data: { payload: user },
  } = await axiosInstance.get<GetAuthUserResponse>(API_ENDPOINTS.PROFILE);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};
