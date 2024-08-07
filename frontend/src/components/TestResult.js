import React from 'react';
import './TestResult.css';

const TestResult = ({ results }) => {
  return (
    <div className="test-result">
      <h3>Test Results</h3>
      <div className="result-grid">
        <div className="result-item">
          <span className="result-label">WPM </span>
          <span className="result-value">{results.wpm > 0 ? `${results.wpm}` : 0}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Gross WPM</span>
          <span className="result-value">{results.grossWpm > 0 ? `${results.grossWpm}` : 0}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Accuracy</span>
          <span className="result-value">{results.accuracy > 0 ? `${results.accuracy}%` : '-'}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Correct Characters</span>
          <span className="result-value">{results.correctCharacters > 0 ? `${results.correctCharacters}` : '-'}</span>
        </div>
        <div className="result-item">
          <span className="result-label">Incorrect Characters</span>
          <span className="result-value">{results.incorrectCharacters > 0 ? `${results.incorrectCharacters}` : '-'}</span>
        </div>
      </div>
    </div>
  )
};


export default TestResult;