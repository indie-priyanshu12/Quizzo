const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: Number, required: true },
    explanation: String,
    createdBy: { type: String, default: 'Default' }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
