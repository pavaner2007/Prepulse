# PrepPulse AI V2 — Hackathon Upgrade Summary

## Core problem fixed
The previous build had generic quiz fallback questions, no official chapter map, and a local-only Qwen/Ollama assumption. V2 adds a deployable syllabus-backed strategy engine, real JEE/NEET chapter dropdowns, question-bank fallback, and open-weight cloud AI provider support.

## New product positioning
**PrepPulse AI is an Agentic Study GPS for JEE/NEET aspirants.** It dynamically recommends what to study today using:
- Student profile
- Target exam date
- Official syllabus map
- Quiz accuracy
- Mistake logs
- Chapter mastery
- Uploaded resource/RAG context
- Revision due signals

## Backend upgrades

### Added data layer
- `study-mate-backend/data/syllabusData.js`
  - JEE Main subjects and chapters
  - NEET subjects and chapters
  - Chapter metadata, concepts, weight hints, strategy hints
  - Official source metadata
- `study-mate-backend/data/questionBank.js`
  - Syllabus-backed JEE/NEET MCQ bank
  - Deterministic fallback question generation
  - No more broken/generic “Option A only” quiz flow

### Added strategy engine
- `study-mate-backend/services/strategyEngine.js`
  - Readiness scoring
  - Syllabus coverage calculation
  - Weak area detection
  - Revision due logic
  - Today’s Battle Plan generation

### Reworked AI service
- `study-mate-backend/services/aiService.js`
  - Removed Qwen as default
  - Supports deployable open-weight providers:
    - Groq: Llama 3.1 8B / Llama 3.3 70B style models
    - HuggingFace Inference API: Mistral-style open models
    - Optional Ollama only for local development
  - Deterministic fallback if no key is configured
  - Quiz generation now never breaks during demo

### Added syllabus API
- `GET /api/syllabus`
- `GET /api/syllabus/chapters?examType=JEE&subject=Physics`
- `GET /api/syllabus/chapter?subject=Physics&chapter=Electrostatics`

### Improved analytics/study plan
- Dashboard analytics now uses real strategy logic
- Study plan returns:
  - Study stage
  - Days left
  - Weak focus chapters
  - Syllabus coverage
  - Reasoned daily tasks

## Frontend upgrades

### Adaptive Quiz
- Replaced free-text chapter input with real official chapter dropdown
- Exam → Subject → Chapter cascades correctly
- Quiz generation works even without AI API key
- Shows source/model used
- Supports up to 15 questions

### AI Doubt Solver
- Added exam selector
- Subject and chapter are now syllabus-backed dropdowns
- Sidebar no longer says Ollama-first
- Supports deployable AI provider + fallback messaging

### Upload Resources
- Added exam selector
- Subject/chapter dropdowns from syllabus data
- Uploaded resources align with strategy/RAG chapter metadata

### Profile
- Strong/weak subjects now depend on JEE vs NEET
- JEE shows Physics/Chemistry/Mathematics
- NEET shows Physics/Chemistry/Biology

## Environment variables
Backend `.env.example` now supports:

```env
AI_PROVIDER=fallback
# AI_PROVIDER=groq
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-8b-instant
# AI_PROVIDER=huggingface
HF_API_TOKEN=
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

Ollama is optional only:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

## Recommended hackathon deployment
For simplest demo deployment:

```env
AI_PROVIDER=groq
GROQ_API_KEY=your_key
GROQ_MODEL=llama-3.1-8b-instant
```

Fallback mode also works:

```env
AI_PROVIDER=fallback
```

## Validation
- Backend JavaScript syntax check passed.
- Frontend production build passed after clean npm install.
- Quiz service tested with JEE Physics Electrostatics and returns real questions.
- Strategy engine tested with NEET profile and returns 4 daily tasks.

## Known limitations
- The bundled syllabus is an app-ready chapter map based on official JEE/NEET 2026 sources, but students should verify final topic wording from official PDFs before high-stakes use.
- Full semantic embeddings are still MVP-level; current RAG can be upgraded to Qdrant/Chroma/pgvector.
- The built-in question bank is good for demo reliability; a production product should expand it with licensed PYQs and NCERT-derived questions.
- OCR remains safe fallback/manual-edit flow.

## Future winning upgrades
1. Add official PDF ingestion pipeline for yearly syllabus refresh.
2. Add Qdrant/pgvector semantic retrieval.
3. Add licensed PYQ bank + mock-test report parser.
4. Add spaced repetition scheduler per chapter.
5. Add mentor/parent weekly WhatsApp/email reports.
6. Add rank/score projection from mock tests.
