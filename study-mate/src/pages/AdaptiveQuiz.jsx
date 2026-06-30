import { useEffect, useMemo, useState } from 'react'
import { CheckCircle, ClipboardList, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { fetchQuizHistory, generateQuiz, submitQuiz } from '../api/quizService'
import { getChapters, getSubjects } from '../data/syllabusData'

function AdaptiveQuiz() {
  const [form, setForm] = useState({ examType: 'JEE', subject: 'Physics', chapter: 'Electrostatics', difficulty: 'Medium', numberOfQuestions: 5 })
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [review, setReview] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [startTime, setStartTime] = useState(null)

  useEffect(() => { fetchQuizHistory().then(res => setHistory(res.data)).catch(() => {}) }, [])

  const subjectOptions = useMemo(() => getSubjects(form.examType), [form.examType])
  const chapterOptions = useMemo(() => getChapters(form.examType, form.subject), [form.examType, form.subject])

  const updateExam = (examType) => {
    const subjects = getSubjects(examType)
    const subject = subjects[0]
    const chapter = getChapters(examType, subject)[0]
    setForm({ ...form, examType, subject, chapter })
  }

  const updateSubject = (subject) => {
    const chapter = getChapters(form.examType, subject)[0]
    setForm({ ...form, subject, chapter })
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setReview(null)
    setAnswers({})
    try {
      const res = await generateQuiz(form)
      if (!res.data?.questions?.length) throw new Error('No questions returned')
      setQuiz(res.data)
      setStartTime(Date.now())
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Could not generate quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!quiz?.questions?.length) return
    setSubmitting(true)
    try {
      const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
      const res = await submitQuiz({ ...form, questions: quiz.questions, answers, timeTaken })
      setReview(res.data)
      fetchQuizHistory().then(r => setHistory(r.data)).catch(() => {})
    } catch (error) {
      alert(error.response?.data?.message || 'Could not submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><ClipboardList className="w-8 h-8" /></div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Adaptive Quiz Generator</h1>
          <p className="text-slate-500">Real JEE/NEET syllabus chapters + question bank fallback + deployable open-weight AI provider support.</p>
        </div>
      </header>

      <form onSubmit={handleGenerate} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card grid md:grid-cols-6 gap-4 items-end">
        <Select label="Exam" value={form.examType} onChange={updateExam} options={['JEE', 'NEET']} />
        <Select label="Subject" value={form.subject} onChange={updateSubject} options={subjectOptions} />
        <Select label="Official Chapter" value={form.chapter} onChange={v => setForm({ ...form, chapter: v })} options={chapterOptions} wide />
        <Select label="Difficulty" value={form.difficulty} onChange={v => setForm({ ...form, difficulty: v })} options={['Easy', 'Medium', 'Hard']} />
        <Field label="Questions"><input type="number" min="1" max="15" className="input-field" value={form.numberOfQuestions} onChange={e => setForm({ ...form, numberOfQuestions: e.target.value })} /></Field>
        <button disabled={loading} className="px-4 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-60">{loading ? 'Generating...' : 'Generate'}</button>
      </form>

      <div className="bg-cyan-50 border border-cyan-100 rounded-3xl p-4 text-sm text-cyan-900">
        Quiz generation first tries your configured deployable AI provider, then falls back to the built-in syllabus-backed JEE/NEET question bank, so the demo never breaks.
      </div>

      {quiz?.questions?.length && !review && (
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Quiz: {form.subject} • {form.chapter}</h2>
            <span className="text-sm text-slate-500">Source: {quiz.usedModel}</span>
          </div>
          {quiz.questions.map((q, index) => (
            <div key={q.id || index} className="p-5 rounded-2xl border border-slate-100 bg-slate-50">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">{q.conceptTag}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-700">{q.difficulty}</span>
              </div>
              <p className="font-semibold text-slate-900 mb-4">{index + 1}. {q.question}</p>
              <div className="grid md:grid-cols-2 gap-3">
                {(Array.isArray(q.options) ? q.options : []).map(option => (
                  <label key={option} className={`p-3 rounded-xl border cursor-pointer transition-colors ${answers[q.id] === option ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                    <input type="radio" name={q.id} value={option} checked={answers[q.id] === option} onChange={() => setAnswers({ ...answers, [q.id]: option })} className="mr-2" />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit} disabled={submitting} className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-colors disabled:opacity-60">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />} Submit Quiz
          </button>
        </section>
      )}

      {review && (
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
          <div className="grid md:grid-cols-3 gap-4">
            <ScoreCard label="Score" value={`${review.score}/${review.total}`} />
            <ScoreCard label="Accuracy" value={`${review.accuracy}%`} />
            <ScoreCard label="Mistakes Logged" value={review.mistakes?.length || 0} />
          </div>
          <div className="space-y-4">
            {review.review?.map((q, index) => (
              <div key={index} className={`p-5 rounded-2xl border ${q.isCorrect ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50'}`}>
                <div className="flex gap-3">
                  {q.isCorrect ? <CheckCircle className="text-emerald-600 flex-shrink-0" /> : <XCircle className="text-rose-600 flex-shrink-0" />}
                  <div>
                    <p className="font-semibold text-slate-900">{q.question}</p>
                    <p className="text-sm text-slate-600 mt-2">Your answer: {q.studentAnswer || 'Not answered'} | Correct: {q.correctAnswer}</p>
                    <p className="text-sm text-slate-600 mt-1">Explanation: {q.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setQuiz(null); setReview(null); setAnswers({}) }} className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-semibold rounded-2xl"><RefreshCw className="w-5 h-5" /> New Quiz</button>
        </section>
      )}

      <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Quiz History</h2>
        {history.length ? <div className="space-y-3">{history.slice(0, 5).map(h => <div key={h._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50"><span className="font-medium">{h.subject} • {h.chapter || 'General'}</span><span className="text-sm text-slate-500">{h.accuracy}% accuracy</span></div>)}</div> : <p className="text-slate-500">No quiz history yet. Generate your first adaptive quiz.</p>}
      </section>
    </div>
  )
}

function Field({ label, children, wide }) { return <label className={`block ${wide ? 'md:col-span-2' : 'md:col-span-1'}`}><span className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</span>{children}</label> }
function Select({ label, value, onChange, options, wide }) { return <Field label={label} wide={wide}><select className="input-field" value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select></Field> }
function ScoreCard({ label, value }) { return <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100"><p className="text-sm text-indigo-700">{label}</p><p className="text-3xl font-bold text-indigo-950">{value}</p></div> }

export default AdaptiveQuiz
