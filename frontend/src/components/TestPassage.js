import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useUserProfile } from '../UserProfileContext';
import './TestPassage.css';


const wordList = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "am", "was", "are", "were", "been", "has", "had", "did", "does",
  "said", "find", "tell", "ask", "seem", "feel", "try", "leave", "call",
  "play", "move", "run", "bring", "live", "write", "meet", "set", "sit",
  "stand", "learn", "lead", "understand", "watch", "follow", "stop", "read",
  "start", "grow", "open", "walk", "win", "offer", "remember", "love", "consider",
  "appear", "buy", "wait", "die", "send", "expect", "build", "stay", "fall",
  "reach", "remain", "suggest", "raise", "pass", "sell", "require", "report",
  "decide", "explain", "hope", "develop", "carry", "break", "receive", "agree",
  "support", "hit", "produce", "eat", "cover", "catch", "draw", "choose",
  "cause", "point", "listen", "realize", "place", "close", "plan", "order",
  "believe", "help", "turn", "show", "hear", "let", "begin", "might", "both",
  "while", "keep", "long", "always", "own", "last", "great", "same", "another",
  "few", "such", "why", "still", "every", "never", "life", "world", "down",
  "may", "old", "many", "where", "much", "should", "very", "something", "school",
  "those", "each", "different", "really", "between", "often", "away", "however",
  "off", "next", "must", "big", "high", "something", "part", "important", "country",
  "until", "against", "though", "course", "young", "least", "enough", "without",
  "put", "through", "fact", "less", "probably", "large", "week", "during",
  "small", "job", "money", "left", "right", "among", "bad", "form", "home",
  "best", "better", "true", "sure", "kind", "area", "face", "rather", "anything",
  "boy", "girl", "child", "case", "problem", "hour", "place", "end", "name",
  "idea", "information", "question", "power", "change", "interest", "book", "water",
  "room", "business", "company", "group", "number", "music", "family", "friend",
  "story", "example", "paper", "lot", "result", "eye", "word", "student", "study",
  "mother", "father", "parent", "hand", "party", "member", "car", "city", "process",
  "mind", "head", "person", "health", "level", "office", "door", "art", "war",
  "issue", "market", "field", "food", "air", "nature", "structure", "bank", "morning"
];


  const generateRandomWords = (count) => {
    const randomWords = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      randomWords.push(wordList[randomIndex]);
    }
    return randomWords;
  };

  const TestPassage = ({ onTestComplete }) => {
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [timer, setTimer] = useState(60);
    const [isTestActive, setIsTestActive] = useState(false);
    const [isTestEnded, setIsTestEnded] = useState(false);
    const [results, setResults] = useState(null);
    const [correctCharacters, setCorrectCharacters] = useState(0);
    const [incorrectCharacters, setIncorrectCharacters] = useState(0);
    const [wordStatus, setWordStatus] = useState([]);
    const [displayStartIndex, setDisplayStartIndex] = useState(0);
    const [totalCharacters, setTotalCharacters] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [finalWPM, setFinalWPM] = useState(0);
    const [caretPosition, setCaretPosition] = useState(0);
    const [currentWordChars, setCurrentWordChars] = useState([]);
    const [refreshToggle, setRefreshToggle] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { userProfile, updateUserProfile, fetchUserProfile } = useUserProfile();
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const { isLoggedIn } = useAuth();
    const inputRef = useRef(null);
  
    useEffect(() => {
        generateNewWords();
    }, []);
    
    useEffect(() => {
        if (words.length > 0) {
          initializeCurrentWordChars(words[currentWordIndex]);
          setCaretPosition(0);
        }
      }, [words, displayStartIndex, currentWordIndex]);
  
      const generateNewWords = () => {
        const firstRow = generateRowWords();
        const secondRow = generateRowWords();
        const newWords = [...firstRow, ...secondRow];
        setWords(newWords);
        setWordStatus(new Array(newWords.length).fill(''));
        setCurrentWordIndex(0);
        setDisplayStartIndex(0);
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

    const initializeCurrentWordChars = (word) => {
        setCurrentWordChars(word.split('').map(char => ({ char, status: '' })));
    };
  
    const startTest = () => {
        if (!isTestActive) {
          setIsTestActive(true);
          setTimer(60);
          setStartTime(Date.now());
          inputRef.current.focus();
        }
    };
  
    const endTest = () => {
      if (isTestEnded) return; // Prevent multiple calls to endTest
  
      setIsTestActive(false);
      setIsTestEnded(true);
      calculateResults();

      if (!isLoggedIn) {
        setShowLoginMessage(true);
        setTimeout(() => setShowLoginMessage(false), 7000);
      }
    };
  
    const handleInputChange = (e) => {
        if (isTestEnded) return;
        
        const inputValue = e.target.value;
        setUserInput(inputValue);
        
        if (!isTestActive && inputValue.length === 1) {
          startTest();
        }
      
        const currentWord = words[currentWordIndex];
        const newCurrentWordChars = currentWord.split('').map((char, index) => ({
          char: char,
          status: index < inputValue.length 
            ? (inputValue[index] === char ? 'correct' : 'incorrect')
            : ''
        }));
      
        setCurrentWordChars(newCurrentWordChars);
        setCaretPosition(inputValue.length);
    };
    
    const handleKeyDown = (e) => {
      if (isTestEnded) return;
  
      if (e.key === ' ') {
          e.preventDefault();
          
          // Check if at least one character has been typed
          if (userInput.trim().length > 0) {
              checkWord(userInput.trim());
              setUserInput('');
              moveToNextWord();
              setCaretPosition(0);
            }
        }
    };

    const moveToNextWord = () => {
        if (currentWordIndex < words.length - 1) {
          const nextIndex = currentWordIndex + 1;
          const firstRowEndIndex = findRowEndIndex(displayStartIndex);
      
          if (nextIndex > firstRowEndIndex) {
            // Move to the next row
            const newDisplayStartIndex = firstRowEndIndex + 1;
            const newSecondRowWords = generateRowWords();
      
            setWords(prevWords => [
              ...prevWords.slice(0, newDisplayStartIndex + findRowEndIndex(newDisplayStartIndex) + 1),
              ...newSecondRowWords
            ]);
      
            setWordStatus(prevStatus => [
              ...prevStatus.slice(0, newDisplayStartIndex + findRowEndIndex(newDisplayStartIndex) + 1),
              ...new Array(newSecondRowWords.length).fill('')
            ]);
      
            setDisplayStartIndex(newDisplayStartIndex);
          }
      
          setCurrentWordIndex(nextIndex);
          initializeCurrentWordChars(words[nextIndex]);
        } else {
          endTest();
        }
    };

    const findRowEndIndex = (startIndex) => {
        let charCount = 0;
        let endIndex = startIndex;
        while (charCount < 68 && endIndex < words.length) {
          charCount += words[endIndex].length + 1;
          if (charCount > 70) break;
          endIndex++;
        }
        return endIndex - 1;
    };

    const generateRowWords = () => {
        let newWords = [];
        let charCount = 0;
        while (charCount < 68) {
          const word = generateRandomWords(1)[0];
          if (charCount + word.length + 1 > 70) break;
          newWords.push(word);
          charCount += word.length + 1;
        }
        return newWords;
      };

    const calculateRowCharCount = (words) => {
        return words.reduce((count, word) => count + word.length + 1, 0) - 1; // -1 to not count the last space
      };

    const calculateCharacterCount = (word) => {
        return word.length + 1; 
    };
  
    const checkWord = (input) => {
        const correctWord = words[currentWordIndex];
        const newWordStatus = [...wordStatus];
        
        if (input === correctWord) {
            newWordStatus[currentWordIndex] = 'c';
            setCorrectCharacters(prev => prev + correctWord.length);
        } else {
            newWordStatus[currentWordIndex] = 'i';
            setIncorrectCharacters(prev => prev + correctWord.length);
        }
        
        setWordStatus(newWordStatus);
        setTotalCharacters(prev => prev + correctWord.length + 1); // +1 for space
    };
  
    const calculateResults = () => {
      if (isSubmitting) return; // Prevent recalculation if already submitting
    
      const timeInMinutes = (60 - timer) / 60;
      const grossWpm = Math.round((totalCharacters / 5) / timeInMinutes);
      const totalAttempted = correctCharacters + incorrectCharacters;
      const accuracy = totalAttempted > 0 ? (correctCharacters / totalAttempted) : 0;
      const wpm = Math.round(grossWpm * accuracy); // Calculate real WPM by multiplying grossWPM with accuracy
    
      setFinalWPM(wpm); // Set the final WPM to the real WPM, not gross WPM
    
      const results = { 
        wpm, 
        grossWpm, // Add grossWpm to the results
        accuracy: Math.round(accuracy * 100), 
        correctCharacters, 
        incorrectCharacters 
      };
      onTestComplete(results);
    
      if (isLoggedIn) {
        submitResults(wpm, grossWpm, Math.round(accuracy * 100), correctCharacters, incorrectCharacters);
      }
    };
    
    
  
    const submitResults = async (wpm, grossWpm, accuracy, correctCharacters, incorrectCharacters) => {
      if (!isLoggedIn || isSubmitting) {
        console.log('User is not logged in or results are already being submitted. Submission skipped.');
        return;
      }
    
      setIsSubmitting(true);
    
      try {
        // Submit test results
        const response = await axios.post('http://localhost:8000/api/test-results/', {
          wpm,
          gross_wpm: grossWpm,
          accuracy,
          correct_characters: correctCharacters,
          incorrect_characters: incorrectCharacters,
          passage: words.slice(0, currentWordIndex).join(' ')
        });
        console.log('Results submitted successfully:', response.data);
    
        // Update user profile
        if (userProfile) {
          const newTestsTaken = userProfile.tests_taken + 1;
          const updatedProfile = {
            highest_wpm: Math.max(userProfile.highest_wpm, wpm),
            average_wpm: (userProfile.average_wpm * userProfile.tests_taken + wpm) / newTestsTaken,
            average_accuracy: (userProfile.average_accuracy * userProfile.tests_taken + accuracy) / newTestsTaken,
            average_raw_wpm: (userProfile.average_raw_wpm * userProfile.tests_taken + grossWpm) / newTestsTaken,
            tests_taken: newTestsTaken
          };
          await updateUserProfile(updatedProfile);
          await fetchUserProfile();
        }
      } catch (error) {
        console.error('Error submitting results or updating profile:', error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const calculateWPM = () => {
      if (isTestEnded) return finalWPM;
      if (!startTime) return 0;
      
      const timeElapsed = (Date.now() - startTime) / 60000; // Convert to minutes
      const grossWpm = (totalCharacters / 5) / timeElapsed;
      
      const totalAttempted = correctCharacters + incorrectCharacters;
      const accuracy = totalAttempted > 0 ? correctCharacters / totalAttempted : 0;
      
      const wpm = Math.round(grossWpm * accuracy);
      
      return wpm;
    };
    
  
    const renderWords = () => {
        const firstRowEndIndex = findRowEndIndex(displayStartIndex);
        const firstRow = words.slice(displayStartIndex, firstRowEndIndex + 1);
        const secondRow = words.slice(firstRowEndIndex + 1, findRowEndIndex(firstRowEndIndex + 1) + 1);
      
        return (
          <div className="word-display">
            <div className="word-row">
              {firstRow.map((word, index) => renderWord(word, displayStartIndex + index))}
            </div>
            <div className="word-row">
              {secondRow.map((word, index) => renderWord(word, firstRowEndIndex + 1 + index))}
            </div>
          </div>
        );
    };
      
      const renderWord = (word, index) => (
        <span
          key={`word-${index}`}
          className={`word 
            ${index === currentWordIndex ? 'current-word' : ''} 
            ${wordStatus[index] === 'c' ? 'correct' : ''}
            ${wordStatus[index] === 'i' ? 'incorrect' : ''}`}
        >
          {index === currentWordIndex ? renderCurrentWord() : word}
        </span>
    );
    
    const renderCurrentWord = () => {
        return (
          <span className="current-word-container">
            {currentWordChars.map((charObj, index) => (
              <span key={index} className={`char ${charObj.status}`}>
                {charObj.char}
              </span>
            ))}
            <span 
              className="caret" 
              style={{ 
                left: `${caretPosition * 0.550}em`,
              }}
            ></span>
          </span>
        );
      };

      const resetTest = () => {
        setIsRotating(true);
        setTimeout(() => {
            setIsRotating(false);
            setResults(0);
            setUserInput('');
            generateNewWords();
            setIsTestActive(false);
            setIsTestEnded(false);
            setTimer(60);
            setCorrectCharacters(0);
            setIncorrectCharacters(0);
            setTotalCharacters(0);
            setStartTime(null);
            setCurrentWordIndex(0);
            setDisplayStartIndex(0);
            setWordStatus(new Array(words.length).fill(''));
            initializeCurrentWordChars(words[0]);
            setFinalWPM(0);
            setShowLoginMessage(false);
            setRefreshToggle(prev => !prev);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 500); 
    };
    
      return (
        <div className="typing-test">
          {renderWords()}
          <div className="input-area">
          <input
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type here..."
            disabled={isTestEnded}
            className={isTestEnded ? 'disabled-input' : ''}
            autoFocus={true}
          />
          <div className="test-info">
            <span className="wpm">{isTestActive || isTestEnded ? calculateWPM() : 0} <small>WPM</small></span>
            <span className="timer">{timer >= 60 ? '1:00' : `0:${timer < 10 ? '0' : ''}${timer}`}</span>
            <span><button onClick={resetTest} className={`reset-button ${isRotating ? 'rotating' : ''}`}>↻</button></span>
          </div>
          {showLoginMessage && !isLoggedIn && (
        <div className="login-message-popup">
          Login to save your score and enter the leaderboard!
        </div>
      )}
        </div>
    </div> 
    );
};
    
export default TestPassage;
