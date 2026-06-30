const { getAnalyticsSnapshot } = require('./analyticsController')
const { generateBattlePlan } = require('../services/strategyEngine')

const getTodayPlan = async (req, res) => {
  try {
    const analytics = await getAnalyticsSnapshot(req.user._id)
    const plan = generateBattlePlan({
      profile: analytics.profile,
      attempts: analytics.attempts,
      mastery: analytics.mastery,
      mistakes: analytics.mistakes,
      resources: analytics.resources,
    })
    res.json({
      title: 'Today’s Battle Plan',
      examType: analytics.profile?.examType || 'JEE/NEET',
      dailyStudyHours: analytics.profile?.dailyStudyHours || 4,
      readiness: analytics.readiness,
      stage: plan.stage,
      daysLeft: plan.daysLeft,
      tasks: plan.tasks,
      weakFocus: plan.weakFocus,
      syllabusCoverage: plan.coverage,
      source: plan.source,
      highYieldChapters: plan.highYieldChapters,
      strategySnapshot: plan.strategySnapshot,
      weeklyPlan: plan.weeklyPlan,
      disclaimer: 'AI-generated explanations should be verified for high-stakes exam preparation.',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const generateTodayPlan = getTodayPlan

module.exports = { getTodayPlan, generateTodayPlan }
