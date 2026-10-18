import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi, loginApi, logoutApi } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Fetch current user from /auth/me
  const refresh = async () => {
    try {
      const data = await getMeApi();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      await refresh();
      setLoading(false);
    };

    bootstrapAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    if (data?.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // Ignore network errors during logout
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
