const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: [
        'Physics',
        'Chemistry',
        'Mathematics',
        'Biology',
        'Botany',
        'Zoology',
        'General',
        'Computer Science',
        'Engineering',
        'Business',
        'Economics',
        'Literature',
        'History',
      ],
    },
    chapter: {
      type: String,
      trim: true,
      default: '',
    },
    sourceType: {
      type: String,
      enum: ['Notes', 'PYQ', 'Mock Test', 'Worksheet', 'Question Image'],
      default: 'Notes',
    },
    tags: [{ type: String, trim: true }],
    description: {
      type: String,
      trim: true,
      default: '',
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      uppercase: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
    college: {
      type: String,
      default: '',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

noteSchema.index({ title: 'text', description: 'text', subject: 'text', chapter: 'text', extractedText: 'text' })

module.exports = mongoose.model('Note', noteSchema)
