const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const scoreSchema = new mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: {type: String, required: true},
  score: {type: Number, required: true},
  level: {type: String, required: true, enum: ["Beginner", "Intermediate", "Advanced"]},
  date: {type: Date, default: Date.now},
  totalQuestions: {type: Number, required: true},
  correctAnswers: {type: Number, required: true},
}); 

const Result = mongoose.model('Result', scoreSchema);
module.exports = Result;