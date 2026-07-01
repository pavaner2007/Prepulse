import { useState } from 'react'
import { Brain, FileSearch, Image, Loader2, Send, ShieldCheck } from 'lucide-react'
import { askDoubt, extractQuestionImage } from '../api/doubtService'
import { getChapters, getSubjects } from '../data/syllabusData'

function AIDoubtSolver() {
  const [form, setForm] = useState({ examType: 'JEE', question: '', subject: 'Physics', chapter: 'Electrostatics' })
  const [imageLoading, setImageLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleImage = async (file) => {
    if (!file) return
    setImageLoading(true)
    setError('')
    try {
      const data = new FormData()
      data.append('image', file)
      data.append('questionText', form.question)
      const res = await extractQuestionImage(data)
      setForm(prev => ({ ...prev, question: res.data.extractedText || prev.question }))
      setError(res.data.warning)
    } catch (err) {
      setError(err.response?.data?.message || 'OCR failed. Please type the question manually.')
    } finally {
      setImageLoading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await askDoubt(form)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not solve this doubt right now.')
    } finally {
      setLoading(false)
    }
  }

  const answer = result?.answer
  const subjects = getSubjects(form.examType)
  const chapters = getChapters(form.examType, form.subject)
  const changeExam = (examType) => { const nextSubject = getSubjects(examType)[0]; setForm({ ...form, examType, subject: nextSubject, chapter: getChapters(examType, nextSubject)[0] }) }
  const changeSubject = (subject) => setForm({ ...form, subject, chapter: getChapters(form.examType, subject)[0] })

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center"><Brain className="w-8 h-8" /></div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Doubt Solver</h1>
            <p className="text-slate-500">Ask text doubts, upload question images, and get step-by-step JEE/NEET explanations grounded in your uploaded notes.</p>
          </div>
        </div>
      </header>

      <div className="grid xl:grid-cols-3 gap-6">
        <form onSubmit={submit} className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
          <div className="grid md:grid-cols-3 gap-4">
            <label className="block"><span className="block text-sm font-semibold text-slate-700 mb-1.5">Exam</span><select className="input-field" value={form.examType} onChange={e => changeExam(e.target.value)}>{['JEE', 'NEET'].map(s => <option key={s}>{s}</option>)}</select></label>
            <label className="block"><span className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</span><select className="input-field" value={form.subject} onChange={e => changeSubject(e.target.value)}>{subjects.map(s => <option key={s}>{s}</option>)}</select></label>
            <label className="block"><span className="block text-sm font-semibold text-slate-700 mb-1.5">Official Chapter</span><select className="input-field" value={form.chapter} onChange={e => setForm({ ...form, chapter: e.target.value })}>{chapters.map(c => <option key={c}>{c}</option>)}</select></label>
          </div>

          <label className="block">
            <span className="block text-sm font-semibold text-slate-700 mb-1.5">Question</span>
            <textarea className="input-field min-h-[180px] resize-y" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} placeholder="Paste or type your JEE/NEET question here..." required />
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 text-slate-700 font-semibold rounded-2xl cursor-pointer hover:bg-slate-200 transition-colors">
              {imageLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Image className="w-5 h-5" />} Upload Question Image
              <input type="file" accept="image/*" className="hidden" onChange={e => handleImage(e.target.files?.[0])} />
            </label>
            <button disabled={loading} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-600 text-white font-semibold rounded-2xl hover:bg-primary-700 transition-colors disabled:opacity-60">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} Solve Doubt
            </button>
          </div>

          {error && <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-sm text-amber-800">{error}</div>}
        </form>

        <aside className="bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-3xl p-6 border border-indigo-100">
          <ShieldCheck className="w-9 h-9 text-indigo-600 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-3">Safe AI flow</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>• Uses uploaded notes as source context when available.</li>
            <li>• Deployable open-weight AI via Groq/HuggingFace, with deterministic fallback if no API key is configured.</li>
            <li>• OCR never blocks solving; you can edit extracted text.</li>
            <li>• Avoids scraping protected educational platforms.</li>
          </ul>
        </aside>
      </div>

      {answer && (
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><FileSearch /></div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">PrepPulse Explanation</h2>
              <p className="text-sm text-slate-500">Model: {answer.usedModel || 'fallback-mvp'}</p>
            </div>
          </div>

          <Card title="Final Answer"><p>{answer.finalAnswer}</p></Card>
           <Card title="Step-by-Step Explanation">
            <ol className="list-decimal pl-5 space-y-2">
              {(Array.isArray(answer.stepByStep) ? answer.stepByStep : [answer.stepByStep].filter(Boolean)).map((step, i) => (
                <li key={i}>
                  {typeof step === 'object' && step !== null 
                    ? (step.text || step.step || step.description || JSON.stringify(step)) 
                    : String(step)}
                </li>
              ))}
            </ol>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Mini title="Concept Used" value={answer.conceptUsed} />
            <Mini title="Formula Used" value={answer.formulaUsed} />
            <Mini title="Common Mistake" value={answer.commonMistake} />
            <Mini title="Related Practice" value={answer.relatedPracticeQuestion} />
          </div>

          <Card title="Source / Context Used">
            {result.context?.length ? <ul className="space-y-2">{result.context.map((ctx, i) => <li key={i} className="text-sm text-slate-600">{i + 1}. {ctx.sourceTitle} — match score {ctx.score?.toFixed?.(2) || 'N/A'}</li>)}</ul> : <p className="text-slate-500">No uploaded-note context matched. Upload notes to enable stronger RAG answers.</p>}
          </Card>

          <p className="text-xs text-slate-500">{answer.disclaimer}</p>
        </section>
      )}
    </div>
  )
}

function Card({ title, children }) {
  return <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100"><h3 className="font-bold text-slate-900 mb-2">{title}</h3><div className="text-slate-700 leading-relaxed">{children}</div></div>
}

function Mini({ title, value }) {
  return <div className="p-4 rounded-2xl border border-slate-100 bg-white"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{title}</p><p className="text-sm font-medium text-slate-800">{value || 'Not specified'}</p></div>
}

export default AIDoubtSolver
