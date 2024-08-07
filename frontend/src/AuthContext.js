// src/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const REFRESH_INTERVAL = 60 * 40 * 100; // 200 milliseconds for testing

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('access_token'));

  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken
        });
        const newToken = response.data.access;
        localStorage.setItem('access_token', newToken);
        // If the backend returns a new refresh token, update it
        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }
        setToken(newToken);
        setIsLoggedIn(true);
        console.log('Token refreshed'); // For debugging
      } catch (error) {
        console.error('Error refreshing token:', error);
        // Don't logout immediately, maybe the token is still valid
        if (error.response && error.response.status === 401) {
          logout();
        }
      }
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      const intervalId = setInterval(refreshToken, REFRESH_INTERVAL);
      return () => clearInterval(intervalId);
    } else {
      setIsLoggedIn(false);
    }
  }, [token, refreshToken]);

  const login = useCallback((accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setToken(accessToken);
    setIsLoggedIn(true);
  }, []);

  // Axios interceptor to add the token to all requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      config => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);