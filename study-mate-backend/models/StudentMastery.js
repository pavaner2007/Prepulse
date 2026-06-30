const mongoose = require('mongoose')

const studentMasterySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true },
    chapter: { type: String, default: '' },
    concept: { type: String, default: '' },
    masteryScore: { type: Number, default: 50 },
    accuracy: { type: Number, default: 0 },
    lastPracticed: { type: Date, default: Date.now },
    revisionDue: { type: Boolean, default: false },
  },
  { timestamps: true }
)

studentMasterySchema.index({ user: 1, subject: 1, chapter: 1, concept: 1 }, { unique: false })

module.exports = mongoose.model('StudentMastery', studentMasterySchema)
