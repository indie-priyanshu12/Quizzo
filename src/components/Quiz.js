import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Quiz.css';

const quizData = [
  {
    "_id": "672cd00100000001",
    "questionText": "What is the capital city of India?",
    "options": ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    "correctAnswer": "New Delhi",
    "topic": "Geography",
    "difficulty": 1,
    "explanation": "Fun Fact: New Delhi was designed by British architects Sir Edwin Lutyens and Sir Herbert Baker in the early 20th century.",
    "createdBy": "Default"
  },
  {
    "_id": "672cd00100000002",
    "questionText": "What is the largest planet in our solar system?",
    "options": ["Earth", "Jupiter", "Saturn", "Mars"],
    "correctAnswer": "Jupiter",
    "topic": "Science",
    "difficulty": 1,
    "explanation": "Fun Fact: Jupiter is the largest planet in our solar system.",
    "createdBy": "Default"
  },
  {
    "_id": "672cd00100000003",
    "questionText": "What is the chemical symbol for water?",
    "options": ["H2O", "CO2", "NaCl", "O2"],
    "correctAnswer": "H2O",
    "topic": "Science",
    "difficulty": 1,
    "explanation": "Fun Fact: H2O is the chemical symbol for water.",
    "createdBy": "Default"
  },
  {
    "_id": "672cd00100000004",
    "questionText": "What is the largest mammal in the world?",
    "options": ["Elephant", "Giraffe", "Polar Bear", "Blue Whale"],
    "correctAnswer": "Blue Whale",
    "topic": "Animals",
    "difficulty": 1,
    "explanation": "Fun Fact: The blue whale is the largest mammal in the world.",
    "createdBy": "Default"
  },
  {
    "_id": "672cd00100000005",
    "questionText": "What is the capital city of France?",
    "options": ["Paris", "London", "Berlin", "Madrid"],
    "correctAnswer": "Paris",
    "topic": "Geography",
    "difficulty": 1,
    "explanation": "Fun Fact: Paris is the capital city of France.",
    "createdBy": "Default"
  },
  {
    "_id": "672cd00100000006",
    "questionText": "What is the largest ocean in the world?",
    "options": ["Atlantic", "Indian", "Southern", "Pacific"],
    "correctAnswer": "Pacific",
    "topic": "Geography",
    "difficulty": 1,
    "explanation": "Fun Fact: The Pacific Ocean is the largest ocean in the world.",
    "createdBy": "Default"
  },
  {
    "_id": "672cd00100000007",
    "questionText": "What is the chemical symbol for oxygen?",
    "options": ["O2", "H2O", "CO2", "NaCl"],
    "correctAnswer": "O2",
    "topic": "Science",
    "difficulty": 1,
    "explanation": "Fun Fact: O2 is the chemical symbol for oxygen.",
    "createdBy": "Default"
  },
  {
    "_id": "672cd00100000008",
    "questionText": "What is the largest desert in the world?",
    "options": ["Sahara", "Antarctica", "Arabian", "Gobi"],
    "correctAnswer": "Antarctica",
    "topic": "Geography",
    "difficulty": 1,
    "explanation": "Fun Fact: Antarctica is the largest desert in the world.",
    "createdBy": "Default"
  },
  {
    "_id": "672cd00100000009",
    "questionText": "What is the capital city of Australia?",
    "options": ["Sydney", "Melbourne", "Canberra", "Perth"],
    "correctAnswer": "Canberra",
    "topic": "Geography",
    "difficulty": 1,
    "explanation": "Fun Fact: Canberra is the capital city of Australia.",
    "createdBy": "Default"
  },
  {
    "_id": "672cd00100000010",
    "questionText": "What is the largest planet in our solar system?",
    "options": ["Earth", "Jupiter", "Saturn", "Mars"],
    "correctAnswer": "Jupiter",
    "topic": "Science",
    "difficulty": 1,
    "explanation": "Fun Fact: Jupiter is the largest planet in our solar system.",
    "createdBy": "Default"
  }
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0 && !showScore) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setShowScore(true);
    }
  }, [timeLeft, showScore]);

  const handleAnswerSelect = (answer) => {
    if (showExplanation) return; // Prevent multiple selections
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (!selectedAnswer) return; // Prevent proceeding without selection

    setShowExplanation(true);
    if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizData.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer('');
        setShowExplanation(false);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="timer">
          <span className="timer-icon">⏱️</span>
          <span className="timer-text">{formatTime(timeLeft)}</span>
        </div>
        <h2 className="quiz-title">General Knowledge Quiz</h2>
        <div className="instructor-info">
          <span className="instructor-icon">👨‍🏫</span>
          <span>Dr. Smith</span>
        </div>
      </div>

      {showScore ? (
        <div className="score-section">
          <h2>Quiz Completed!</h2>
          <p>You scored {score} out of {quizData.length}</p>
          <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
        </div>
      ) : (
        <>
          <div className="progress-bar">
            <div 
              className="progress"
              style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{quizData.length}
            </div>
            <div className="question-text">{quizData[currentQuestion].questionText}</div>
          </div>
          <div className="answer-section">
            {quizData[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`answer-button ${selectedAnswer === option ? 'selected' : ''}`}
                disabled={showExplanation}
              >
                {option}
              </button>
            ))}
          </div>
          {selectedAnswer && !showExplanation && (
            <button onClick={handleNextQuestion} className="next-button">
              Next Question
            </button>
          )}
          {showExplanation && (
            <div className="explanation">
              <p className={selectedAnswer === quizData[currentQuestion].correctAnswer ? 'correct' : 'incorrect'}>
                {selectedAnswer === quizData[currentQuestion].correctAnswer ? 'Correct!' : 'Incorrect!'}
              </p>
              <p>{quizData[currentQuestion].explanation}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Quiz;
