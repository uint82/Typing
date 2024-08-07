import React, { useEffect, useState } from 'react';
import { useHistory } from '../HistoryContext';
import './History.css';

const History = () => {
  const { testHistory, fetchTestHistory } = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedHistory, setDisplayedHistory] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchTestHistory();
      } catch (err) {
        setError('Failed to fetch history data. Please try again later.');
        console.error('Error fetching history data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [fetchTestHistory]);

  useEffect(() => {
    setDisplayedHistory(testHistory.slice(0, displayCount));
  }, [testHistory, displayCount]);

  const handleShowMore = () => {
    setDisplayCount(prevCount => prevCount + 10);
  };

  if (isLoading) {
    return <div className="history loading">Loading history data...</div>;
  }

  if (error) {
    return <div className="history error">{error}</div>;
  }

  return (
    <div className="history">
      <h2>Test History</h2>
      <div className="profile-header">Your typing test results over time</div>
      {displayedHistory.length > 0 ? (
        <>
          <table className="history-table">
            <thead>
              <tr>
                <th>WPM</th>
                <th>Raw Wpm</th>
                <th>Accuracy</th>
                <th>Correct Characters</th>
                <th>Incorrect Characters</th>
                <th>Time</th>
                <th>Date Taken</th>
              </tr>
            </thead>
            <tbody>
              {displayedHistory.map((result, index) => (
                <tr key={result.id || index}>
                  <td>{result.wpm}</td>
                  <td>{result.gross_wpm}</td>
                  <td>{result.accuracy.toFixed(2)}%</td>
                  <td>{result.correct_characters}</td>
                  <td>{result.incorrect_characters}</td>
                  <td>{result.time || 1}:00</td>
                  <td>{new Date(result.date_taken).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {testHistory.length > displayCount && (
            <button className="show-more-btn" onClick={handleShowMore}>
              Show More
            </button>
          )}
        </>
      ) : (
        <p>No history data available.</p>
      )}
    </div>
  );
};

export default History;