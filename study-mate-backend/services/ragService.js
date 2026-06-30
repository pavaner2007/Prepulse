const DocumentChunk = require('../models/DocumentChunk')
const { createEmbedding, cosineSimilarity } = require('./embeddingService')
const { keywordScore } = require('./chunkingService')

const storeDocumentChunks = async ({ userId, documentId, fileName, subject, chapter, chunks }) => {
  if (!chunks?.length) return []
  await DocumentChunk.deleteMany({ document: documentId })
  const docs = []
  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk.content)
    docs.push({ user: userId, document: documentId, fileName, subject, chapter, content: chunk.content, chunkIndex: chunk.index, embedding })
  }
  return DocumentChunk.insertMany(docs)
}

const retrieveRelevantChunks = async ({ userId, query, subject, chapter, documentId, limit = 4 }) => {
  const filter = { user: userId }
  if (documentId) {
    filter.document = documentId
  } else {
    if (subject) filter.subject = subject
    if (chapter) filter.chapter = new RegExp(chapter, 'i')
  }

  const chunks = await DocumentChunk.find(filter).sort({ updatedAt: -1 }).limit(120)
  if (!chunks.length) return []

  const queryEmbedding = await createEmbedding(query)
  const scored = chunks.map(chunk => ({
    id: chunk._id,
    fileName: chunk.fileName,
    sourceTitle: `${chunk.fileName}${chunk.chapter ? ` • ${chunk.chapter}` : ''}`,
    subject: chunk.subject,
    chapter: chunk.chapter,
    content: chunk.content,
    score: cosineSimilarity(queryEmbedding, chunk.embedding || []) + keywordScore(query, chunk.content),
  }))

  return scored.sort((a, b) => b.score - a.score).slice(0, limit)
}

module.exports = { storeDocumentChunks, retrieveRelevantChunks }
