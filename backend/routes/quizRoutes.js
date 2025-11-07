const express = require('express');
const Quiz = require('../models/Quiz');
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

module.exports = router;
