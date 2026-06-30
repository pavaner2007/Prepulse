# PrepPulse AI V3 — Winning Strategy Upgrade

This upgrade adds a real syllabus intelligence layer so PrepPulse AI behaves like a strategic JEE/NEET preparation GPS instead of a generic quiz/chatbot app.

## Added

- `study-mate-backend/data/syllabusIntelligence.js`
  - Chapter trend weightage
  - PYQ frequency score
  - NCERT priority score
  - Expected marks estimate
  - Revision cycle days
  - Common mistake patterns
  - Micro-topic focus areas
  - Personalized action score

- New backend endpoints:
  - `GET /api/syllabus/intelligence`
  - `GET /api/syllabus/intelligence?examType=JEE&subject=Physics`
  - `GET /api/syllabus/intelligence?examType=NEET&subject=Biology&chapter=Human Physiology`
  - `GET /api/syllabus/priority-map`

- Strategy engine now uses:
  - Syllabus priority
  - Student mastery gap
  - Quiz accuracy
  - Mistake logs
  - Revision due gap
  - Weak subject boost
  - Target exam pressure
  - Uploaded resource coverage

- New frontend page:
  - `Syllabus Strategy` / `/syllabus-strategy`

- Dashboard now displays:
  - High-yield chapter cards
  - Weightage / PYQ / NCERT priority indicators

- Study Plan now displays:
  - Action-score based daily tasks
  - 7-day adaptive strategy preview

- Progress Analytics now displays:
  - Priority bands
  - PYQ frequency
  - NCERT priority
  - Recommended action per chapter

## Important caveat

Official exam bodies publish syllabi, but not fixed chapter-wise weightage. Therefore, the app clearly treats weightage/PYQ values as trend-based strategy estimates, not official guarantees.
