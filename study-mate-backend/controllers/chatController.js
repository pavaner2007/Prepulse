const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')
const pdfParse = require('pdf-parse')
const { fetchYoutubeTranscript } = require('../utils/youtubeTranscript')
const { answerDoubt, summarizeYoutubeTranscript } = require('../services/aiService')
const Chat = require('../models/Chat')

const SYSTEM_PROMPT = `You are PrepPulse AI, a helpful academic mentor for JEE/NEET aspirants. Explain concepts clearly, use uploaded context when available, and remind students to verify AI-generated explanations for high-stakes exam preparation.`

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).select('-pdfText -webContent -youtubeTranscript -messages').sort({ updatedAt: -1 })
    res.json(chats)
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id }).select('-pdfText -webContent -youtubeTranscript')
    if (!chat) return res.status(404).json({ message: 'Chat not found' })
    res.json(chat)
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const createChat = async (req, res) => {
  try {
    const chat = await Chat.create({ user: req.user._id, title: 'New PrepPulse Chat', messages: [] })
    res.status(201).json(chat)
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const uploadPdfToChat = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please upload a PDF file' })
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id })
    if (!chat) {
      fs.unlinkSync(req.file.path)
      return res.status(404).json({ message: 'Chat not found' })
    }
    const pdfData = await pdfParse(fs.readFileSync(req.file.path))
    fs.unlinkSync(req.file.path)

    const textContent = (pdfData.text || '').trim()
    const { summarizeDocumentText } = require('../services/aiService')
    const summaryData = await summarizeDocumentText({
      title: req.file.originalname,
      text: textContent,
      subject: 'General',
      chapter: '',
    })

    const assistantContent = `## 📄 Summary of ${req.file.originalname}\n\n${summaryData.summary}\n\n### Key points\n${(summaryData.keyPoints || []).map(p => `- ${p}`).join('\n')}`
    const systemMessage = { role: 'system', content: `📄 PDF uploaded: "${req.file.originalname}" (${pdfData.numpages} pages). Ask PrepPulse AI questions from this document.` }
    const assistantMessage = { role: 'assistant', content: assistantContent }

    chat.pdfName = req.file.originalname
    chat.pdfText = textContent
    chat.webUrl = null
    chat.webTitle = null
    chat.webContent = null
    chat.youtubeUrl = null
    chat.youtubeTitle = null
    chat.youtubeTranscript = null
    chat.messages = chat.messages.filter(m => m.role !== 'system')
    chat.messages.push(systemMessage, assistantMessage)
    await chat.save()
    res.json({ message: 'PDF uploaded and processed successfully', pdfName: req.file.originalname, pages: pdfData.numpages, chatId: chat._id, systemMessage, assistantMessage })
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path)
    res.status(500).json({ message: error.message })
  }
}

