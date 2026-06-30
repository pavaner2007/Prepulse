const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getFullSyllabus, getSubjectChapters, getChapterDetails, getIntelligence, getPersonalizedPriorityMap } = require('../controllers/syllabusController')

router.get('/', getFullSyllabus)
router.get('/chapters', getSubjectChapters)
router.get('/chapter', getChapterDetails)
router.get('/intelligence', getIntelligence)
router.get('/priority-map', protect, getPersonalizedPriorityMap)

module.exports = router
