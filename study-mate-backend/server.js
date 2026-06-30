require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const noteRoutes = require('./routes/noteRoutes')
const chatRoutes = require('./routes/chatRoutes')
const profileRoutes = require('./routes/profileRoutes')
const resourceRoutes = require('./routes/resourceRoutes')
const doubtRoutes = require('./routes/doubtRoutes')
const youtubeRoutes = require('./routes/youtubeRoutes')
const quizRoutes = require('./routes/quizRoutes')
const mistakeRoutes = require('./routes/mistakeRoutes')
const studyPlanRoutes = require('./routes/studyPlanRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const syllabusRoutes = require('./routes/syllabusRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const app = express()
const PORT = process.env.PORT || 5000
const NODE_ENV = process.env.NODE_ENV || 'development'

const rawOrigins = [process.env.FRONTEND_URL, process.env.CLIENT_URL, process.env.CORS_ORIGINS]
  .filter(Boolean)
  .flatMap((origin) => origin.split(','))
  .map((origin) => origin.trim())
  .filter(Boolean)

if (NODE_ENV !== 'production') {
  rawOrigins.push('http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173')
}

console.log('Allowed CORS origins:', rawOrigins)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) return callback(null, true)
    if (rawOrigins.includes(origin)) return callback(null, true)
    console.warn(`CORS blocked: ${origin}`)
    return callback(null, false)
  },
  credentials: true,
}))

app.options('*', cors())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/doubt', doubtRoutes)
app.use('/api/youtube', youtubeRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/mistakes', mistakeRoutes)
app.use('/api/study-plan', studyPlanRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/syllabus', syllabusRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    app: 'PrepPulse AI',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    message: 'PrepPulse AI API is running',
  })
})

app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => console.log(`PrepPulse AI server running on port ${PORT} in ${NODE_ENV} mode`))
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`)
    process.exit(1)
  }
}

startServer()

module.exports = app
