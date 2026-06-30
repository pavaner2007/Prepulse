const mongoose = require('mongoose')

const documentChunkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    document: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true, index: true },
    fileName: { type: String, required: true },
    subject: { type: String, default: '' },
    chapter: { type: String, default: '' },
    content: { type: String, required: true },
    chunkIndex: { type: Number, default: 0 },
    embedding: [{ type: Number }],
  },
  { timestamps: true }
)

documentChunkSchema.index({ content: 'text', subject: 'text', chapter: 'text', fileName: 'text' })

module.exports = mongoose.model('DocumentChunk', documentChunkSchema)
