const { getSubjects, getChapters, officialSources } = require('../data/syllabusData')
const { getChapterIntelligence, rankChaptersForStudent, buildStrategySummary } = require('../data/syllabusIntelligence')

const daysBetween = (from, to) => Math.max(0, Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)))
const avg = (items, getter, fallback = 0) => items.length ? Math.round(items.reduce((s, x) => s + Number(getter(x) || 0), 0) / items.length) : fallback

const buildCoverage = ({ examType = 'JEE', attempts = [], mastery = [], resources = [] }) => {
  const subjects = getSubjects(examType)
  return subjects.map((subject) => {
    const chapters = getChapters(examType, subject)
    const attempted = new Set(attempts.filter(a => a.subject === subject).map(a => a.chapter).filter(Boolean))
    const mastered = new Set(mastery.filter(m => m.subject === subject && Number(m.masteryScore || 0) >= 76).map(m => m.chapter).filter(Boolean))
    const uploaded = new Set(resources.filter(r => r.subject === subject).map(r => r.chapter).filter(Boolean))
    const touchedChapters = chapters.filter(ch => attempted.has(ch) || mastered.has(ch) || uploaded.has(ch)).length
    const weightedTotal = chapters.reduce((sum, chapter) => sum + getChapterIntelligence(examType, subject, chapter).priorityScore, 0)
    const weightedTouched = chapters.reduce((sum, chapter) => {
      const touched = attempted.has(chapter) || mastered.has(chapter) || uploaded.has(chapter)
      return sum + (touched ? getChapterIntelligence(examType, subject, chapter).priorityScore : 0)
    }, 0)
    return {
      subject,
      totalChapters: chapters.length,
      touchedChapters,
      coveragePercent: Math.round((touchedChapters / Math.max(chapters.length, 1)) * 100),
      weightedCoveragePercent: Math.round((weightedTouched / Math.max(weightedTotal, 1)) * 100),
    }
  })
}

const identifyWeakAreas = ({ examType = 'JEE', profile, attempts = [], mastery = [], mistakes = [], resources = [] }) => {
  return rankChaptersForStudent({ examType, profile, attempts, mastery, mistakes, resources }).map((item) => ({
    subject: item.subject,
    chapter: item.chapter,
    concept: item.microTopics?.[0] || item.chapter,
    masteryScore: item.masteryScore,
    accuracy: item.studentAccuracy,
    mistakeCount: item.mistakeCount,
    weight: item.weightagePercent,
    pyqFrequency: item.pyqFrequency,
    ncertPriority: item.ncertPriority,
    priorityScore: item.priorityScore,
    actionScore: item.actionScore,
    priorityBand: item.priorityBand,
    expectedMarks: item.expectedMarks,
    scoreImpact: item.scoreImpact,
    revisionDue: item.revisionDue,
    revisionCycleDays: item.revisionCycleDays,
    microTopics: item.microTopics,
    commonMistakes: item.commonMistakes,
    strategyTags: item.strategyTags,
    recommendedAction: item.recommendedAction,
    strategy: item.recommendedAction,
  }))
}

const calculateReadiness = ({ profile, attempts = [], mastery = [], mistakes = [] }) => {
  const accuracyScore = avg(attempts, a => a.accuracy, attempts.length ? 0 : 58)
  const masteryScore = avg(mastery, m => m.masteryScore, mastery.length ? 0 : 52)
  const recentMistakes = mistakes.filter(m => daysBetween(m.createdAt || new Date(), new Date()) <= 14).length
  const mistakeReduction = Math.max(25, 100 - recentMistakes * 5)
  const revisionConsistency = mastery.length ? Math.round((mastery.filter(m => !m.revisionDue).length / mastery.length) * 100) : 50
  const overall = Math.round(accuracyScore * 0.4 + masteryScore * 0.3 + revisionConsistency * 0.2 + mistakeReduction * 0.1)
  return { overall, accuracyScore, masteryScore, revisionConsistency, mistakeReduction, riskBand: overall >= 80 ? 'Strong' : overall >= 60 ? 'Improving' : 'High Risk' }
}

const phaseFromDays = (daysLeft) => {
  if (daysLeft == null) return 'diagnostic'
  if (daysLeft > 180) return 'foundation'
  if (daysLeft > 90) return 'coverage-building'
  if (daysLeft > 45) return 'score-building'
  if (daysLeft > 15) return 'mock-intensive'
  return 'final-revision'
}

