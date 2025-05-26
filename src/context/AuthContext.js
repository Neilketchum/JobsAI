import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Retrieved user from localStorage:', storedUser);
    if (storedUser) {
      setUser(storedUser);
      console.log('User state set:', storedUser);
    }
    setLoading(false);
  }, []);

  const login = (profile, token) => {
    setUser(profile);
    console.log('User state set:', profile);
    localStorage.setItem('user', JSON.stringify(profile));
    localStorage.setItem('token', token);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Automatically logout on token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        const msg = error.response?.data?.message || error.message;
        if (msg.includes('TokenExpiredError')) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};