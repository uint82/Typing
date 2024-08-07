// src/HistoryContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const HistoryContext = createContext(null);

export const HistoryProvider = ({ children }) => {
  const [testHistory, setTestHistory] = useState([]);
  const { isLoggedIn } = useAuth();

  const fetchTestHistory = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const response = await axios.get('http://localhost:8000/api/test-results/');
        setTestHistory(response.data);
      } catch (error) {
        console.error('Error fetching test history:', error);
      }
    }
  }, [isLoggedIn]);

  const addTestResult = useCallback(async (newResult) => {
    if (isLoggedIn) {
      try {
        const response = await axios.post('http://localhost:8000/api/test-results/', newResult);
        setTestHistory(prevHistory => [...prevHistory, response.data]);
        return response.data;
      } catch (error) {
        console.error('Error adding test result:', error);
        throw error;
      }
    }
  }, [isLoggedIn]);

  return (
    <HistoryContext.Provider value={{ testHistory, fetchTestHistory, addTestResult }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => useContext(HistoryContext);