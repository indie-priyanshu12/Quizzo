import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState("Utkarsh");
  const [quizzes, setQuizzes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalQuizzes: 12,
    averageScore: 78,
    recentScores: [
      { quiz: "JavaScript Basics", score: 85, date: "2024-02-10" },
      { quiz: "React Components", score: 92, date: "2024-02-08" },
      { quiz: "Node.js Intro", score: 78, date: "2024-02-05" },
    ],
    topPerformance: "React Components (92%)"
  });
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setRedirect(true);
  };

  const handleStartQuiz = (title) => {
    if (title === "General Knowledge") {
      navigate('/quiz');
    }
  };

  useEffect(() => {
    setQuizzes([
      { id: 1, title: "General Knowledge", questions: 10, difficulty: "Easy" },
      { id: 2, title: "Science Facts", questions: 8, difficulty: "Medium" },
      { id: 3, title: "Technology", questions: 12, difficulty: "Hard" },
      { id: 4, title: "Mathematics", questions: 15, difficulty: "Medium" },
    ]);
  }, []);

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-nav">
        <h1>Quizzo</h1>
        <div className="user-controls">
          <div className="user-info" onClick={toggleDropdown}>
            <span className="account-icon">👤</span>
            <span>{user}</span>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  Profile
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  <span className="dropdown-icon">🚪</span>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="quiz-list">
          {quizzes.map((q) => (
            <div className="quiz-card" key={q.id}>
              <h3>{q.title}</h3>
              <p>Questions: {q.questions}</p>
              <p>Difficulty: {q.difficulty}</p>
              <button onClick={() => handleStartQuiz(q.title)}>Start Quiz</button>
            </div>
          ))}
        </div>

        <div className="analytics-container">
          <h2>Your Performance</h2>
          <div className="analytics-summary">
            <div className="analytics-item">
              <span className="analytics-label">Total Quizzes</span>
              <span className="analytics-value">{analytics.totalQuizzes}</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">Average Score</span>
              <span className="analytics-value">{analytics.averageScore}%</span>
            </div>
            <div className="analytics-item">
              <span className="analytics-label">Best Performance</span>
              <span className="analytics-value">{analytics.topPerformance}</span>
            </div>
          </div>

          <div className="recent-scores">
            <h3>Recent Scores</h3>
            {analytics.recentScores.map((score, index) => (
              <div key={index} className="score-item">
                <span className="quiz-name">{score.quiz}</span>
                <span className="quiz-score">{score.score}%</span>
                <span className="quiz-date">{score.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
