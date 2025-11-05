
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import '../styles/Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState("Utkarsh");
  const [quizzes, setQuizzes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setRedirect(true);
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

      <div className="quiz-list">
        {quizzes.map((q) => (
          <div className="quiz-card" key={q.id}>
            <h3>{q.title}</h3>
            <p>Questions: {q.questions}</p>
            <p>Difficulty: {q.difficulty}</p>
            <button>Start Quiz</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
