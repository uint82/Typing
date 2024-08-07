import React, { useState } from 'react';
import TestPassage from '../components/TestPassage';
import TestResult from '../components/TestResult';
import Leaderboard from './Leaderboard';

const Home = () => {
  const [results, setResults] = useState({
    wpm: 0,
    accuracy: 0,
    correctWords: 0,
    incorrectWords: 0
  });

  const handleTestComplete = (testResults) => {
    setResults(testResults);
  };

  const handleTryAgain = () => {
    setResults({
      wpm: 0,
      accuracy: 0,
      correctWords: 0,
      incorrectWords: 0
    });
  };

  return (
    <div>
      <TestPassage onTestComplete={handleTestComplete} />
      <TestResult results={results} onTryAgain={handleTryAgain} />
      <Leaderboard />
    </div>
  );
};

export default Home;