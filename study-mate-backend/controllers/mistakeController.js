const MistakeLog = require('../models/MistakeLog')

const getMistakes = async (req, res) => {
  try {
    const mistakes = await MistakeLog.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100)
    const typeCounts = mistakes.reduce((acc, m) => {
      acc[m.mistakeType] = (acc[m.mistakeType] || 0) + 1
      return acc
    }, {})
    const conceptCounts = mistakes.reduce((acc, m) => {
      const key = m.concept || m.chapter || m.subject || 'General'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    res.json({ mistakes, typeCounts, conceptCounts })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createMistake = async (req, res) => {
  try {
    const mistake = await MistakeLog.create({ ...req.body, user: req.user._id })
    res.status(201).json(mistake)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getMistakes, createMistake }
