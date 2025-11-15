import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';
import GeminiChat from './GeminiChat';

function Dashboard() {
  const [user, setUser] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestPerformance: null,
    recentScores: []
  });
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setRedirect(true);
  };

  const handleStartQuiz = (title) => {
    // store chosen quiz so the Quiz page knows which question set to load
    try {
      localStorage.setItem('selectedQuiz', title);
    } catch (err) {
      console.error('Could not store selected quiz:', err);
    }
    navigate('/quiz');
  };

  useEffect(() => {
      // Fetch quizzes from backend first, then fallback to default
      const fetchQuizzes = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/quizzes/collections');
          if (response.ok) {
            const backendQuizzes = await response.json();
            // Combine with default quizzes, add backend quizzes
            const defaultQuizzes = [
              { id: 1, title: "General Knowledge", questions: 6, difficulty: "" },
              { id: 2, title: "Science Facts", questions: 6, difficulty: "" },
              { id: 3, title: "Technology", questions: 6, difficulty: "" },
              { id: 4, title: "Mathematics", questions: 6, difficulty: "" },
            ];
            
            // Add backend quizzes that aren't in defaults
            const allQuizzes = [...defaultQuizzes];
            backendQuizzes.forEach(bq => {
              if (!allQuizzes.find(q => q.title === bq.title)) {
                allQuizzes.push({
                  id: allQuizzes.length + 1,
                  title: bq.title,
                  questions: 18,
                  difficulty: "",
                  description: bq.description
                });
              }
            });
            
            setQuizzes(allQuizzes);
            return;
          }
        } catch (err) {
          console.error('Error fetching backend quizzes:', err);
        }

        // Fallback to default quizzes if backend fails
        setQuizzes([
          { id: 1, title: "General Knowledge", questions: 6, difficulty: "" },
          { id: 2, title: "Science Facts", questions: 6, difficulty: "" },
          { id: 3, title: "Technology", questions: 6, difficulty: "" },
          { id: 4, title: "Mathematics", questions: 6, difficulty: "" },
        ]);
      };

      fetchQuizzes();

    // fetch analytics for current user
    const raw = localStorage.getItem('userData');
    if (!raw) return;
    try {
      const ud = JSON.parse(raw);
      setUser(ud.fullName || ud.username || 'User');
      const username = ud.username;
      if (!username) return;

      fetch(`http://localhost:5000/api/users/analytics/${encodeURIComponent(username)}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.message) {
            setAnalytics({
              totalQuizzes: data.totalQuizzes || 0,
              averageScore: data.averageScore || 0,
              bestPerformance: data.bestPerformance || null,
              recentScores: data.recentScores || [],
              perQuizAverages: data.perQuizAverages || {}
            });
          }
        })
        .catch(err => console.error('Error fetching analytics:', err));
    } catch (err) {
      console.error('Error parsing userData:', err);
    }
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
              <p>Starting Difficulty: <span style={{ fontWeight: 600, color: '#6c9eff' }}>Easy</span></p>
              <p style={{ marginTop: 8, fontWeight: 600 }}>Average: {analytics.perQuizAverages && analytics.perQuizAverages[q.title] ? `${analytics.perQuizAverages[q.title].average}% (${analytics.perQuizAverages[q.title].attempts} attempts)` : '-'}</p>
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
              <span className="analytics-value">{analytics.bestPerformance || '-'}</span>
            </div>
          </div>

          <div className="recent-scores">
            <h3>Recent Scores</h3>
            {analytics.recentScores.map((score, index) => (
              <div key={index} className="score-item">
                <span className="quiz-name">{score.quiz}</span>
                <span className="quiz-score">{score.score}</span>
                <span className="quiz-date">{new Date(score.date).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <GeminiChat />
    </div>
  );
}

export default Dashboard;
