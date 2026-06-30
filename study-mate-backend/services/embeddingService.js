const axios = require('axios')

const OLLAMA_BASE_URL = () => process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const EMBEDDING_MODEL = () => process.env.EMBEDDING_MODEL || 'BAAI/bge-small-en-v1.5'

const hashEmbedding = (text = '', dimensions = 128) => {
  const vector = Array(dimensions).fill(0)
  const tokens = String(text).toLowerCase().match(/[a-z0-9]+/g) || []
  tokens.forEach((token) => {
    let hash = 0
    for (let i = 0; i < token.length; i += 1) hash = ((hash << 5) - hash + token.charCodeAt(i)) | 0
    const index = Math.abs(hash) % dimensions
    vector[index] += 1
  })
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1
  return vector.map(v => v / magnitude)
}

const cosineSimilarity = (a = [], b = []) => {
  if (!a.length || !b.length) return 0
  const len = Math.min(a.length, b.length)
  let dot = 0
  let magA = 0
  let magB = 0
  for (let i = 0; i < len; i += 1) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  if (!magA || !magB) return 0
  return dot / (Math.sqrt(magA) * Math.sqrt(magB))
}

const createEmbedding = async (text = '') => {
  const input = String(text || '').slice(0, 4000)
  try {
    const res = await axios.post(`${OLLAMA_BASE_URL()}/api/embeddings`, {
      model: EMBEDDING_MODEL(),
      prompt: input,
    }, { timeout: 12000 })
    if (Array.isArray(res.data?.embedding)) return res.data.embedding
  } catch (error) {
    // Local model may not be running during demos. Deterministic fallback keeps RAG working.
  }
  return hashEmbedding(input)
}

module.exports = { createEmbedding, cosineSimilarity, hashEmbedding }
