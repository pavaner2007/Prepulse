const axios = require('axios')
const { getQuestions } = require('../data/questionBank')
const { getChapterMeta, officialSources } = require('../data/syllabusData')
const { getChapterIntelligence } = require('../data/syllabusIntelligence')

const AI_PROVIDER = () => (process.env.AI_PROVIDER || 'fallback').toLowerCase()
const GROQ_MODEL = () => process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
const HF_MODEL = () => process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3'
const OLLAMA_BASE_URL = () => process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = () => process.env.OLLAMA_MODEL || 'llama3.1:8b'

const safeJsonParse = (text, fallback) => {
  if (!text) return fallback
  try {
    const cleaned = String(text).replace(/```json|```/g, '').trim()
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    const json = start >= 0 && end >= start ? cleaned.slice(start, end + 1) : cleaned
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

const callGroqChat = async (messages, options = {}) => {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY missing')
  const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
    model: GROQ_MODEL(),
    messages,
    temperature: options.temperature ?? 0.25,
    max_tokens: options.maxTokens ?? 1400,
    response_format: options.json ? { type: 'json_object' } : undefined,
  }, {
    timeout: options.timeout || 45000,
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
  })
  return res.data?.choices?.[0]?.message?.content || ''
}

const callHuggingFace = async (messages, options = {}) => {
  if (!process.env.HF_API_TOKEN) throw new Error('HF_API_TOKEN missing')
  const prompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n') + '\nASSISTANT:'
  const res = await axios.post(`https://api-inference.huggingface.co/models/${HF_MODEL()}`, {
    inputs: prompt,
    parameters: { max_new_tokens: options.maxTokens ?? 1200, temperature: options.temperature ?? 0.25, return_full_text: false },
  }, {
    timeout: options.timeout || 60000,
    headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` },
  })
  const payload = Array.isArray(res.data) ? res.data[0] : res.data
  return payload?.generated_text || payload?.summary_text || ''
}

const callOllamaChat = async (messages, options = {}) => {
  const res = await axios.post(`${OLLAMA_BASE_URL()}/api/chat`, {
    model: OLLAMA_MODEL(),
    messages,
    stream: false,
    options: { temperature: options.temperature ?? 0.25, num_predict: options.maxTokens ?? 1200 },
  }, { timeout: options.timeout || 45000 })
  return res.data?.message?.content || ''
}

const callAI = async (messages, options = {}) => {
  const provider = AI_PROVIDER()
  if (provider === 'groq') return { text: await callGroqChat(messages, options), usedModel: `groq:${GROQ_MODEL()}` }
  if (provider === 'huggingface' || provider === 'hf') return { text: await callHuggingFace(messages, options), usedModel: `hf:${HF_MODEL()}` }
  if (provider === 'ollama') return { text: await callOllamaChat(messages, options), usedModel: `ollama:${OLLAMA_MODEL()}` }
  throw new Error('AI provider disabled; using deterministic fallback')
}

const fallbackDoubtAnswer = ({ question, subject, chapter, context, examType = 'JEE' }) => {
  const meta = getChapterMeta(subject, chapter)
  const intel = getChapterIntelligence(examType || 'JEE', subject, chapter)
  return {
    finalAnswer: 'This is a syllabus-grounded fallback explanation. Connect GROQ_API_KEY or HF_API_TOKEN for richer deployable AI responses.',
    stepByStep: [
      `Identify the chapter: ${chapter || subject || 'selected topic'}.`,
      `Recall core concepts: ${(meta.concepts || []).slice(0, 3).join(', ') || chapter || subject}.`,
      'Write the given data/conditions clearly, then select the matching formula or principle.',
      'Solve step-by-step and verify units, signs, NCERT exceptions, and answer option wording.',
    ],
    conceptUsed: meta.concepts?.[0] || chapter || subject || 'Core JEE/NEET concept',
    formulaUsed: subject === 'Physics' ? 'Use the relevant chapter law/formula after checking units and sign convention.' : subject === 'Chemistry' ? 'Use balanced equations, mole relation, equilibrium/organic rule, or NCERT fact as applicable.' : subject === 'Mathematics' ? 'Use domain check, standard identities and stepwise algebra/calculus.' : 'Use NCERT line-by-line concept recall and diagram/table verification.',
    commonMistake: 'Most students jump to formulas/options before checking conditions, units, exceptions, or exact NCERT wording.',
    relatedPracticeQuestion: `Generate a 5-question quiz from ${chapter || subject || 'this topic'} and review every wrong option explanation.`,
    sourceContext: context?.length ? context.map(c => c.sourceTitle || c.fileName || c.noteTitle).filter(Boolean).slice(0, 3) : [],
    strategyTip: `${meta.strategy} Priority: ${intel.priorityBand}; trend weight ${intel.weightagePercent}%, PYQ frequency ${intel.pyqFrequency}/10, NCERT priority ${intel.ncertPriority}/10.`,
    syllabusIntelligence: intel,
    disclaimer: 'AI-generated explanations should be verified for high-stakes exam preparation.',
  }
}

const answerDoubt = async ({ question, subject, chapter, context = [], examType = 'JEE' }) => {
  const contextText = context.map((c, idx) => `Source ${idx + 1}: ${c.content}`).join('\n\n').slice(0, 7000)
  const fallback = fallbackDoubtAnswer({ question, subject, chapter, context, examType })
  const messages = [
    { role: 'system', content: 'You are PrepPulse AI, a JEE/NEET Study GPS. Return strict JSON with finalAnswer, stepByStep, conceptUsed, formulaUsed, commonMistake, relatedPracticeQuestion, sourceContext, strategyTip, disclaimer. Be exam-focused and do not claim 100% certainty.' },
    { role: 'user', content: `Exam: ${examType}\nSubject: ${subject || 'Not specified'}\nChapter: ${chapter || 'Not specified'}\nQuestion: ${question}\n\nUploaded-note context:\n${contextText || 'No uploaded context available.'}` },
  ]
  try {
    const { text, usedModel } = await callAI(messages, { json: true, maxTokens: 1600 })
    const parsed = safeJsonParse(text, null)
    if (parsed?.finalAnswer) return { ...fallback, ...parsed, rawModelOutput: text, usedModel }
    return { ...fallback, finalAnswer: text || fallback.finalAnswer, usedModel }
  } catch {
    return { ...fallback, usedModel: 'deterministic-fallback' }
  }
}

const summarizeYoutubeTranscript = async ({ title, transcript, subject, chapter }) => {
  const meta = getChapterMeta(subject, chapter)
  const fallback = {
    videoTitle: title || 'YouTube Lecture',
    summary: `This lecture should be mapped to ${chapter || subject || 'the selected topic'}. Focus on core concepts, formulas and examples before solving PYQs.`,
    keyPoints: meta.concepts?.length ? meta.concepts.slice(0, 5) : ['Concept definition', 'Formula/application', 'Solved examples', 'Common mistakes'],
    formulaList: subject === 'Biology' ? ['NCERT diagram/table facts instead of formulas'] : ['Extract formulas from transcript and add to revision sheet'],
    suggestedWatchSegment: 'First watch concept explanation, then examples. Rewatch any section where the teacher changes formula/exception conditions.',
    practiceQuestions: getQuestions({ examType: subject === 'Biology' ? 'NEET' : 'JEE', subject, chapter, count: 3 }).map(q => q.question),
    disclaimer: 'AI-generated explanations should be verified for high-stakes exam preparation.',
  }
  try {
    const { text, usedModel } = await callAI([
      { role: 'system', content: 'Return strict JSON with videoTitle, summary, keyPoints, formulaList, suggestedWatchSegment, practiceQuestions, disclaimer for a JEE/NEET lecture transcript.' },
      { role: 'user', content: `Video title: ${title}\nSubject: ${subject}\nChapter: ${chapter}\nTranscript:\n${String(transcript).slice(0, 9000)}` },
    ], { json: true, maxTokens: 1600 })
    return { ...fallback, ...safeJsonParse(text, fallback), rawModelOutput: text, usedModel }
  } catch {
    return { ...fallback, usedModel: 'deterministic-fallback' }
  }
}

const validateQuestion = (q, index, defaults) => {
  const options = Array.isArray(q.options) && q.options.length >= 4 ? q.options.slice(0, 4) : ['A', 'B', 'C', 'D']
  const correctAnswer = options.includes(q.correctAnswer) ? q.correctAnswer : options[0]
  return {
    id: q.id || `q${index + 1}`,
    question: q.question || `Practice question ${index + 1} from ${defaults.chapter}`,
    options,
    correctAnswer,
    explanation: q.explanation || 'Review the selected concept and compare each option carefully.',
    conceptTag: q.conceptTag || defaults.chapter || defaults.subject,
    difficulty: q.difficulty || defaults.difficulty || 'Medium',
  }
}

const generateQuiz = async ({ examType = 'JEE', subject = 'Physics', chapter = 'Electrostatics', difficulty = 'Medium', numberOfQuestions = 5 }) => {
  const count = Math.max(1, Math.min(Number(numberOfQuestions) || 5, 15))
  const intelligence = getChapterIntelligence(examType, subject, chapter)
  const fallbackQuestions = getQuestions({ examType, subject, chapter, difficulty, count })
  const fallback = {
    questions: fallbackQuestions.map((q, i) => ({ ...validateQuestion(q, i, { subject, chapter, difficulty }), syllabusPriority: intelligence.priorityBand, pyqFrequency: intelligence.pyqFrequency, ncertPriority: intelligence.ncertPriority })),
    usedModel: 'syllabus-intelligence-question-bank',
    source: officialSources[examType],
    syllabusIntelligence: intelligence,
  }

  try {
    const { text, usedModel } = await callAI([
      { role: 'system', content: 'Generate exam-quality JEE/NEET MCQs as strict JSON: {"questions":[{"id":"q1","question":"...","options":["...","...","...","..."],"correctAnswer":"exact option text","explanation":"...","conceptTag":"...","difficulty":"..."}]}. Correct answer must exactly match one option. Use official syllabus style and avoid fake facts.' },
      { role: 'user', content: `Exam: ${examType}\nSubject: ${subject}\nChapter: ${chapter}\nDifficulty: ${difficulty}\nNumber of questions: ${count}\nUse real chapter concepts. If unsure, create NCERT/JEE Main style fundamental questions.
Syllabus intelligence: ${JSON.stringify({ priorityBand: intelligence.priorityBand, weightagePercent: intelligence.weightagePercent, pyqFrequency: intelligence.pyqFrequency, ncertPriority: intelligence.ncertPriority, microTopics: intelligence.microTopics, commonMistakes: intelligence.commonMistakes })}` },
    ], { json: true, maxTokens: 2600 })
    const parsed = safeJsonParse(text, null)
    const generated = Array.isArray(parsed?.questions) ? parsed.questions : []
    if (!generated.length) return fallback
    return { questions: generated.slice(0, count).map((q, i) => ({ ...validateQuestion(q, i, { subject, chapter, difficulty }), syllabusPriority: intelligence.priorityBand, pyqFrequency: intelligence.pyqFrequency, ncertPriority: intelligence.ncertPriority })), usedModel, source: officialSources[examType], syllabusIntelligence: intelligence }
  } catch {
    return fallback
  }
}

const generateBattlePlanText = async ({ plan }) => plan?.tasks || []

const summarizeDocumentText = async ({ title, text, subject, chapter }) => {
  const fallback = {
    summary: `This document contains study notes about ${chapter || subject || 'the selected topic'}. Review the content for core formulas, concepts, and typical problems.`,
    keyPoints: [
      'Understand the fundamental theories and derivations.',
      'Identify key formulas and standard cases.',
      'Solve previous year questions (PYQs) related to this topic.'
    ]
  }

  try {
    const { text: resultText, usedModel } = await callAI([
      { role: 'system', content: 'You are PrepPulse AI, a JEE/NEET study mentor. Summarize the provided document text as a structured JSON object containing "summary" (a concise, detailed paragraph summary of the topic and key takeaways) and "keyPoints" (an array of 3-5 important concepts, formulas, or key bullet points covered in the document).' },
      { role: 'user', content: `Document Title: ${title}\nSubject: ${subject}\nChapter: ${chapter}\nContent:\n${String(text).slice(0, 10000)}` },
    ], { json: true, maxTokens: 1000 })
    
    const parsed = safeJsonParse(resultText, null)
    if (parsed && parsed.summary && Array.isArray(parsed.keyPoints)) {
      return { ...fallback, ...parsed, usedModel }
    }
    return { ...fallback, summary: resultText || fallback.summary, usedModel }
  } catch {
    return { ...fallback, usedModel: 'deterministic-fallback' }
  }
}

module.exports = { answerDoubt, summarizeYoutubeTranscript, generateQuiz, generateBattlePlanText, summarizeDocumentText, callAI, safeJsonParse }
