const mongoose = require('mongoose')

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    examType: { type: String, enum: ['JEE', 'NEET'], default: 'JEE' },
    classLevel: { type: String, enum: ['11', '12', 'Dropper'], default: '12' },
    targetScore: { type: Number, default: 650 },
    targetExamDate: { type: Date },
    dailyStudyHours: { type: Number, default: 4 },
    strongSubjects: [{ type: String }],
    weakSubjects: [{ type: String }],
    preferredLanguage: { type: String, default: 'English' },
    preparationMode: { type: String, enum: ['Coaching', 'Self-study', 'Hybrid'], default: 'Self-study' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('StudentProfile', studentProfileSchema)
