const mongoose = require('mongoose')

const mistakeLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    question: { type: String, required: true },
    studentAnswer: { type: String, default: '' },
    correctAnswer: { type: String, default: '' },
    subject: { type: String, default: '' },
    chapter: { type: String, default: '' },
    concept: { type: String, default: '' },
    mistakeType: {
      type: String,
      enum: ['Conceptual Mistake', 'Formula Mistake', 'Calculation Mistake', 'Careless Mistake', 'Time Pressure Mistake', 'Memory Gap', 'Wrong Approach'],
      default: 'Conceptual Mistake',
    },
    explanation: { type: String, default: '' },
    timeTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('MistakeLog', mistakeLogSchema)
