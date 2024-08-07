import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const UserProfileContext = createContext(null);

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const { isLoggedIn, logout } = useAuth();  // Assume logout function exists in AuthContext

  const fetchUserProfile = async () => {
    if (isLoggedIn) {
      try {
        const response = await axios.get('http://localhost:8000/api/user-profile/');
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.response && error.response.status === 401) {
          logout();  // Log out the user if unauthorized
        }
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [isLoggedIn]);

  const updateUserProfile = async (updatedData) => {
    try {
      const response = await axios.put('http://localhost:8000/api/user-profile/', updatedData);
      setUserProfile(response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  return (
    <UserProfileContext.Provider value={{ userProfile, fetchUserProfile, updateUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);