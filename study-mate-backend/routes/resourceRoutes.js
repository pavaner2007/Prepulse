const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { uploadNote } = require('../middleware/uploadMiddleware')
const { getResources, uploadResource, summarizeResource } = require('../controllers/resourceController')

router.get('/', protect, getResources)
router.post('/upload', protect, uploadNote.single('file'), uploadResource)
router.post('/:id/summarize', protect, summarizeResource)

module.exports = router
