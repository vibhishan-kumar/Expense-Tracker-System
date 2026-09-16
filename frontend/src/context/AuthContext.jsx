import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  login: () => {},
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Bootstrap auth state from localStorage on mount
    const token = localStorage.getItem('token');
    const raw = localStorage.getItem('user');
    if (token && raw && raw !== 'undefined') {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        logout();
      }
    }

    // Global axios interceptor — attach Bearer token to every request
    const interceptor = axios.interceptors.request.use(config => {
      const t = localStorage.getItem('token');
      if (t && config.headers) {
        config.headers['Authorization'] = `Bearer ${t}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
