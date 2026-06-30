const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { dashboardAnalytics, readinessAnalytics, masteryAnalytics } = require('../controllers/analyticsController')

router.get('/dashboard', protect, dashboardAnalytics)
router.get('/readiness', protect, readinessAnalytics)
router.get('/mastery', protect, masteryAnalytics)

module.exports = router
