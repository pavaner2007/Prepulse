const QuizAttempt = require('../models/QuizAttempt')
const MistakeLog = require('../models/MistakeLog')
const StudentMastery = require('../models/StudentMastery')
const { generateQuiz } = require('../services/aiService')

const mistakeTypes = ['Conceptual Mistake', 'Formula Mistake', 'Calculation Mistake', 'Careless Mistake', 'Time Pressure Mistake', 'Memory Gap', 'Wrong Approach']

const classifyMistake = (question, timeTaken = 0) => {
  const q = `${question?.question || ''} ${question?.explanation || ''}`.toLowerCase()
  if (timeTaken > 90) return 'Time Pressure Mistake'
  if (q.includes('formula') || q.includes('equation')) return 'Formula Mistake'
  if (q.includes('calculate') || q.includes('numerical')) return 'Calculation Mistake'
  return mistakeTypes[Math.floor(Math.random() * mistakeTypes.length)]
}

const generateAdaptiveQuiz = async (req, res) => {
  try {
    const { examType, subject, chapter, difficulty, numberOfQuestions } = req.body
    const quiz = await generateQuiz({ examType, subject, chapter, difficulty, numberOfQuestions })
    res.json({ ...quiz, examType, subject, chapter, difficulty, generatedAt: new Date().toISOString() })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const submitQuiz = async (req, res) => {
  try {
    const { examType, subject, chapter, difficulty, questions = [], answers = {}, timeTaken = 0 } = req.body

    const reviewed = questions.map((q) => {
      const studentAnswer = answers[q.id] || answers[q.question] || ''
      const isCorrect = String(studentAnswer).trim() === String(q.correctAnswer).trim()
      return { ...q, studentAnswer, isCorrect }
    })

    const score = reviewed.filter(q => q.isCorrect).length
    const total = reviewed.length || 1
    const accuracy = Math.round((score / total) * 100)

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      examType,
      subject,
      chapter,
      difficulty,
      questions: reviewed,
      score,
      total: reviewed.length,
      accuracy,
      timeTaken: Number(timeTaken) || 0,
    })

    const mistakes = []
    for (const q of reviewed.filter(item => !item.isCorrect)) {
      mistakes.push(await MistakeLog.create({
        user: req.user._id,
        question: q.question,
        studentAnswer: q.studentAnswer,
        correctAnswer: q.correctAnswer,
        subject,
        chapter,
        concept: q.conceptTag || chapter || subject,
        mistakeType: classifyMistake(q, timeTaken / total),
        explanation: q.explanation,
        timeTaken: Math.round((Number(timeTaken) || 0) / total),
      }))
    }

    await StudentMastery.create({
      user: req.user._id,
      subject: subject || 'General',
      chapter: chapter || '',
      concept: chapter || subject || 'Practice',
      masteryScore: Math.max(10, Math.min(100, accuracy)),
      accuracy,
      lastPracticed: new Date(),
      revisionDue: accuracy < 70,
    })

    res.json({ attempt, score, total: reviewed.length, accuracy, review: reviewed, mistakes })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getQuizHistory = async (req, res) => {
  try {
    const history = await QuizAttempt.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20)
    res.json(history)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { generateAdaptiveQuiz, submitQuiz, getQuizHistory }
