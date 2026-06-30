const Note = require('../models/Note')
const QuizAttempt = require('../models/QuizAttempt')
const MistakeLog = require('../models/MistakeLog')
const StudentMastery = require('../models/StudentMastery')
const StudentProfile = require('../models/StudentProfile')
const { getSubjects } = require('../data/syllabusData')
const { identifyWeakAreas, calculateReadiness, buildCoverage } = require('../services/strategyEngine')
const { buildStrategySummary } = require('../data/syllabusIntelligence')

const getAnalyticsSnapshot = async (userId) => {
  const [resources, attempts, mistakes, mastery, profile] = await Promise.all([
    Note.find({ uploadedBy: userId }).sort({ createdAt: -1 }),
    QuizAttempt.find({ user: userId }).sort({ createdAt: -1 }).limit(100),
    MistakeLog.find({ user: userId }).sort({ createdAt: -1 }).limit(100),
    StudentMastery.find({ user: userId }).sort({ updatedAt: -1 }).limit(100),
    StudentProfile.findOne({ user: userId }),
  ])

  const examType = profile?.examType || 'JEE'
  const readinessData = calculateReadiness({ profile, attempts, mastery, mistakes })
  const weakAreas = identifyWeakAreas({ examType, profile, attempts, mastery, mistakes, resources })
  const strategyInsights = buildStrategySummary({ examType, profile, attempts, mastery, mistakes, resources })
  const subjects = getSubjects(examType)

  const subjectReadiness = subjects.map((subject) => {
    const subjectAttempts = attempts.filter(a => a.subject === subject)
    const subjectMastery = mastery.filter(m => m.subject === subject)
    const avgAccuracy = subjectAttempts.length ? Math.round(subjectAttempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / subjectAttempts.length) : null
    const avgMastery = subjectMastery.length ? Math.round(subjectMastery.reduce((sum, m) => sum + (m.masteryScore || 0), 0) / subjectMastery.length) : null
    const weakPenalty = profile?.weakSubjects?.includes(subject) ? 8 : 0
    const score = Math.max(20, Math.min(95, Math.round((avgAccuracy ?? avgMastery ?? 58) - weakPenalty)))
    return { subject, score, status: score >= 76 ? 'Strong' : score >= 51 ? 'Improving' : 'Weak' }
  })

  const revisionAlerts = weakAreas.slice(0, 6).filter(ch => ch.revisionDue || ch.masteryScore < 70).map(ch => ({
    topic: ch.chapter,
    subject: ch.subject,
    reason: `${ch.chapter} is due because mastery is ${ch.masteryScore}% and recent mistakes are ${ch.mistakeCount}.`,
    action: `Revise ${ch.concept} and solve 15 PYQ-style MCQs.`,
  }))

  const avgAccuracy = attempts.length ? Math.round(attempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / attempts.length) : readinessData.accuracyScore

  return {
    profile,
    resources,
    attempts,
    mistakes,
    mastery,
    readiness: readinessData.overall,
    readinessBreakdown: readinessData,
    subjectReadiness,
    avgAccuracy,
    weakChapters: weakAreas.slice(0, 10),
    revisionAlerts,
    coverage: buildCoverage({ examType, attempts, mastery, resources }),
    strategyInsights,
    streak: attempts.length ? Math.min(30, attempts.length + 2) : 0,
  }
}

const dashboardAnalytics = async (req, res) => {
  try {
    const data = await getAnalyticsSnapshot(req.user._id)
    const repeated = data.mistakes.reduce((acc, m) => {
      acc[m.mistakeType] = (acc[m.mistakeType] || 0) + 1
      return acc
    }, {})
    const repeatedType = Object.entries(repeated).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No repeated mistakes yet'

    res.json({
      readiness: data.readiness,
      readinessBreakdown: data.readinessBreakdown,
      subjectReadiness: data.subjectReadiness,
      weakChapters: data.weakChapters,
      recentMistakes: data.mistakes.slice(0, 5),
      revisionAlerts: data.revisionAlerts,
      studyStreak: data.streak,
      quizAccuracy: data.avgAccuracy,
      uploadedResourcesCount: data.resources.length,
      repeatedMistakeType: repeatedType,
      syllabusCoverage: data.coverage,
      highYieldChapters: data.strategyInsights.attackFirst.slice(0, 6),
      strategyInsights: {
        weightedCoveragePercent: data.strategyInsights.weightedCoveragePercent,
        priorityFormula: data.strategyInsights.priorityFormula,
        topPriority: data.strategyInsights.topPriority.slice(0, 6),
        neglectedHighYield: data.strategyInsights.neglectedHighYield.slice(0, 4),
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const readinessAnalytics = async (req, res) => {
  try {
    const data = await getAnalyticsSnapshot(req.user._id)
    res.json({
      overall: data.readiness,
      breakdown: data.readinessBreakdown,
      subjectReadiness: data.subjectReadiness,
      riskAreas: data.weakChapters.slice(0, 5),
      coverage: data.coverage,
      strategyInsights: data.strategyInsights,
      recommendedAction: data.weakChapters[0]
        ? `Practice 20 timed questions from ${data.weakChapters[0].subject} • ${data.weakChapters[0].chapter} this week.`
        : 'Take a diagnostic quiz to unlock a personalized readiness score.',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const masteryAnalytics = async (req, res) => {
  try {
    const data = await getAnalyticsSnapshot(req.user._id)
    res.json(data.weakChapters)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { dashboardAnalytics, readinessAnalytics, masteryAnalytics, getAnalyticsSnapshot }
