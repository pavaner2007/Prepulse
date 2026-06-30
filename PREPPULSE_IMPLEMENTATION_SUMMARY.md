# PrepPulse AI — Implementation Summary

The original the original app project has been transformed into **PrepPulse AI — Agentic Study GPS for JEE/NEET Aspirants** while preserving the existing React/Vite frontend, Express backend, MongoDB/Mongoose database style, JWT authentication, upload middleware, and routing patterns.

## What changed

### Rebranding
- Replaced visible the original app branding with PrepPulse AI.
- Updated login/landing experience, dashboard, sidebar, mobile nav, metadata, backend health message, package names, and README.
- Removed proprietary cloud LLM API usage from active backend code.

### AI model layer
- Added an Ollama-compatible AI service using:
  - `OLLAMA_BASE_URL=http://localhost:11434`
  - `OLLAMA_MODEL=qwen2.5:7b`
  - `EMBEDDING_MODEL=BAAI/bge-small-en-v1.5`
- Added clean fallback responses so the hackathon demo still works when Ollama is not running.

### New frontend pages
- Dashboard
- AI Doubt Solver
- Upload Resources
- YouTube Learning Companion
- Adaptive Quiz
- Mistake Memory
- Study Plan
- Progress Analytics
- Profile & Onboarding

### New backend models
- `StudentProfile`
- `DocumentChunk`
- `MistakeLog`
- `QuizAttempt`
- `StudentMastery`
- Enhanced `Note` with JEE/NEET resource metadata and extracted text.

### New backend service files
- `services/aiService.js`
- `services/documentProcessor.js`
- `services/chunkingService.js`
- `services/embeddingService.js`
- `services/ragService.js`

### New API groups
- `GET/POST /api/profile`
- `GET /api/resources`
- `POST /api/resources/upload`
- `POST /api/doubt/ask`
- `POST /api/doubt/image`
- `POST /api/youtube/analyze`
- `POST /api/quiz/generate`
- `POST /api/quiz/submit`
- `GET /api/quiz/history`
- `GET/POST /api/mistakes`
- `GET /api/study-plan/today`
- `POST /api/study-plan/generate`
- `GET /api/analytics/dashboard`
- `GET /api/analytics/readiness`
- `GET /api/analytics/mastery`

## Run commands

### Backend
```bash
cd study-mate-backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd study-mate
cp .env.example .env
npm install
npm run dev
```

## Optional local AI setup
```bash
ollama pull qwen2.5:7b
ollama serve
```

For embeddings, use an Ollama-supported embedding model available in your setup. If embeddings or Ollama are unavailable, the app falls back to deterministic keyword/hash retrieval so the MVP remains stable.

## Demo flow supported
1. Register/login.
2. Complete JEE/NEET profile in Profile.
3. View AI Study GPS dashboard.
4. Upload PDF/TXT resource with subject/chapter metadata.
5. Ask a doubt using uploaded-note RAG context.
6. Paste YouTube link for transcript-based study companion.
7. Generate and submit adaptive quiz.
8. Wrong answers are stored in Mistake Memory.
9. Progress Analytics and Today’s Battle Plan update from quiz/mistake data.

## Known limitations
- OCR is implemented as a safe MVP fallback. Image upload works and returns an editable warning, but full OCR needs Tesseract.js/pytesseract integration.
- PDF/TXT extraction is supported. DOCX/PPT uploads are stored as metadata, with extraction left modular for future implementation.
- YouTube transcript depends on captions availability and network access. The UI returns a clean fallback if captions are blocked/unavailable.
- The app does not scrape protected sites such as Doubtnut, Brainly, or Toppr.

## Validation performed
- Frontend production build completed successfully with `npm run build`.
- Backend JavaScript syntax checks passed with `node --check`.
- New backend routes/controllers/services were required successfully without import errors.
