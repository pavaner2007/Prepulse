const { fetchYoutubeTranscript } = require('../utils/youtubeTranscript')
const { summarizeYoutubeTranscript } = require('../services/aiService')

const analyzeYoutube = async (req, res) => {
  try {
    const { url, preferredLang = 'en' } = req.body
    if (!url) return res.status(400).json({ message: 'YouTube URL is required' })

    let transcriptData
    try {
      transcriptData = await fetchYoutubeTranscript(url, preferredLang)
    } catch (error) {
      transcriptData = {
        videoId: null,
        videoTitle: 'YouTube lecture',
        transcript: '',
        transcriptWarning: error.message,
      }
    }

    const analysis = transcriptData.transcript
      ? await summarizeYoutubeTranscript({ title: transcriptData.videoTitle, transcript: transcriptData.transcript })
      : {
          videoTitle: transcriptData.videoTitle,
          summary: 'Transcript was not available. Paste transcript notes or try another lecture with captions enabled.',
          keyPoints: ['Captions/transcript unavailable for this video.'],
          formulaList: [],
          suggestedWatchSegment: 'Open the video and manually note the example-solving segments.',
          practiceQuestions: ['Write 3 questions based on the lecture topic after watching.'],
          disclaimer: 'AI-generated explanations should be verified for high-stakes exam preparation.',
        }

    res.json({ ...transcriptData, analysis })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { analyzeYoutube }
