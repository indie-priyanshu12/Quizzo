const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/users/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, fullName, password, role } = req.body;
    
    // Normalize data including role
    const normalizedUser = {
      username: (username || '').trim().toLowerCase(),
      fullName: (fullName || '').trim(),
      password: password, // don't trim password
      role: role || 'student' // default to student if no role provided
    };

    console.log('Signup normalized data:', { 
      username: normalizedUser.username,
      fullName: normalizedUser.fullName,
      role: normalizedUser.role,
      passwordLength: normalizedUser.password.length
    });

    if (!normalizedUser.username || !normalizedUser.fullName || !normalizedUser.password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const existing = await User.findOne({ username: normalizedUser.username });
    if (existing) return res.status(409).json({ message: 'Username taken' });

    const passwordHash = await bcrypt.hash(normalizedUser.password, 10);
    const user = new User({
      username: normalizedUser.username,
      fullName: normalizedUser.fullName,
      passwordHash,
      role: normalizedUser.role // Include role when creating user
    });

    const saved = await user.save();
    console.log('Saved user:', {
      id: saved._id.toString(),
      username: saved.username,
      role: saved.role,
      passwordHashLength: saved.passwordHash.length
    });

    return res.status(201).json({
      id: saved._id,
      username: saved.username,
      fullName: saved.fullName,
      role: saved.role // Include role in response
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Normalize exactly as in signup
    const normalizedUser = {
      username: (username || '').trim().toLowerCase(),
      password: password // keep password exact, no trim
    };

    console.log('Login attempt:', {
      username: normalizedUser.username,
      passwordLength: normalizedUser.password.length
    });

    if (!normalizedUser.username || !normalizedUser.password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await User.findOne({ username: normalizedUser.username });
    if (!user) {
      console.log('User not found:', normalizedUser.username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Found user:', {
      id: user._id.toString(),
      username: user.username,
      storedHashLength: user.passwordHash.length
    });

    // Compare exact password with stored hash
    const valid = await bcrypt.compare(normalizedUser.password, user.passwordHash);
    console.log('Password comparison result:', valid);

    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'change_this_secret',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Add new route to check user role
router.get('/check/:username', async (req, res) => {
    try {
        const user = await User.findOne({ 
            username: req.params.username.toLowerCase() 
        }).select('username role');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ username: user.username, role: user.role });
    } catch (err) {
        console.error('User check error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/users/:username/attempts
router.post('/:username/attempts', async (req, res) => {
  try {
    const username = (req.params.username || '').toLowerCase();
    const { quizTitle, quizId, score, totalQuestions, percentage } = req.body;

    if (!username || typeof score !== 'number' || typeof totalQuestions !== 'number') {
      return res.status(400).json({ message: 'Invalid attempt payload' });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const attempt = {
      quizTitle: quizTitle || 'Unknown Quiz',
      quizId: quizId || '',
      score,
      totalQuestions,
      percentage: typeof percentage === 'number' ? percentage : Math.round((score / totalQuestions) * 100),
      takenAt: new Date()
    };

    user.attempts.push(attempt);
    await user.save();

    return res.status(201).json({ message: 'Attempt recorded', attempt });
  } catch (err) {
    console.error('Record attempt error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/analytics/:username
router.get('/analytics/:username', async (req, res) => {
  try {
    const username = (req.params.username || '').toLowerCase();
    const user = await User.findOne({ username }).select('attempts');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const attempts = user.attempts || [];
    const totalQuizzes = attempts.length;

    // overall average
    const averageScore = totalQuizzes === 0 ? 0 : Math.round((attempts.reduce((s, a) => s + a.percentage, 0) / totalQuizzes) * 100) / 100;

    // best performance
    let bestPerformance = null;
    if (attempts.length > 0) {
      const best = attempts.reduce((prev, curr) => (curr.percentage > prev.percentage ? curr : prev), attempts[0]);
      bestPerformance = `${best.quizTitle} (${best.percentage}%)`;
    }

    // recent scores: last 5 attempts sorted by takenAt desc
    const recentScores = attempts
      .slice()
      .sort((a, b) => new Date(b.takenAt) - new Date(a.takenAt))
      .slice(0, 5)
      .map(a => ({ quiz: a.quizTitle, score: `${a.percentage}%`, date: a.takenAt }));

    // per-quiz averages
    const perQuiz = {};
    attempts.forEach(a => {
      const key = a.quizTitle || 'Unknown';
      if (!perQuiz[key]) perQuiz[key] = { total: 0, count: 0 };
      perQuiz[key].total += a.percentage;
      perQuiz[key].count += 1;
    });
    const perQuizAverages = {};
    Object.keys(perQuiz).forEach(k => {
      perQuizAverages[k] = {
        average: Math.round((perQuiz[k].total / perQuiz[k].count) * 100) / 100,
        attempts: perQuiz[k].count
      };
    });

    return res.json({ totalQuizzes, averageScore, bestPerformance, recentScores, perQuizAverages });
  } catch (err) {
    console.error('Analytics error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/all-stats - Get all users with their statistics
router.get('/all-stats', async (req, res) => {
  try {
    const users = await User.find().select('username fullName attempts role');

    const userStats = users.map(user => {
      const attempts = user.attempts || [];
      const totalQuizzes = attempts.length;
      const averageScore = totalQuizzes === 0 ? 0 : Math.round((attempts.reduce((s, a) => s + a.percentage, 0) / totalQuizzes) * 100) / 100;

      return {
        id: user._id.toString(),
        username: user.username,
        fullName: user.fullName,
        quizzesTaken: totalQuizzes,
        avgScore: averageScore,
        role: user.role,
        lastAttempt: attempts.length > 0 ? new Date(Math.max(...attempts.map(a => new Date(a.takenAt)))) : null
      };
    });

    return res.json(userStats);
  } catch (err) {
    console.error('All stats error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;