const scrapeWebPage = async (req, res) => {
  try {
    const { url } = req.body
    if (!url?.trim()) return res.status(400).json({ message: 'URL is required' })
    let parsedUrl
    try { parsedUrl = new URL(url.trim()) } catch { return res.status(400).json({ message: 'Invalid URL format' }) }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return res.status(400).json({ message: 'Only HTTP and HTTPS URLs are supported' })

    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id })
    if (!chat) return res.status(404).json({ message: 'Chat not found' })

    const response = await axios.get(url.trim(), { headers: { 'User-Agent': 'Mozilla/5.0 PrepPulseAI/1.0' }, timeout: 15000, maxRedirects: 5 })
    const $ = cheerio.load(response.data)
    $('script, style, nav, footer, header, aside, iframe, noscript, svg, img, form, button, input').remove()
    const pageTitle = $('title').text().trim() || $('h1').first().text().trim() || parsedUrl.hostname
    const cleanText = ($('main').text() || $('article').text() || $('body').text()).replace(/\s+/g, ' ').trim()
    if (cleanText.length < 100) return res.status(422).json({ message: 'Could not extract meaningful content from this page.' })

    const systemMessage = { role: 'system', content: `🌐 Web page loaded: "${pageTitle}". Ask questions about this context.` }
    chat.webUrl = url.trim()
    chat.webTitle = pageTitle
    chat.webContent = cleanText.slice(0, 12000)
    chat.pdfName = null
    chat.pdfText = null
    chat.youtubeUrl = null
    chat.youtubeTitle = null
    chat.youtubeTranscript = null
    chat.messages = chat.messages.filter(m => m.role !== 'system')
    chat.messages.push(systemMessage)
    if (chat.title === 'New PrepPulse Chat' || chat.title === 'New Chat') chat.title = pageTitle.slice(0, 50)
    await chat.save()
    res.json({ webUrl: chat.webUrl, webTitle: pageTitle, contentLength: chat.webContent.length, systemMessage: { ...systemMessage, _id: chat.messages.at(-1)._id } })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const removeWebFromChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id })
    if (!chat) return res.status(404).json({ message: 'Chat not found' })
    chat.webUrl = null; chat.webTitle = null; chat.webContent = null
    chat.messages = chat.messages.filter(m => m.role !== 'system')
    await chat.save()
    res.json({ message: 'Web content removed from chat' })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const removePdfFromChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id })
    if (!chat) return res.status(404).json({ message: 'Chat not found' })
    chat.pdfName = null; chat.pdfText = null
    chat.messages = chat.messages.filter(m => m.role !== 'system')
    await chat.save()
    res.json({ message: 'PDF removed from chat' })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const sendMessage = async (req, res) => {
  try {
    const { content } = req.body
    if (!content?.trim()) return res.status(400).json({ message: 'Message content is required' })
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id })
    if (!chat) return res.status(404).json({ message: 'Chat not found' })

    const userMessage = { role: 'user', content: content.trim() }
    chat.messages.push(userMessage)
    if (chat.title === 'New PrepPulse Chat' || chat.title === 'New Chat') chat.title = content.trim().slice(0, 50)

    const context = []
    if (chat.pdfText) context.push({ sourceTitle: chat.pdfName, content: chat.pdfText.slice(0, 6000) })
    if (chat.webContent) context.push({ sourceTitle: chat.webTitle, content: chat.webContent.slice(0, 6000) })
    if (chat.youtubeTranscript) context.push({ sourceTitle: chat.youtubeTitle, content: chat.youtubeTranscript.slice(0, 6000) })

    const answer = await answerDoubt({ question: `${SYSTEM_PROMPT}\n\n${content.trim()}`, context })
    const formatted = [
      `**Final answer:** ${answer.finalAnswer}`,
      '',
      '**Step-by-step:**',
      ...(answer.stepByStep || []).map((s, i) => `${i + 1}. ${s}`),
      '',
      `**Concept used:** ${answer.conceptUsed}`,
      `**Formula used:** ${answer.formulaUsed}`,
      `**Common mistake:** ${answer.commonMistake}`,
      `**Practice:** ${answer.relatedPracticeQuestion}`,
      '',
      `_${answer.disclaimer}_`,
    ].join('\n')
    const assistantMessage = { role: 'assistant', content: formatted }
    chat.messages.push(assistantMessage)
    await chat.save()
    res.json({ userMessage: { ...userMessage, _id: chat.messages.at(-2)._id }, assistantMessage: { ...assistantMessage, _id: chat.messages.at(-1)._id } })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!chat) return res.status(404).json({ message: 'Chat not found' })
    res.json({ message: 'Chat deleted successfully' })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const summarizeYoutube = async (req, res) => {
  try {
    const { url } = req.body
    if (!url?.trim()) return res.status(400).json({ message: 'YouTube URL is required' })
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id })
    if (!chat) return res.status(404).json({ message: 'Chat not found' })

    const data = await fetchYoutubeTranscript(url.trim())
    const analysis = await summarizeYoutubeTranscript({ title: data.videoTitle, transcript: data.transcript })
    const assistantContent = `## ${analysis.videoTitle}\n\n${analysis.summary}\n\n### Key points\n${(analysis.keyPoints || []).map(p => `- ${p}`).join('\n')}\n\n### Practice\n${(analysis.practiceQuestions || []).map(p => `- ${p}`).join('\n')}\n\n_${analysis.disclaimer}_`
    const systemMessage = { role: 'system', content: `▶️ YouTube lecture linked: "${data.videoTitle}". Transcript is ready for questions.` }
    const assistantMessage = { role: 'assistant', content: assistantContent }
    chat.youtubeUrl = url.trim(); chat.youtubeTitle = data.videoTitle; chat.youtubeTranscript = data.transcript
    chat.pdfName = null; chat.pdfText = null; chat.webUrl = null; chat.webTitle = null; chat.webContent = null
    chat.messages = chat.messages.filter(m => m.role !== 'system')
    chat.messages.push(systemMessage, assistantMessage)
    if (chat.title === 'New PrepPulse Chat' || chat.title === 'New Chat') chat.title = data.videoTitle.slice(0, 50)
    await chat.save()
    res.json({ youtubeUrl: url.trim(), youtubeTitle: data.videoTitle, transcriptLength: data.transcript.length, systemMessage: { ...systemMessage, _id: chat.messages.at(-2)._id }, assistantMessage: { ...assistantMessage, _id: chat.messages.at(-1)._id } })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

const removeYoutubeFromChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id })
    if (!chat) return res.status(404).json({ message: 'Chat not found' })
    chat.youtubeUrl = null; chat.youtubeTitle = null; chat.youtubeTranscript = null
    chat.messages = chat.messages.filter(m => m.role !== 'system')
    await chat.save()
    res.json({ message: 'YouTube context removed from chat' })
  } catch (error) { res.status(500).json({ message: error.message }) }
}

module.exports = {
  getChats, getChatById, createChat, uploadPdfToChat, sendMessage, deleteChat, removePdfFromChat,
  scrapeWebPage, removeWebFromChat, summarizeYoutube, removeYoutubeFromChat,
}
