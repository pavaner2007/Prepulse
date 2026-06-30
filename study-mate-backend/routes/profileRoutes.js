const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getStudentProfile, upsertStudentProfile } = require('../controllers/profileController')

router.get('/', protect, getStudentProfile)
router.post('/', protect, upsertStudentProfile)
router.put('/', protect, upsertStudentProfile)

module.exports = router
