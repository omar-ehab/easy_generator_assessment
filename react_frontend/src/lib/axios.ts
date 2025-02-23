import axios, { AxiosResponse } from 'axios';
import { HOST_API } from './config';
import API_ENDPOINTS from '@/lib/apiPaths.ts';

export type AuthResponseType = {
  access_token: string;
};

const refreshToken = async (): Promise<AuthResponseType> => {
  const {
    data: { data },
  } = await axios.post<{ data: AuthResponseType }>(
    `${HOST_API}${API_ENDPOINTS.AUTH.REFRESH}`,
    {
      mode: 'cookie',
    },
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
  return data;
};

const axiosInstance = axios.create({
  baseURL: HOST_API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const access_token = localStorage.getItem('at');
    if (access_token) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${access_token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const config = error?.config;
    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;
      const data = await refreshToken();
      if (data) {
        localStorage.setItem('at', data.access_token);
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${data.access_token}`,
        };
        return axiosInstance(config);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
