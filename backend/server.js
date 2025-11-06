const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Normalize incoming auth payloads so backend always sees `fullName` if possible.
// Do NOT persist `email` in the DB; this middleware only populates fullName for route logic.
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    if (!req.body.fullName) {
      // prefer explicit `name` or `fullName`
      if (req.body.name && typeof req.body.name === 'string' && req.body.name.trim()) {
        req.body.fullName = req.body.name.trim();
      } else if (req.body.email && typeof req.body.email === 'string' && req.body.email.trim()) {
        const emailVal = req.body.email.trim();
        // only treat `email` as a name if it does NOT look like a real email address (simple check)
        if (!emailVal.includes('@')) {
          req.body.fullName = emailVal;
        }
      } else if (req.body.username && typeof req.body.username === 'string' && req.body.username.trim()) {
        // last resort fallback: use username as fullName so validation doesn't fail
        req.body.fullName = req.body.username.trim();
      }
    }
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// enable mongoose debug to print queries to console (helps verify writes)
mongoose.set('debug', true);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizzo';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Log MongoDB connection status
const db = mongoose.connection;
db.on('error', (err) => console.error('MongoDB connection error:', err));
db.once('open', () => console.log('MongoDB connection established'));
db.on('disconnected', () => console.log('MongoDB disconnected'));

const userRoutes = require('./routes/userRoutes');

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});