# 🖥️ PrepPulse AI — Backend Engine

The Node.js + Express + MongoDB backend powering **PrepPulse AI — Agentic Study GPS for JEE/NEET Aspirants**.

---

## 🛠️ Tech Stack & Dependencies

*   **Runtime & Framework**: Node.js, Express.js
*   **Database & ODM**: MongoDB, Mongoose
*   **Authentication**: JSON Web Tokens (JWT) & bcryptjs
*   **File Ingestion**: Multer (upload middleware), `pdf-parse` (PDF text extraction)
*   **AI Integration**: axios-based API wrappers for Groq, HuggingFace, Ollama, and a robust offline fallback system.

---

## 📂 Core Folder Structure

```text
study-mate-backend/
├── config/
│   ├── db.js                   # Mongoose MongoDB connection
│   └── passport.js             # Optional auth middlewares / helper config
├── controllers/                # Request Handlers
│   ├── authController.js       # Register, Login, Current User
│   ├── doubtController.js      # Doubt asking & OCR image mock routes
│   ├── quizController.js       # Generate quiz, Submit quiz
│   ├── resourceController.js   # Notes upload, list resources
│   ├── strategyController.js   # Study plan, analytics dashboard
│   └── syllabusController.js   # Chapter dropdown lists, priority mapping
├── data/                       # Built-in mock data repositories
│   ├── questionBank.js         # Curated JEE/NEET question banks for fallback quiz generation
│   ├── syllabusData.js         # Official subject/chapter lists for JEE & NEET
│   └── syllabusIntelligence.js # High-yield chapters, trend weightage, PYQ frequency
├── middleware/                 # Request validation and Authentication check
│   ├── auth.js                 # JWT Verification middleware
│   └── upload.js               # Multer file upload setup
├── models/                     # Mongoose Schema Definitions
│   ├── User.js                 # Login credential record
│   ├── StudentProfile.js       # Exam type, target score, study hours, subjects
│   ├── Note.js / Resource      # Uploaded notes, file path, metadata, text content
│   ├── MistakeLog.js           # Student incorrect MCQ logs
│   ├── QuizAttempt.js          # Attempt score, timing, accuracy logs
│   └── StudentMastery.js       # Subject-chapter mastery level percentages
├── routes/                     # Express Router Mountings
├── services/                   # Application Business Logic
│   ├── aiService.js            # LLM abstraction (Groq, HF, Ollama, Fallback)
│   ├── strategyEngine.js       # Readiness score, battle plan scheduling
│   ├── ragService.js           # Query matching for uploaded documents
│   ├── chunkingService.js      # Text segmenting logic
│   └── embeddingService.js     # Text vector/hash mapping helper
└── server.js                   # Entry point
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the `study-mate-backend/` root directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/preppulse_ai
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

# AI Provider Configuration: fallback, groq, huggingface, or ollama
# 'fallback' requires no keys and outputs high-quality deterministic responses
AI_PROVIDER=fallback

# Cloud Provider Keys (Optional)
GROQ_API_KEY=your-groq-key
GROQ_MODEL=llama-3.1-8b-instant

HF_API_TOKEN=your-hf-token
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.3

# Local Ollama (Optional)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
EMBEDDING_MODEL=BAAI/bge-small-en-v1.5
```

---

## 🚀 Installation & Running

```bash
# Install Node dependencies
npm install

# Start the Express server in development mode (using nodemon)
npm run dev
```

*   The API server will run at: **`http://localhost:5000`**
*   Base URL for API routes: **`http://localhost:5000/api`**

---

## 📡 API Endpoint Directory

### Authentication
*   `POST /api/auth/register` — Register a student account
*   `POST /api/auth/login` — Authenticate and receive JWT
*   `GET /api/auth/me` — Retrieve active profile status

### Syllabus & Trends
*   `GET /api/syllabus` — List all subjects
*   `GET /api/syllabus/chapters` — Get chapters for a subject (e.g., `?examType=JEE&subject=Physics`)
*   `GET /api/syllabus/intelligence` — Get trend weights and PYQ frequencies for a chapter
*   `GET /api/syllabus/priority-map` — Fetch priority-sorted chapters for the dashboard

### Doubt Solver & RAG
*   `POST /api/resources/upload` — Ingest a PDF/TXT note, chunk it, and save to MongoDB
*   `GET /api/resources` — List all uploaded study materials
*   `POST /api/doubt/ask` — Submit a question; queries document chunks and generates RAG answers

### YouTube Companion
*   `POST /api/youtube/analyze` — Extract transcripts from a YouTube URL and summarize concepts

### Adaptive Quiz
*   `POST /api/quiz/generate` — Generate a syllabus-backed MCQ quiz
*   `POST /api/quiz/submit` — Submit options, calculate accuracy, and trigger mistake logging
*   `GET /api/quiz/history` — Get historical performance scores

### Mistakes Memory
*   `GET /api/mistakes` — List all categorized student mistakes
*   `POST /api/mistakes` — Log a mistake manually

### Study GPS & Analytics
*   `GET /api/study-plan/today` — Retrieve daily tasks based on strategy weightings
*   `GET /api/analytics/dashboard` — Fetch readiness scoring and mastery maps
