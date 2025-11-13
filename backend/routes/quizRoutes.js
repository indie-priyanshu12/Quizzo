const express = require('express');
const Quiz = require('../models/Quiz');
const QuizCollection = require('../models/QuizCollection');
const router = express.Router();

router.get('/general-knowledge', async (req, res) => {
    try {
        const questions = await Quiz.find({ topic: { $in: ['Geography', 'History', 'Culture', 'Civics', 'Wildlife', 'Economy'] } });
        res.json(questions);
    } catch (err) {
        console.error('Error fetching quiz:', err);
        res.status(500).json({ message: 'Error fetching quiz questions' });
    }
});

// GET all quiz collections
router.get('/collections', async (req, res) => {
  try {
    const quizzes = await QuizCollection.find().select('title description createdAt createdBy');
    res.json(quizzes);
  } catch (err) {
    console.error('Error fetching quiz collections:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET specific quiz collection
router.get('/collections/:title', async (req, res) => {
  try {
    const quiz = await QuizCollection.findOne({ title: req.params.title });
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new quiz collection
router.post('/collections', async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (!title || !questions) {
      return res.status(400).json({ message: 'Title and questions required' });
    }

    // Check if quiz already exists
    const existing = await QuizCollection.findOne({ title });
    if (existing) {
      return res.status(409).json({ message: 'Quiz with this title already exists' });
    }

    // Create quiz with default structure if not provided
    const quizData = {
      title,
      description: description || '',
      questions: questions || { easy: [], medium: [], hard: [] },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newQuiz = new QuizCollection(quizData);
    const saved = await newQuiz.save();

    res.status(201).json({ 
      message: 'Quiz created successfully',
      quiz: {
        title: saved.title,
        description: saved.description,
        _id: saved._id
      }
    });
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update quiz collection
router.put('/collections/:title', async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    const updated = await QuizCollection.findOneAndUpdate(
      { title: req.params.title },
      { 
        title: title || req.params.title,
        description,
        questions,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ 
      message: 'Quiz updated successfully',
      quiz: updated
    });
  } catch (err) {
    console.error('Error updating quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE quiz collection
router.delete('/collections/:title', async (req, res) => {
  try {
    const deleted = await QuizCollection.findOneAndDelete({ title: req.params.title });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error('Error deleting quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
