const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  _id: String,
  questionText: String,
  options: [String],
  correctAnswer: String,
  topic: String,
  difficulty: Number,
  explanation: String
}, { _id: false });

const difficultySchema = new mongoose.Schema({
  easy: [questionSchema],
  medium: [questionSchema],
  hard: [questionSchema]
}, { _id: false });

const quizCollectionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  questions: difficultySchema,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizCollection', quizCollectionSchema);
