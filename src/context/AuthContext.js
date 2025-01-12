import React, { createContext, useContext, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
  
    const isAuthenticated = Boolean(user);
  
    return (
      <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
        {children}
      </AuthContext.Provider>
    );
  };