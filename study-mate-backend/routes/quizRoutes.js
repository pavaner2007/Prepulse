const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { generateAdaptiveQuiz, submitQuiz, getQuizHistory } = require('../controllers/quizController')

router.post('/generate', protect, generateAdaptiveQuiz)
router.post('/submit', protect, submitQuiz)
router.get('/history', protect, getQuizHistory)

module.exports = router
