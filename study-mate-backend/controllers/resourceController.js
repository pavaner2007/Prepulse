const fs = require('fs')
const path = require('path')
const Note = require('../models/Note')
const { extractTextFromFile } = require('../services/documentProcessor')
const { chunkText } = require('../services/chunkingService')
const { storeDocumentChunks } = require('../services/ragService')

const getResources = async (req, res) => {
  try {
    const query = { uploadedBy: req.user._id }
    if (req.query.subject) query.subject = req.query.subject
    if (req.query.sourceType) query.sourceType = req.query.sourceType
    const resources = await Note.find(query).sort({ createdAt: -1 })
    res.json(resources)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const uploadResource = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a resource file' })

    const { title, subject, chapter, sourceType, description } = req.body
    if (!subject) {
      fs.unlinkSync(req.file.path)
      return res.status(400).json({ message: 'Subject is required' })
    }

    const extractedText = await extractTextFromFile(req.file).catch(() => '')
    const ext = path.extname(req.file.originalname).replace('.', '').toUpperCase() || 'FILE'
    const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2)
    const tags = String(req.body.tags || '').split(',').map(t => t.trim()).filter(Boolean)

    const resource = await Note.create({
      title: title || req.file.originalname,
      subject,
      chapter: chapter || '',
      sourceType: sourceType || 'Notes',
      tags,
      description: description || `${sourceType || 'Notes'} resource for ${subject}${chapter ? ` • ${chapter}` : ''}`,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: ext === 'DOCX' ? 'DOC' : ext,
      fileSize: `${fileSizeMB} MB`,
      extractedText,
      college: req.user.college || '',
      uploadedBy: req.user._id,
    })

    const chunks = chunkText(extractedText)
    if (chunks.length) {
      await storeDocumentChunks({
        userId: req.user._id,
        documentId: resource._id,
        fileName: resource.fileName,
        subject: resource.subject,
        chapter: resource.chapter,
        chunks,
      })
    }

    res.status(201).json({
      resource,
      extractedTextLength: extractedText.length,
      chunksCreated: chunks.length,
      message: chunks.length ? 'Resource uploaded and indexed for RAG.' : 'Resource uploaded. Text extraction was limited for this file type.',
    })
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
    res.status(500).json({ message: error.message })
  }
}

const summarizeResource = async (req, res) => {
  try {
    const { id } = req.params
    const note = await Note.findOne({ _id: id, uploadedBy: req.user._id })
    if (!note) return res.status(404).json({ message: 'Resource not found' })

    if (!note.extractedText || !note.extractedText.trim()) {
      return res.status(400).json({ message: 'No extractable text found in this resource to summarize.' })
    }

    const { summarizeDocumentText } = require('../services/aiService')
    const summaryData = await summarizeDocumentText({
      title: note.title,
      text: note.extractedText,
      subject: note.subject,
      chapter: note.chapter,
    })

    res.json(summaryData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getResources, uploadResource, summarizeResource }
