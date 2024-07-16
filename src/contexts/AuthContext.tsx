import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/api';
import { API_BASE_URL } from '../constants';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      api.post(`${API_BASE_URL}/auth/check-token`, { token: accessToken })
        .then(() => setIsLoggedIn(true))
        .catch(async () => {
          try {
            const response = await api.post(`${API_BASE_URL}/auth/token`);
            localStorage.setItem('accessToken', response.data.accessToken);
            setIsLoggedIn(true);
          } catch (error) {
            console.error('Error refreshing token:', error);
            setIsLoggedIn(false);
          }
        });
    }
  }, []);

  const login = (accessToken: string) => {
    setIsLoggedIn(true);
    localStorage.setItem('accessToken', accessToken);
  };

  const logout = async () => {
    setIsLoggedIn(false);
    localStorage.removeItem('accessToken');
    try {
      await api.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
