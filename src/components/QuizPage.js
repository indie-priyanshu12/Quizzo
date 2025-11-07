import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Quiz.css';

const quizQuestions = [
  // ... paste the quiz data array here ...
];

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const navigate = useNavigate();

  const handleAnswerClick = (answer) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    setSelectedAnswer('');
    
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>General Knowledge Quiz</h2>
        <div className="instructor-info">
          <span className="instructor-icon">👨‍🏫</span>
          <span>Instructor: John Doe</span>
        </div>
      </div>

      {!showResult ? (
        <>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>

          <div className="question-section">
            <div className="question-header">
              <span className="question-number">
                Question {currentQuestion + 1}/{quizQuestions.length}
              </span>
              <span className="question-topic">
                Topic: {quizQuestions[currentQuestion].topic}
              </span>
            </div>
            <h3 className="question-text">
              {quizQuestions[currentQuestion].questionText}
            </h3>
          </div>

          <div className="answer-section">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`answer-button ${
                  selectedAnswer === option 
                    ? selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                      ? 'correct'
                      : 'incorrect'
                    : ''
                } ${selectedAnswer === option ? 'selected' : ''}`}
                onClick={() => handleAnswerClick(option)}
                disabled={showExplanation && selectedAnswer !== option}
              >
                {option}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="explanation-section">
              <div className={`result-badge ${
                selectedAnswer === quizQuestions[currentQuestion].correctAnswer 
                  ? 'correct' 
                  : 'incorrect'
              }`}>
                {selectedAnswer === quizQuestions[currentQuestion].correctAnswer 
                  ? '✓ Correct!' 
                  : '✗ Incorrect!'}
              </div>
              <p className="explanation-text">
                {quizQuestions[currentQuestion].explanation}
              </p>
              <button className="next-button" onClick={handleNext}>
                {currentQuestion + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="score-section">
          <h2>Quiz Completed!</h2>
          <p className="final-score">Your Score: {score}/{quizQuestions.length}</p>
          <p className="score-percentage">
            ({Math.round((score/quizQuestions.length) * 100)}%)
          </p>
          <button className="return-button" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
