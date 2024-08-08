import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('day');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resetTime, setResetTime] = useState('');

  const fetchLeaderboard = async (selectedTimeFrame) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/api/leaderboard/?timeFrame=${selectedTimeFrame}`);
      setLeaderboardData(response.data);
    } catch (err) {
      setError('Failed to fetch leaderboard data. Please try again later.');
      console.error('Error fetching leaderboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(timeFrame);
    updateResetTime();
    const timer = setInterval(updateResetTime, 1000);
    return () => clearInterval(timer);
  }, [timeFrame]);

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  const updateResetTime = () => {
    const now = new Date();
    let resetDate = new Date(now);
    resetDate.setHours(6, 0, 0, 0);

    if (now > resetDate) {
      resetDate.setDate(resetDate.getDate() + 1);
    }

    if (timeFrame === 'week') {
      const daysUntilMonday = (1 + 7 - resetDate.getDay()) % 7;
      resetDate.setDate(resetDate.getDate() + daysUntilMonday);
    } else if (timeFrame === 'month') {
      resetDate = new Date(resetDate.getFullYear(), resetDate.getMonth() + 1, 1, 6, 0, 0, 0);
    }

    const timeDiff = resetDate - now;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    let resetTimeString = '';
    if (timeFrame === 'day') {
      resetTimeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      resetTimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    setResetTime(resetTimeString);
  };

  if (isLoading) {
    return <div className="leaderboard loading">Loading leaderboard data...</div>;
  }

  if (error) {
    return <div className="leaderboard error">{error}</div>;
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <select 
          className="time-frame-select"
          value={timeFrame} 
          onChange={handleTimeFrameChange}
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="all_time">All Time</option>
        </select>
      </div>
      {timeFrame !== 'all_time' && (
        <div className="reset-timer">
          Reset in: {resetTime}
        </div>
      )}
      {leaderboardData.length > 0 ? (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>WPM</th>
              <th>Accuracy</th>
              <th>Time</th>
              <th>Date Taken</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => (
              <tr key={entry.id || index}>
                <td>{index + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.wpm}</td>
                <td>{entry.accuracy.toFixed(2)}%</td>
                <td>{entry.time}:00</td>
                <td>{new Date(entry.date_taken).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leaderboard data available for this time frame.</p>
      )}
    </div>
  );
};

export default Leaderboard;
