import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Check localStorage for authentication state
        const storedAuth = localStorage.getItem('isAuthenticated');
        return storedAuth ? JSON.parse(storedAuth) : false;
    });

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
