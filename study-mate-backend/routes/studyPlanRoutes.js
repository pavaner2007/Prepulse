const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getTodayPlan, generateTodayPlan } = require('../controllers/studyPlanController')

router.get('/today', protect, getTodayPlan)
router.post('/generate', protect, generateTodayPlan)

module.exports = router
