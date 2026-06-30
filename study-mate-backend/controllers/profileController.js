const StudentProfile = require('../models/StudentProfile')

const defaultProfile = (userId) => ({
  user: userId,
  examType: 'JEE',
  classLevel: '12',
  targetScore: 650,
  targetExamDate: null,
  dailyStudyHours: 4,
  strongSubjects: ['Chemistry'],
  weakSubjects: ['Physics'],
  preferredLanguage: 'English',
  preparationMode: 'Self-study',
})

const getStudentProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id })
    if (!profile) {
      profile = await StudentProfile.create(defaultProfile(req.user._id))
    }
    res.json(profile)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const upsertStudentProfile = async (req, res) => {
  try {
    const payload = {
      examType: req.body.examType,
      classLevel: req.body.classLevel,
      targetScore: Number(req.body.targetScore) || 0,
      targetExamDate: req.body.targetExamDate || null,
      dailyStudyHours: Number(req.body.dailyStudyHours) || 0,
      strongSubjects: Array.isArray(req.body.strongSubjects) ? req.body.strongSubjects : String(req.body.strongSubjects || '').split(',').map(s => s.trim()).filter(Boolean),
      weakSubjects: Array.isArray(req.body.weakSubjects) ? req.body.weakSubjects : String(req.body.weakSubjects || '').split(',').map(s => s.trim()).filter(Boolean),
      preferredLanguage: req.body.preferredLanguage || 'English',
      preparationMode: req.body.preparationMode || 'Self-study',
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: payload },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    )
    res.json(profile)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getStudentProfile, upsertStudentProfile }
