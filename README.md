# Quizzo – Interactive Quiz Application

## Overview
**Quizzo** is a full-stack, role-based quiz application built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.  
It provides an adaptive and interactive platform for conducting quizzes where students can practice and track their performance, while instructors can create, manage, and analyze quizzes with detailed analytics.

---

## Features

### For Students
- Take interactive quizzes with real-time feedback
- Track performance and progress
- Timer-based quiz system
- Access topic-wise learning materials in the Learning Corner

### For Instructors
- Create, edit, and delete quizzes
- View student reports and quiz statistics
- Manage questions and difficulty levels
- Add resources for remediation and mastery improvement

### Common Features
- Secure authentication with JWT and bcrypt
- Role-based dashboards for different user types
- Analytics dashboard showing scores, progress, and accuracy
- Responsive and modern UI with clean design

---

## System Architecture

**Frontend (React.js):**
- Login / Signup components
- Student and Instructor dashboards
- Quiz interface and Learning Corner

**Backend (Node.js + Express):**
- User authentication and role management
- Quiz management API
- Adaptive RuleSet logic and analytics endpoints

**Database (MongoDB):**
- Collections: Users, Quizzes, Questions, Attempts, Results, Mastery, RuleSet

---

## Technology Stack

| Layer | Tools / Frameworks |
|-------|---------------------|
| Frontend | React.js, Axios, CSS Modules |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT, bcrypt |
| Development Tools | VS Code, Postman, Git |
| Visualization | Chart.js / Recharts |

---

## Installation and Setup

Ensure you have **Node.js** and **MongoDB** installed before running.

```bash
# Clone the repository
git clone https://github.com/<your-username>/Quizzo.git

# Navigate to the project folder
cd Quizzo

# Install dependencies
npm install
cd client && npm install

# Add environment variables
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000

# Run backend
npm run server

# Run frontend
cd client
npm start
```

---

## Workflow Summary

### Signup/Login Flow
- Users can register as Student or Instructor.
- Authentication handled via JWT.
- Role-based dashboards for navigation.

### Quiz Flow
- Instructor creates and assigns quizzes.
- Students take quizzes and get immediate results.
- Quiz attempts and results stored in MongoDB.

### Analytics and Learning
- Performance data visualized on dashboards.
- Learning Corner suggests topic-based resources.

---

## Future Enhancements
- AI-based adaptive question selection
- Gamified learning with leaderboards
- Mobile app version using React Native
- Multi-language quiz support
- Integration with popular LMS systems

---

## Contributors
| Name | Role |
|------|------|
| Priyanshu Kashyap - 23BCG10009 | Full Stack Developer |
| Siddharth Sonawane - 23BCG10016 | Full Stack Developer |

---

© 2025 Quizzo – Adaptive Learning and Quiz Platform by 23BCG10009 and 23BCG10016
