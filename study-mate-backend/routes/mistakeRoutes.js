const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getMistakes, createMistake } = require('../controllers/mistakeController')

router.get('/', protect, getMistakes)
router.post('/', protect, createMistake)

module.exports = router
