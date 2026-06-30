const fs = require('fs')
const { retrieveRelevantChunks } = require('../services/ragService')
const { answerDoubt } = require('../services/aiService')

const askDoubt = async (req, res) => {
  try {
    const { question, subject, chapter, documentId, examType } = req.body
    if (!question || !question.trim()) return res.status(400).json({ message: 'Question is required' })

    const context = await retrieveRelevantChunks({ userId: req.user._id, query: question, subject, chapter, documentId })
    const answer = await answerDoubt({ question: question.trim(), subject, chapter, examType, context })

    res.json({ question, subject, chapter, documentId, examType, context, answer })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const extractQuestionImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a question image' })
    const manualText = req.body.questionText || ''
    const fileName = req.file.originalname
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
    res.json({
      fileName,
      extractedText: manualText,
      warning: 'OCR could not read perfectly in this MVP environment. Please edit or type the extracted question before solving.',
    })
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
    res.status(500).json({ message: error.message })
  }
}

module.exports = { askDoubt, extractQuestionImage }
