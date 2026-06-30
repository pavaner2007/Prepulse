const STOP_WORDS = new Set(['the','a','an','and','or','is','are','was','were','to','of','in','on','for','with','by','from','as','at','it','this','that','these','those','be','been','can','will','would','should','could','about','into','your','you'])

const normalize = (text = '') => text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

const tokenize = (text = '') => normalize(text)
  .split(' ')
  .filter(token => token.length > 2 && !STOP_WORDS.has(token))

const chunkText = (text = '', options = {}) => {
  const chunkSize = options.chunkSize || 900
  const overlap = options.overlap || 120
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return []

  const chunks = []
  let start = 0
  while (start < clean.length) {
    const end = Math.min(start + chunkSize, clean.length)
    const content = clean.slice(start, end).trim()
    if (content.length > 40) chunks.push({ content, index: chunks.length })
    if (end >= clean.length) break
    start = Math.max(0, end - overlap)
  }
  return chunks
}

const keywordScore = (query = '', content = '') => {
  const queryTokens = tokenize(query)
  if (!queryTokens.length) return 0
  const contentTokens = tokenize(content)
  const freq = contentTokens.reduce((acc, token) => {
    acc[token] = (acc[token] || 0) + 1
    return acc
  }, {})
  return queryTokens.reduce((score, token) => score + (freq[token] || 0), 0) / queryTokens.length
}

module.exports = { chunkText, keywordScore, tokenize }
