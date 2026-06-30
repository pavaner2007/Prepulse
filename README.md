# PrepPulse AI — Agentic Study GPS for JEE/NEET Aspirants

PrepPulse AI transforms JEE/NEET preparation from random hard work into personalized, data-driven smart work.

It helps students decide:
- What to study today
- What to revise
- Which chapters are weak
- Which mistakes repeat
- Which questions to practice
- How exam-ready they are

## Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Multer uploads
- PDF/text extraction
- Syllabus-backed quiz/strategy engine

## AI architecture

V2 is deployable without local models.

Supported providers:
- `AI_PROVIDER=groq` using open-weight Llama models hosted on Groq
- `AI_PROVIDER=huggingface` using open-weight models on HuggingFace Inference API
- `AI_PROVIDER=fallback` for deterministic demo-safe output
- `AI_PROVIDER=ollama` optional local development only

## Backend setup

```bash
cd study-mate-backend
cp .env.example .env
npm install
npm run dev
```

Backend runs on:

```txt
http://localhost:5000/api
```

## Frontend setup

```bash
cd study-mate
cp .env.example .env
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Important backend env

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/preppulse_ai
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
AI_PROVIDER=fallback
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-8b-instant
HF_API_TOKEN=
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

## Demo flow

1. Register/login.
2. Complete JEE/NEET profile.
3. Open dashboard and view readiness + battle plan.
4. Upload a notes PDF/TXT.
5. Ask a doubt.
6. Generate an adaptive quiz using real syllabus dropdowns.
7. Submit quiz.
8. Wrong answers get stored in Mistake Memory.
9. Study Plan updates weak focus and revision strategy.

## New V2 APIs

```txt
GET /api/syllabus
GET /api/syllabus/chapters
GET /api/syllabus/chapter
POST /api/quiz/generate
POST /api/quiz/submit
GET /api/study-plan/today
GET /api/analytics/dashboard
```

## Safety note

AI-generated explanations should be verified for high-stakes exam preparation. PrepPulse avoids scraping protected educational platforms and uses uploaded notes, syllabus data, and configured open-weight AI providers.
