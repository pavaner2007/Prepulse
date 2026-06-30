const { getSyllabus, getChapters, getSubjects, getChapterMeta, officialSources } = require('../data/syllabusData')
const { getChapterIntelligence, getSubjectIntelligence, getExamIntelligence, buildStrategySummary, sourceNotes } = require('../data/syllabusIntelligence')
const StudentProfile = require('../models/StudentProfile')
const QuizAttempt = require('../models/QuizAttempt')
const MistakeLog = require('../models/MistakeLog')
const StudentMastery = require('../models/StudentMastery')
const Note = require('../models/Note')

const getFullSyllabus = (req, res) => {
  const examType = req.query.examType
  res.json({ syllabus: getSyllabus(examType), officialSources, intelligenceNotes: sourceNotes })
}

const getSubjectChapters = (req, res) => {
  const { examType = 'JEE', subject } = req.query
  if (!subject) return res.json({ subjects: getSubjects(examType), officialSources: officialSources[examType], intelligenceNotes: sourceNotes[examType] })
  res.json({ examType, subject, chapters: getChapters(examType, subject), officialSource: officialSources[examType] })
}

const getChapterDetails = (req, res) => {
  const { examType = 'JEE', subject, chapter } = req.query
  res.json({ subject, chapter, meta: getChapterMeta(subject, chapter), intelligence: getChapterIntelligence(examType, subject, chapter) })
}

const getIntelligence = async (req, res) => {
  const { examType = 'JEE', subject, chapter } = req.query
  if (subject && chapter) return res.json({ intelligence: getChapterIntelligence(examType, subject, chapter), sourceNotes: sourceNotes[examType] })
  if (subject) return res.json({ examType, subject, chapters: getSubjectIntelligence(examType, subject), sourceNotes: sourceNotes[examType] })
  res.json({ examType, subjects: getExamIntelligence(examType), sourceNotes: sourceNotes[examType] })
}

const getPersonalizedPriorityMap = async (req, res) => {
  try {
    const userId = req.user?._id
    const profile = userId ? await StudentProfile.findOne({ user: userId }) : null
    const examType = req.query.examType || profile?.examType || 'JEE'
    const [attempts, mistakes, mastery, resources] = userId ? await Promise.all([
      QuizAttempt.find({ user: userId }).sort({ createdAt: -1 }).limit(100),
      MistakeLog.find({ user: userId }).sort({ createdAt: -1 }).limit(100),
      StudentMastery.find({ user: userId }).sort({ updatedAt: -1 }).limit(100),
      Note.find({ uploadedBy: userId }).sort({ createdAt: -1 }).limit(100),
    ]) : [[], [], [], []]
    const snapshot = buildStrategySummary({ examType, profile, attempts, mastery, mistakes, resources })
    res.json(snapshot)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getFullSyllabus, getSubjectChapters, getChapterDetails, getIntelligence, getPersonalizedPriorityMap }
