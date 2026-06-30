const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { analyzeYoutube } = require('../controllers/youtubeController')

router.post('/analyze', protect, analyzeYoutube)

module.exports = router
