import {
  AuthUserType,
  getAuthUserApi,
} from '@/services/auth/getAuthUserApi.ts';
import { loginApi, LoginArgs } from '@/services/auth/loginApi.ts';
import { registerApi, RegisterArgs } from '@/services/auth/registerApi.ts';
import { logoutApi } from '@/services/auth/logoutApi.ts';
import { Toaster } from 'sonner';
import * as React from 'react';
import { AuthContext } from '../hooks/useAuth.ts';

type User = AuthUserType | null;
type State = { isAuthenticated: boolean; isInitialized: boolean; user: User };
type Action =
  | { type: 'init'; payload: { user: User } }
  | { type: 'login'; payload: AuthUserType }
  | { type: 'logout' };
export type AuthContext = State & {
  login: ({ email, password }: LoginArgs) => Promise<void>;
  register: ({ name, email, password }: RegisterArgs) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<User | null>;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'init': {
      const user = action.payload.user;
      if (user)
        return { isAuthenticated: true, isInitialized: true, user: user };
      return { ...state, isInitialized: true };
    }
    case 'login':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'logout':
      return { ...state, isAuthenticated: false, user: null };
    default:
      throw new Error('unknown action type');
  }
}

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

function setStoredAccessToken(accessToken: string | null) {
  if (accessToken) {
    localStorage.setItem('at', accessToken);
  } else {
    localStorage.removeItem('at');
  }
}

function getStoredAccessToken() {
  return localStorage.getItem('at');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const login = React.useCallback(async ({ email, password }: LoginArgs) => {
    const data = await loginApi({ email, password });
    setStoredAccessToken(data.access_token);
    const user = await getAuthUserApi();
    dispatch({ type: 'login', payload: user });
  }, []);

  const register = React.useCallback(
    async ({ name, email, password }: RegisterArgs) => {
      const data = await registerApi({ name, email, password });
      setStoredAccessToken(data.access_token);
      const user = await getAuthUserApi();
      dispatch({ type: 'login', payload: user });
    },
    []
  );

  const logout = React.useCallback(async () => {
    logoutApi().finally(() => {
      setStoredAccessToken(null);
      dispatch({ type: 'logout' });
    });
  }, []);

  const initialize = async () => {
    try {
      const accessToken = getStoredAccessToken();
      if (!accessToken) {
        dispatch({ type: 'init', payload: { user: null } });
        return null;
      }
      const user = await getAuthUserApi();
      dispatch({ type: 'init', payload: { user } });
      return user;
    } catch (err) {
      console.error(err);
      dispatch({ type: 'init', payload: { user: null } });
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, initialize }}
    >
      {children}
      <Toaster richColors position={'bottom-right'} dir={'ltr'} />
    </AuthContext.Provider>
  );
}
