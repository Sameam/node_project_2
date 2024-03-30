const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const quizSchema = new mongoose.Schema({
  questions: { type: String, required: true, index: true },
  options : [{type: String, required: true}], 
  answer : {type: String, required: true}, 
  level: {type: String, required: true, enum: ["Beginner", "Intermediate", "Advanced"]},
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;