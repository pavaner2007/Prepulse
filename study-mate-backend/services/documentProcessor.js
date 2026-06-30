const fs = require('fs')
const path = require('path')
const pdfParse = require('pdf-parse')

const extractTextFromFile = async (file) => {
  if (!file?.path) return ''
  const ext = path.extname(file.originalname || file.filename || '').toLowerCase()

  if (ext === '.pdf' || file.mimetype === 'application/pdf') {
    const buffer = fs.readFileSync(file.path)
    const data = await pdfParse(buffer)
    return (data.text || '').trim()
  }

  if (ext === '.txt' || file.mimetype === 'text/plain') {
    return fs.readFileSync(file.path, 'utf8').trim()
  }

  // DOCX/PPT/image OCR can be added later. Keep upload stable with metadata-only fallback.
  return ''
}

module.exports = { extractTextFromFile }
