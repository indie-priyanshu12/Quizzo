const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
	quizTitle: { type: String, required: true },
	quizId: { type: String },
	score: { type: Number, required: true },
	totalQuestions: { type: Number, required: true },
	percentage: { type: Number, required: true },
	takenAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
		username: { type: String, required: true, unique: true, lowercase: true, trim: true },
		fullName: { type: String, required: true, trim: true },
		passwordHash: { type: String, required: true },
		role: { type: String, default: 'student' },

		attempts: { type: [attemptSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);