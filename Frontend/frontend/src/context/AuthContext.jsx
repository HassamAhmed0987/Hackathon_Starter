import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial session check on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const data = await authApi.getProfile();
        // Adjust depending on whether backend returns user directly or nested under data/user
        setUser(data.user || data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    await authApi.login(credentials);
    const data = await authApi.getProfile();
    setUser(data.user || data);
  };

  const register = async (userData) => {
    await authApi.register(userData);
    const data = await authApi.getProfile();
    setUser(data.user || data);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    const data = await authApi.getProfile();
    setUser(data.user || data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};