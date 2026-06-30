# PrepPulse AI — Backend API

Node.js + Express + MongoDB backend for **PrepPulse AI — Agentic Study GPS for JEE/NEET Aspirants**.

## Core stack

- Express.js API
- MongoDB + Mongoose
- JWT authentication
- Multer uploads
- PDF text extraction with `pdf-parse`
- YouTube transcript utility
- Ollama-compatible local LLM service with fallback MVP responses
- Simple RAG using document chunks and deterministic fallback embeddings

## Environment variables

Create `.env` from `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/preppulse_ai
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
EMBEDDING_MODEL=BAAI/bge-small-en-v1.5
```

## Run

```bash
npm install
npm run dev
```

## New API groups

- `POST /api/profile`, `GET /api/profile`
- `POST /api/resources/upload`, `GET /api/resources`
- `POST /api/doubt/ask`, `POST /api/doubt/image`
- `POST /api/youtube/analyze`
- `POST /api/quiz/generate`, `POST /api/quiz/submit`, `GET /api/quiz/history`
- `GET /api/mistakes`, `POST /api/mistakes`
- `GET /api/study-plan/today`, `POST /api/study-plan/generate`
- `GET /api/analytics/dashboard`, `GET /api/analytics/readiness`, `GET /api/analytics/mastery`

AI-generated explanations should be verified for high-stakes exam preparation.
