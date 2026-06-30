const multer = require('multer')
const path = require('path')
const fs = require('fs')

const notesUploadDir = path.join(__dirname, '..', 'uploads', 'notes')
const pdfUploadDir = path.join(__dirname, '..', 'uploads', 'pdfs')
const imageUploadDir = path.join(__dirname, '..', 'uploads', 'images')

for (const dir of [notesUploadDir, pdfUploadDir, imageUploadDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const createStorage = (destination) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, destination),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

const notesFileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.png', '.jpg', '.jpeg', '.webp']
  const ext = path.extname(file.originalname).toLowerCase()
  if (allowed.includes(ext)) cb(null, true)
  else cb(Object.assign(new Error('Only PDF, TXT, DOC, DOCX, PPT, PPTX or image files are allowed'), { code: 'INVALID_FILE_TYPE' }))
}

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true)
  else cb(Object.assign(new Error('Only PDF files are allowed for chat'), { code: 'INVALID_FILE_TYPE' }))
}

const imageFileFilter = (req, file, cb) => {
  const allowed = ['.png', '.jpg', '.jpeg', '.webp']
  const ext = path.extname(file.originalname).toLowerCase()
  if (file.mimetype?.startsWith('image/') || allowed.includes(ext)) cb(null, true)
  else cb(Object.assign(new Error('Only image files are allowed'), { code: 'INVALID_FILE_TYPE' }))
}

const uploadNote = multer({ storage: createStorage(notesUploadDir), fileFilter: notesFileFilter, limits: { fileSize: 15 * 1024 * 1024 } })
const uploadPdf = multer({ storage: createStorage(pdfUploadDir), fileFilter: pdfFileFilter, limits: { fileSize: 10 * 1024 * 1024 } })
const uploadImage = multer({ storage: createStorage(imageUploadDir), fileFilter: imageFileFilter, limits: { fileSize: 8 * 1024 * 1024 } })

module.exports = { uploadNote, uploadPdf, uploadImage }
