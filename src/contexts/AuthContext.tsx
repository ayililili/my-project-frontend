import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import api from '../services/api';

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
      api.post('/check-token', { token: accessToken })
        .then(() => setIsLoggedIn(true))
        .catch(async () => {
          try {
            const response = await api.post('/refresh-token');
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

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('accessToken');
    api.post('/logout');
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
