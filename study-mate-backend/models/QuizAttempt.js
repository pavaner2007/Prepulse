const mongoose = require('mongoose')

const quizQuestionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  studentAnswer: String,
  explanation: String,
  conceptTag: String,
  difficulty: String,
  isCorrect: Boolean,
}, { _id: false })

const quizAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    examType: { type: String, default: 'JEE' },
    subject: { type: String, default: '' },
    chapter: { type: String, default: '' },
    difficulty: { type: String, default: 'Medium' },
    questions: [quizQuestionSchema],
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema)
