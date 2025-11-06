const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

	username: { type: String, required: true, unique: true, lowercase: true, trim: true },
	fullName: { type: String, required: true, trim: true },
	passwordHash: { type: String, required: true },
	role: { type: String, default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);