import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import './Testing.css';

const sampleText = `
The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. 
How vexingly quick daft zebras jump! The five boxing wizards jump quickly. 
Sphinx of black quartz, judge my vow. Two driven jocks help fax my big quiz. 
Five quacking zephyrs jolt my wax bed. The jay, pig, fox, zebra, and my wolves quack! 
Blowzy red vixens fight for a quick jump. Joaquin Phoenix was gazed by MTV for luck. 
A wizard's job is to vex chumps quickly in fog. Watch "Jeopardy!", Alex Trebek's fun TV quiz game. 
Waltz, nymph, for quick jigs vex Bud. Glib jocks quiz nymph to vex dwarf. 
Sculpt, flux, quartz, judge, nymph, and spy. Adjust, burst, crwth, visor, and zip. 
Behold! TV quiz shows are back on June 16th for a new champion to win big prizes.
`;

const generateWords = (text) => {
  return text.toLowerCase().match(/\b(\w+)\b/g);
};

const Testing = () => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(60);
  const [isTestActive, setIsTestActive] = useState(false);
  const [results, setResults] = useState(null);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [wordStatus, setWordStatus] = useState([]);
  const [displayStartIndex, setDisplayStartIndex] = useState(0);
  const inputRef = useRef(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    generateNewWords();
  }, []);

  const generateNewWords = () => {
    const newWords = generateWords(sampleText);
    setWords(newWords);
    setCurrentWordIndex(0);
    setDisplayStartIndex(0);
    setWordStatus(new Array(newWords.length).fill(''));
  };


  useEffect(() => {
    let interval;
    if (isTestActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      endTest();
    }
    return () => clearInterval(interval);
  }, [isTestActive, timer]);

  const startTest = () => {
    if (!isTestActive) {
      setIsTestActive(true);
      setTimer(60);
      inputRef.current.focus();
    }
  };

  const endTest = () => {
    setIsTestActive(false);
    calculateResults();
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setUserInput(inputValue);
    
    if (!isTestActive && inputValue.length === 1) {
      startTest();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      checkWord(userInput.trim());
      setUserInput('');
      moveToNextWord();
    }
  };

  const moveToNextWord = () => {
    const nextWordIndex = currentWordIndex + 1;
    setCurrentWordIndex(nextWordIndex);

    if (nextWordIndex % 13 === 0) {
      setDisplayStartIndex(nextWordIndex);
      
      // Generate new words if needed
      if (nextWordIndex + 13 >= words.length) {
        const additionalWords = generateWords(sampleText);
        setWords(prevWords => [...prevWords, ...additionalWords]);
        setWordStatus(prevStatus => [...prevStatus, ...new Array(additionalWords.length).fill('')]);
      }
    }
  };

  const checkWord = (input) => {
    const isCorrect = input === words[currentWordIndex];
    const newWordStatus = [...wordStatus];
    newWordStatus[currentWordIndex] = isCorrect ? 'correct' : 'incorrect';
    setWordStatus(newWordStatus);
  
    if (isCorrect) {
      setCorrectWords(prev => prev + 1);
    } else {
      setIncorrectWords(prev => prev + 1);
    }
  };

  const calculateResults = () => {
    const wpm = Math.round(correctWords);
    const totalAttempted = correctWords + incorrectWords;
    const accuracy = totalAttempted > 0 ? Math.round((correctWords / totalAttempted) * 100) : 0;

    setResults({ wpm, accuracy, correctWords, incorrectWords });

    if (isLoggedIn) {
      submitResults(wpm, accuracy, correctWords, incorrectWords);
    }
  };

  const submitResults = async (wpm, accuracy, correctWords, incorrectWords) => {
    try {
      await axios.post('http://localhost:8000/api/test-results/', {
        wpm,
        accuracy,
        correct_words: correctWords,
        incorrect_words: incorrectWords,
        passage: words.slice(0, correctWords + incorrectWords).join(' ')
      });
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  };

  const renderWords = () => {
    const firstRow = words.slice(displayStartIndex, displayStartIndex + 13);
    const secondRow = words.slice(displayStartIndex + 13, displayStartIndex + 26);
  
    return (
      <>
        <div className="word-row">
          {firstRow.map((word, index) => (
            <span
              key={displayStartIndex + index}
              className={`word ${displayStartIndex + index === currentWordIndex ? 'current-word' : ''} ${wordStatus[displayStartIndex + index]}`}
            >
              {word}
            </span>
          ))}
        </div>
        <div className="word-row">
          {secondRow.map((word, index) => (
            <span
              key={displayStartIndex + 13 + index}
              className={`word ${displayStartIndex + 13 + index === currentWordIndex ? 'current-word' : ''} ${wordStatus[displayStartIndex + 13 + index]}`}
            >
              {word}
            </span>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="typing-test">
      <h2>Typing Test</h2>
      <div className="word-display">
        {renderWords()}
      </div>
      {!results && (
        <>
          <input
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type the word here and press space to submit..."
            disabled={!!results}
          />
          {isTestActive && <div className="timer">Time left: {timer} seconds</div>}
        </>
      )}
      {results && (
        <div className="results">
          <h3>Results:</h3>
          <p>Words per minute: {results.wpm}</p>
          <p>Accuracy: {results.accuracy}%</p>
          <p>Correct words: {results.correctWords}</p>
          <p>Incorrect words: {results.incorrectWords}</p>
          <button onClick={() => {
            setResults(null);
            setUserInput('');
            generateNewWords();
            setIsTestActive(false);
            setTimer(60);
            setCorrectWords(0);
            setIncorrectWords(0);
          }}>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Testing;