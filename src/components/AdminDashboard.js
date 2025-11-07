import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [activeTab, setActiveTab] = useState('quizzes');

  const [quizzes] = useState([
    { id: 1, title: "General Knowledge", participants: 45, avgScore: 78 },
    { id: 2, title: "Science Facts", participants: 32, avgScore: 65 },
  ]);

  const [users] = useState([
    { id: 1, username: "john_doe", quizzesTaken: 8, avgScore: 82 },
    { id: 2, username: "jane_smith", quizzesTaken: 12, avgScore: 75 },
  ]);

  const handleLogout = () => setRedirect(true);

  if (redirect) return <Navigate to="/" />;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-nav">
        <h1>Quizzo Admin</h1>
        <div className="user-controls">
          <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
            <span className="account-icon">👤</span>
            <span>Admin</span>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={handleLogout}>
                  <span className="dropdown-icon">❌</span>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-tabs">
          <button 
            className={activeTab === 'quizzes' ? 'active' : ''} 
            onClick={() => setActiveTab('quizzes')}
          >
            Manage Quizzes
          </button>
          <button 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={() => setActiveTab('users')}
          >
            User Statistics
          </button>
          <button 
            className={activeTab === 'create' ? 'active' : ''} 
            onClick={() => setActiveTab('create')}
          >
            Create Quiz
          </button>
        </div>

        {activeTab === 'quizzes' && (
          <div className="quiz-management">
            <h2>Quiz Management</h2>
            <table>
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th>Participants</th>
                  <th>Avg Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(quiz => (
                  <tr key={quiz.id}>
                    <td>{quiz.title}</td>
                    <td>{quiz.participants}</td>
                    <td>{quiz.avgScore}%</td>
                    <td>
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-statistics">
            <h2>User Statistics</h2>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Quizzes Taken</th>
                  <th>Avg Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.quizzesTaken}</td>
                    <td>{user.avgScore}%</td>
                    <td>
                      <button className="view-btn">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-quiz">
            <h2>Create New Quiz</h2>
            <form className="quiz-form">
              <div className="form-group">
                <label>Quiz Title</label>
                <input type="text" placeholder="Enter quiz title" />
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <button type="submit" className="create-btn">Create Quiz</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
