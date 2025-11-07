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

module.exports = router;