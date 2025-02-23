import React from 'react';
import { AuthContext as AuthContextType } from '../context/AuthProvider.tsx';

export const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
