// src/LeaderboardContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const LeaderboardContext = createContext(null);

export const LeaderboardProvider = ({ children }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('day');
  const { isLoggedIn } = useAuth();

  const fetchLeaderboard = useCallback(async (selectedTimeFrame) => {
    if (isLoggedIn) {
      try {
        const response = await axios.get(`http://localhost:8000/api/leaderboard/?time_frame=${selectedTimeFrame}`);
        setLeaderboardData(response.data);
        setTimeFrame(selectedTimeFrame);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    }
  }, [isLoggedIn]);

  return (
    <LeaderboardContext.Provider value={{ leaderboardData, timeFrame, fetchLeaderboard }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => useContext(LeaderboardContext);