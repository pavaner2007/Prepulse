const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { uploadImage } = require('../middleware/uploadMiddleware')
const { askDoubt, extractQuestionImage } = require('../controllers/doubtController')

router.post('/ask', protect, askDoubt)
router.post('/image', protect, uploadImage.single('image'), extractQuestionImage)

module.exports = router