const generateWeeklyPlan = ({ ranked, dailyHours, stage }) => {
  const top = ranked.slice(0, 6)
  const practiceCount = stage === 'final-revision' || stage === 'mock-intensive' ? 35 : 20
  return top.map((item, index) => ({
    day: `Day ${index + 1}`,
    subject: item.subject,
    chapter: item.chapter,
    focus: item.masteryScore < 60 ? 'Concept repair + easy/medium MCQs' : 'Timed PYQ-style practice',
    target: `${practiceCount} questions + ${item.revisionCycleDays <= 4 ? 'NCERT/formula rapid recall' : 'mistake review'}`,
    reason: `${item.priorityBand} • ${item.weightagePercent}% trend weight • PYQ ${item.pyqFrequency}/10 • action score ${item.actionScore}/100`,
  }))
}

const generateBattlePlan = ({ profile, attempts = [], mastery = [], mistakes = [], resources = [] }) => {
  const examType = profile?.examType || 'JEE'
  const dailyHours = Math.max(2, Number(profile?.dailyStudyHours || 4))
  const targetDate = profile?.targetExamDate || null
  const daysLeft = targetDate ? daysBetween(new Date(), targetDate) : null
  const stage = phaseFromDays(daysLeft)
  const strategySnapshot = buildStrategySummary({ examType, profile, attempts, mastery, mistakes, resources })
  const ranked = strategySnapshot.topPriority
  const primary = ranked[0]
  const secondary = ranked[1]
  const third = ranked[2]
  const taskMinutes = Math.round((dailyHours * 60) / 4)
  const mcqTarget = stage === 'final-revision' ? 45 : stage === 'mock-intensive' ? 35 : stage === 'score-building' ? 25 : 18

  const tasks = [
    {
      task: `Attack high-yield chapter: ${primary?.chapter || profile?.weakSubjects?.[0] || 'diagnostic weak area'}`,
      duration: `${Math.max(40, taskMinutes)} minutes`,
      reason: primary ? `${primary.subject} • ${primary.priorityBand}: ${primary.weightagePercent}% trend weight, PYQ frequency ${primary.pyqFrequency}/10, mastery ${primary.masteryScore}%, action score ${primary.actionScore}/100.` : 'Start with a diagnostic area to unlock personalization.',
      type: 'high-yield-revision',
      subject: primary?.subject,
      chapter: primary?.chapter,
      priorityScore: primary?.priorityScore,
      actionScore: primary?.actionScore,
      microTopics: primary?.microTopics?.slice(0, 3),
    },
    {
      task: `Solve ${mcqTarget} timed PYQ-style MCQs from ${primary?.chapter || 'today’s focus chapter'}`,
      duration: `${Math.max(45, taskMinutes + 10)} minutes`,
      reason: primary ? `This chapter can influence roughly ${primary.expectedMarks} marks and needs speed + accuracy, not only theory.` : 'Timed MCQs convert concepts into exam performance.',
      type: 'timed-practice',
      subject: primary?.subject,
      chapter: primary?.chapter,
    },
    {
      task: secondary ? `Repair mistake pattern: ${secondary.chapter}` : 'Review wrong answers from the latest quiz',
      duration: `${Math.max(30, Math.round(taskMinutes * 0.8))} minutes`,
      reason: secondary ? `${secondary.commonMistakes?.[0] || 'Repeated errors'} is likely hurting marks. Fix it before taking another mock.` : 'Mistake review prevents repeating the same error pattern.',
      type: 'mistake-memory',
      subject: secondary?.subject,
      chapter: secondary?.chapter,
    },
    {
      task: third ? `NCERT/formula recall sprint: ${third.chapter}` : 'Upload one resource for RAG-based doubt solving',
      duration: `${Math.max(25, Math.round(taskMinutes * 0.65))} minutes`,
      reason: third ? `NCERT priority ${third.ncertPriority}/10 and revision cycle ${third.revisionCycleDays} days make this a quick retention win.` : 'Uploaded notes improve grounded doubt solving and revision.',
      type: 'retention-rag',
      subject: third?.subject,
      chapter: third?.chapter,
    },
  ]

  return {
    stage,
    daysLeft,
    tasks,
    weakFocus: ranked.slice(0, 6),
    highYieldChapters: strategySnapshot.attackFirst,
    strategySnapshot,
    weeklyPlan: generateWeeklyPlan({ ranked, dailyHours, stage }),
    coverage: buildCoverage({ examType, attempts, mastery, resources }),
    source: officialSources[examType],
  }
}

module.exports = { buildCoverage, identifyWeakAreas, calculateReadiness, generateBattlePlan }
