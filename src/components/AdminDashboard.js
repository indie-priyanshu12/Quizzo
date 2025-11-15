import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import '../styles/AdminDashboard.css';

// Import quiz data from Quiz component
import { QUIZ_SETS } from './Quiz';

function AdminDashboard() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [activeTab, setActiveTab] = useState('quizzes');
  const [quizzes, setQuizzes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedQuizForQuestions, setSelectedQuizForQuestions] = useState(null);
  const [questionsData, setQuestionsData] = useState({});
  const [users, setUsers] = useState([]);
  const [editedQuestions, setEditedQuestions] = useState({});
  const [createFormData, setCreateFormData] = useState({ title: '', description: '' });
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  // Fetch all quizzes and analytics
  useEffect(() => {
    const fetchQuizzesAndAnalytics = async () => {
      try {
        // First fetch from backend/collections
        let backendQuizzes = [];
        try {
          const response = await fetch('http://localhost:5000/api/quizzes/collections');
          if (response.ok) {
            backendQuizzes = await response.json();
          }
        } catch (err) {
          console.error('Error fetching backend quizzes:', err);
        }

        // Get default quiz titles and merge with backend quizzes
        let quizTitles = Object.keys(QUIZ_SETS);
        
        // Add backend quizzes that aren't in QUIZ_SETS
        backendQuizzes.forEach(bq => {
          if (!quizTitles.includes(bq.title)) {
            quizTitles.push(bq.title);
          }
        });

        // Fetch analytics for all users from localStorage (simulating multiple users)
        const quizAnalytics = {};
        
        // Initialize quiz analytics
        quizTitles.forEach(title => {
          quizAnalytics[title] = {
            totalParticipants: 0,
            totalScore: 0,
            avgScore: 0,
            attempts: []
          };
        });

        // Get sample users from localStorage or backend
        try {
          const userDataStr = localStorage.getItem('userData');
          if (userDataStr) {
            const currentUser = JSON.parse(userDataStr);
            
            // Fetch analytics for current user
            const response = await fetch(
              `http://localhost:5000/api/users/analytics/${encodeURIComponent(currentUser.username)}`
            );
            if (response.ok) {
              const analyticsData = await response.json();
              
              // Calculate aggregate analytics
              if (analyticsData.perQuizAverages) {
                Object.entries(analyticsData.perQuizAverages).forEach(([quizTitle, stats]) => {
                  if (quizAnalytics[quizTitle]) {
                    quizAnalytics[quizTitle].totalParticipants += stats.attempts || 0;
                    quizAnalytics[quizTitle].attempts.push(...(analyticsData.recentScores || []).filter(s => s.quiz === quizTitle));
                  }
                });
              }
            }
          }
        } catch (err) {
          console.error('Error fetching user analytics:', err);
        }

        // Create quiz list with analytics
        const quizList = quizTitles.map((title, idx) => {
          const analytics = quizAnalytics[title];
          const avgScore = analytics.attempts.length > 0 
            ? Math.round(analytics.attempts.reduce((sum, a) => sum + parseFloat(a.score || 0), 0) / analytics.attempts.length)
            : 0;
          
          // Count total questions - check QUIZ_SETS first, then backend
          let totalQuestions = 18;
          if (QUIZ_SETS[title]) {
            const easy = QUIZ_SETS[title].easy ? QUIZ_SETS[title].easy.length : 0;
            const medium = QUIZ_SETS[title].medium ? QUIZ_SETS[title].medium.length : 0;
            const hard = QUIZ_SETS[title].hard ? QUIZ_SETS[title].hard.length : 0;
            totalQuestions = easy + medium + hard;
          }
          
          return {
            id: idx + 1,
            title: title,
            participants: analytics.totalParticipants,
            avgScore: avgScore,
            totalQuestions: totalQuestions || 18,
            difficulties: ['easy', 'medium', 'hard']
          };
        });

        setQuizzes(quizList);

        // Fetch all users statistics from backend
        try {
          const response = await fetch('http://localhost:5000/api/users/all-stats');
          if (response.ok) {
            const userStats = await response.json();
            setUsers(userStats);
          }
        } catch (err) {
          console.error('Error fetching user stats:', err);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading quizzes:', err);
        setLoading(false);
      }
    };

    fetchQuizzesAndAnalytics();
  }, []);

  const handleLogout = () => setRedirect(true);

  const handleEditClick = (quiz) => {
    setEditingId(quiz.id);
    setEditFormData({ ...quiz });
  };

  const handleEditChange = (field, value) => {
    setEditFormData({ ...editFormData, [field]: value });
  };

  const handleSaveEdit = (id) => {
    const updatedQuizzes = quizzes.map(q => 
      q.id === id ? editFormData : q
    );
    setQuizzes(updatedQuizzes);
    setEditingId(null);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleDeleteQuiz = async (id) => {
    const quizToDelete = quizzes.find(q => q.id === id);
    if (!quizToDelete) return;

    if (window.confirm(`Are you sure you want to delete "${quizToDelete.title}"?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/quizzes/collections/${encodeURIComponent(quizToDelete.title)}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setQuizzes(quizzes.filter(q => q.id !== id));
          alert(`Quiz "${quizToDelete.title}" deleted successfully!`);
        } else {
          alert('Failed to delete quiz');
        }
      } catch (err) {
        console.error('Error deleting quiz:', err);
        alert('Error deleting quiz');
      }
    }
  };

  const handleEditQuestions = async (quiz) => {
    setSelectedQuizForQuestions(quiz);
    
    // Try to load from backend first
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/collections/${encodeURIComponent(quiz.title)}`);
      if (response.ok) {
        const quizData = await response.json();
        const questions = quizData.questions || { easy: [], medium: [], hard: [] };
        setQuestionsData(questions);
        setEditedQuestions(JSON.parse(JSON.stringify(questions)));
        setShowQuestionsModal(true);
        return;
      }
    } catch (err) {
      console.error('Error fetching quiz from backend:', err);
    }

    // Fallback to QUIZ_SETS
    if (QUIZ_SETS[quiz.title]) {
      setQuestionsData(QUIZ_SETS[quiz.title]);
      setEditedQuestions(JSON.parse(JSON.stringify(QUIZ_SETS[quiz.title])));
      setShowQuestionsModal(true);
    } else {
      // If quiz not found anywhere, create empty structure
      const emptyQuestions = { easy: [], medium: [], hard: [] };
      setQuestionsData(emptyQuestions);
      setEditedQuestions(JSON.parse(JSON.stringify(emptyQuestions)));
      setShowQuestionsModal(true);
    }
  };

  const handleSaveQuestions = async () => {
    if (!selectedQuizForQuestions || !editedQuestions) return;

    try {
      // Save to backend
      const response = await fetch(
        `http://localhost:5000/api/quizzes/collections/${encodeURIComponent(selectedQuizForQuestions.title)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: selectedQuizForQuestions.title,
            questions: editedQuestions
          })
        }
      );

      if (!response.ok) {
        console.error('Error saving to backend');
      }
    } catch (err) {
      console.error('Error saving to backend:', err);
    }

    // Update QUIZ_SETS with edited data (in-memory)
    QUIZ_SETS[selectedQuizForQuestions.title] = editedQuestions;

    // Persist to localStorage
    try {
      localStorage.setItem(
        `quiz_${selectedQuizForQuestions.title}`,
        JSON.stringify(editedQuestions)
      );
      console.log(`Saved questions for ${selectedQuizForQuestions.title}`);
    } catch (err) {
      console.error('Error saving questions:', err);
    }

    setShowQuestionsModal(false);
    setSelectedQuizForQuestions(null);
    setEditedQuestions({});
    alert('Questions saved successfully!');
  };

  const handleQuestionChange = (difficulty, questionIdx, field, value) => {
    const updatedQuestions = JSON.parse(JSON.stringify(editedQuestions));
    
    if (field === 'options') {
      // For options, value includes optionIdx
      updatedQuestions[difficulty][questionIdx].options[value.optionIdx] = value.text;
    } else if (field === 'correctAnswer') {
      updatedQuestions[difficulty][questionIdx].correctAnswer = value;
    } else if (field === 'questionText') {
      updatedQuestions[difficulty][questionIdx].questionText = value;
    } else if (field === 'explanation') {
      updatedQuestions[difficulty][questionIdx].explanation = value;
    }
    
    setEditedQuestions(updatedQuestions);
  };

  const createBlankQuestion = () => ({
    _id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    topic: '',
    difficulty: 0,
    explanation: ''
  });

  const createBlankQuestionSet = () => ({
    easy: [createBlankQuestion(), createBlankQuestion(), createBlankQuestion(), createBlankQuestion(), createBlankQuestion(), createBlankQuestion()],
    medium: [createBlankQuestion(), createBlankQuestion(), createBlankQuestion(), createBlankQuestion(), createBlankQuestion(), createBlankQuestion()],
    hard: [createBlankQuestion(), createBlankQuestion(), createBlankQuestion(), createBlankQuestion(), createBlankQuestion(), createBlankQuestion()]
  });

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    
    if (!createFormData.title.trim()) {
      alert('Quiz title is required');
      return;
    }

    setCreatingQuiz(true);
    const blankQuestions = createBlankQuestionSet();

    try {
      const response = await fetch('http://localhost:5000/api/quizzes/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createFormData.title.trim(),
          description: createFormData.description.trim(),
          questions: blankQuestions
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Quiz "${createFormData.title}" created successfully!`);
        
        // Add to QUIZ_SETS in memory
        QUIZ_SETS[createFormData.title] = blankQuestions;
        
        // Reset form
        setCreateFormData({ title: '', description: '' });
        
        // Refetch quizzes list without page reload
        try {
          let backendQuizzes = [];
          const response = await fetch('http://localhost:5000/api/quizzes/collections');
          if (response.ok) {
            backendQuizzes = await response.json();
          }

          // Get all quiz titles
          let quizTitles = Object.keys(QUIZ_SETS);
          backendQuizzes.forEach(bq => {
            if (!quizTitles.includes(bq.title)) {
              quizTitles.push(bq.title);
            }
          });

          // Initialize quiz analytics
          const quizAnalytics = {};
          quizTitles.forEach(title => {
            quizAnalytics[title] = {
              totalParticipants: 0,
              totalScore: 0,
              avgScore: 0,
              attempts: []
            };
          });

          // Create quiz list
          const quizList = quizTitles.map((title, idx) => {
            const analytics = quizAnalytics[title];
            let totalQuestions = 18;
            if (QUIZ_SETS[title]) {
              const easy = QUIZ_SETS[title].easy ? QUIZ_SETS[title].easy.length : 0;
              const medium = QUIZ_SETS[title].medium ? QUIZ_SETS[title].medium.length : 0;
              const hard = QUIZ_SETS[title].hard ? QUIZ_SETS[title].hard.length : 0;
              totalQuestions = easy + medium + hard;
            }
            
            return {
              id: idx + 1,
              title: title,
              participants: analytics.totalParticipants,
              avgScore: 0,
              totalQuestions: totalQuestions || 18,
              difficulties: ['easy', 'medium', 'hard']
            };
          });

          setQuizzes(quizList);
          setActiveTab('quizzes');
        } catch (err) {
          console.error('Error refetching quizzes:', err);
          alert('Quiz created but could not refresh list. Please refresh the page.');
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error creating quiz:', err);
      alert('Failed to create quiz');
    } finally {
      setCreatingQuiz(false);
    }
  };

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
            {loading && <p>Loading quizzes...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th>Total Questions</th>
                  <th>Difficulties</th>
                  <th>Participants</th>
                  <th>Avg Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(quiz => (
                  <tr key={quiz.id}>
                    {editingId === quiz.id ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            value={editFormData.title} 
                            onChange={(e) => handleEditChange('title', e.target.value)}
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={editFormData.totalQuestions} 
                            onChange={(e) => handleEditChange('totalQuestions', parseInt(e.target.value))}
                            className="edit-input"
                          />
                        </td>
                        <td>{editFormData.difficulties.join(', ')}</td>
                        <td>
                          <input 
                            type="number" 
                            value={editFormData.participants} 
                            onChange={(e) => handleEditChange('participants', parseInt(e.target.value))}
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            value={editFormData.avgScore} 
                            onChange={(e) => handleEditChange('avgScore', parseInt(e.target.value))}
                            className="edit-input"
                          />
                        </td>
                        <td>
                          <button className="save-btn" onClick={() => handleSaveEdit(quiz.id)}>Save</button>
                          <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{quiz.title}</td>
                        <td>{quiz.totalQuestions}</td>
                        <td>{quiz.difficulties.join(', ')}</td>
                        <td>{quiz.participants}</td>
                        <td>{quiz.avgScore}%</td>
                        <td>
                          <button className="edit-btn" onClick={() => handleEditClick(quiz)}>Edit</button>
                          <button className="questions-btn" onClick={() => handleEditQuestions(quiz)}>Questions</button>
                          <button className="delete-btn" onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-statistics">
            <h2>User Statistics</h2>
            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Quizzes Taken</th>
                    <th>Avg Score</th>
                    <th>Last Attempt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.fullName}</td>
                      <td>{user.quizzesTaken}</td>
                      <td>{user.avgScore}%</td>
                      <td>{user.lastAttempt ? new Date(user.lastAttempt).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <button className="view-btn">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="create-quiz">
            <h2>Create New Quiz</h2>
            <form className="quiz-form" onSubmit={handleCreateQuiz}>
              <div className="form-group">
                <label>Quiz Title *</label>
                <input 
                  type="text" 
                  placeholder="Enter quiz title" 
                  value={createFormData.title}
                  onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  placeholder="Enter quiz description (optional)" 
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  rows="4"
                ></textarea>
              </div>
              <div className="form-info">
                <p>After creating the quiz, you can add questions by selecting it from the "Manage Quizzes" tab and clicking "Questions".</p>
              </div>
              <button type="submit" className="create-btn" disabled={creatingQuiz}>
                {creatingQuiz ? 'Creating...' : 'Create Quiz'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Questions Modal */}
      {showQuestionsModal && selectedQuizForQuestions && editedQuestions && (
        <div className="modal-overlay" onClick={() => setShowQuestionsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Questions - {selectedQuizForQuestions.title}</h2>
              <button className="modal-close-btn" onClick={() => setShowQuestionsModal(false)}>Close</button>
            </div>

            {/* Easy Level Questions */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#6c9eff', marginBottom: '15px' }}>Easy Level Questions</h3>
              {editedQuestions.easy && editedQuestions.easy.map((question, idx) => (
                <div key={`easy-${idx}`} className="question-item">
                  <h4>Question {idx + 1}</h4>
                  <label>Question Text</label>
                  <textarea 
                    value={question.questionText || ''}
                    onChange={(e) => handleQuestionChange('easy', idx, 'questionText', e.target.value)}
                  ></textarea>
                  
                  <div className="option-label-container">
                    <label>Option 1</label>
                    {question.options[0] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[0] || ''}
                    onChange={(e) => handleQuestionChange('easy', idx, 'options', { optionIdx: 0, text: e.target.value })}
                    className={question.options[0] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <div className="option-label-container">
                    <label>Option 2</label>
                    {question.options[1] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[1] || ''}
                    onChange={(e) => handleQuestionChange('easy', idx, 'options', { optionIdx: 1, text: e.target.value })}
                    className={question.options[1] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <div className="option-label-container">
                    <label>Option 3</label>
                    {question.options[2] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[2] || ''}
                    onChange={(e) => handleQuestionChange('easy', idx, 'options', { optionIdx: 2, text: e.target.value })}
                    className={question.options[2] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <div className="option-label-container">
                    <label>Option 4</label>
                    {question.options[3] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[3] || ''}
                    onChange={(e) => handleQuestionChange('easy', idx, 'options', { optionIdx: 3, text: e.target.value })}
                    className={question.options[3] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <label>Correct Answer</label>
                  <input 
                    type="text" 
                    value={question.correctAnswer || ''}
                    onChange={(e) => handleQuestionChange('easy', idx, 'correctAnswer', e.target.value)}
                  />
                  
                  <label>Explanation</label>
                  <textarea 
                    value={question.explanation || ''}
                    onChange={(e) => handleQuestionChange('easy', idx, 'explanation', e.target.value)}
                  ></textarea>
                </div>
              ))}
            </div>

            {/* Medium Level Questions */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#ffc107', marginBottom: '15px' }}>Medium Level Questions</h3>
              {editedQuestions.medium && editedQuestions.medium.map((question, idx) => (
                <div key={`medium-${idx}`} className="question-item" style={{ borderLeftColor: '#ffc107' }}>
                  <h4>Question {idx + 1}</h4>
                  <label>Question Text</label>
                  <textarea 
                    value={question.questionText || ''}
                    onChange={(e) => handleQuestionChange('medium', idx, 'questionText', e.target.value)}
                  ></textarea>
                  
                  <div className="option-label-container">
                    <label>Option 1</label>
                    {question.options[0] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[0] || ''}
                    onChange={(e) => handleQuestionChange('medium', idx, 'options', { optionIdx: 0, text: e.target.value })}
                    className={question.options[0] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <div className="option-label-container">
                    <label>Option 2</label>
                    {question.options[1] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[1] || ''}
                    onChange={(e) => handleQuestionChange('medium', idx, 'options', { optionIdx: 1, text: e.target.value })}
                    className={question.options[1] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <div className="option-label-container">
                    <label>Option 3</label>
                    {question.options[2] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[2] || ''}
                    onChange={(e) => handleQuestionChange('medium', idx, 'options', { optionIdx: 2, text: e.target.value })}
                    className={question.options[2] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <div className="option-label-container">
                    <label>Option 4</label>
                    {question.options[3] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[3] || ''}
                    onChange={(e) => handleQuestionChange('medium', idx, 'options', { optionIdx: 3, text: e.target.value })}
                    className={question.options[3] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <label>Correct Answer</label>
                  <input 
                    type="text" 
                    value={question.correctAnswer || ''}
                    onChange={(e) => handleQuestionChange('medium', idx, 'correctAnswer', e.target.value)}
                  />
                  
                  <label>Explanation</label>
                  <textarea 
                    value={question.explanation || ''}
                    onChange={(e) => handleQuestionChange('medium', idx, 'explanation', e.target.value)}
                  ></textarea>
                </div>
              ))}
            </div>

            {/* Hard Level Questions */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#dc3545', marginBottom: '15px' }}>Hard Level Questions</h3>
              {editedQuestions.hard && editedQuestions.hard.map((question, idx) => (
                <div key={`hard-${idx}`} className="question-item" style={{ borderLeftColor: '#dc3545' }}>
                  <h4>Question {idx + 1}</h4>
                  <label>Question Text</label>
                  <textarea 
                    value={question.questionText || ''}
                    onChange={(e) => handleQuestionChange('hard', idx, 'questionText', e.target.value)}
                  ></textarea>
                  
                  <div className="option-label-container">
                    <label>Option 1</label>
                    {question.options[0] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[0] || ''}
                    onChange={(e) => handleQuestionChange('hard', idx, 'options', { optionIdx: 0, text: e.target.value })}
                    className={question.options[0] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <div className="option-label-container">
                    <label>Option 2</label>
                    {question.options[1] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[1] || ''}
                    onChange={(e) => handleQuestionChange('hard', idx, 'options', { optionIdx: 1, text: e.target.value })}
                    className={question.options[1] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <div className="option-label-container">
                    <label>Option 3</label>
                    {question.options[2] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[2] || ''}
                    onChange={(e) => handleQuestionChange('hard', idx, 'options', { optionIdx: 2, text: e.target.value })}
                    className={question.options[2] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <div className="option-label-container">
                    <label>Option 4</label>
                    {question.options[3] === question.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                  </div>
                  <input 
                    type="text" 
                    value={question.options[3] || ''}
                    onChange={(e) => handleQuestionChange('hard', idx, 'options', { optionIdx: 3, text: e.target.value })}
                    className={question.options[3] === question.correctAnswer ? 'correct-answer' : ''}
                  />
                  
                  <label>Correct Answer</label>
                  <input 
                    type="text" 
                    value={question.correctAnswer || ''}
                    onChange={(e) => handleQuestionChange('hard', idx, 'correctAnswer', e.target.value)}
                  />
                  
                  <label>Explanation</label>
                  <textarea 
                    value={question.explanation || ''}
                    onChange={(e) => handleQuestionChange('hard', idx, 'explanation', e.target.value)}
                  ></textarea>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button className="modal-save-btn" onClick={handleSaveQuestions}>Save All Changes</button>
              <button className="modal-cancel-btn" onClick={() => setShowQuestionsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
