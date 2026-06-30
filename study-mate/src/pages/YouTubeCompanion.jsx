import { useState } from 'react'
import { Loader2, PlayCircle, Youtube } from 'lucide-react'
import { analyzeYoutube } from '../api/youtubeService'

function YouTubeCompanion() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await analyzeYoutube({ url })
      setResult(res.data)
      if (res.data.transcriptWarning) setError(res.data.transcriptWarning)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not analyze this YouTube link.')
    } finally {
      setLoading(false)
    }
  }

  const analysis = result?.analysis

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center"><Youtube className="w-8 h-8" /></div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">YouTube Learning Companion</h1>
            <p className="text-slate-500">Paste a lecture link to generate short notes, key concepts, formula list, and practice questions.</p>
          </div>
        </div>
      </header>

      <form onSubmit={submit} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col md:flex-row gap-3">
        <input className="input-field flex-1" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
        <button disabled={loading} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-60">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />} Analyze Lecture
        </button>
      </form>

      {error && <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-sm text-amber-800">{error}</div>}

      {analysis && (
        <section className="grid xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
            <div>
              <p className="text-sm font-semibold text-red-600">Video Title</p>
              <h2 className="text-2xl font-bold text-slate-900">{analysis.videoTitle || result.videoTitle}</h2>
            </div>
            <Block title="Summary"><p>{analysis.summary}</p></Block>
            <Block title="Key Concepts"><List items={analysis.keyPoints} /></Block>
            <Block title="Formula List"><List items={analysis.formulaList} empty="No formulas detected in this transcript." /></Block>
          </div>

          <aside className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-6 border border-red-100 space-y-5">
            <Block title="Suggested Watch Segment"><p>{analysis.suggestedWatchSegment}</p></Block>
            <Block title="Practice Questions"><List items={analysis.practiceQuestions} /></Block>
            <p className="text-xs text-slate-500">{analysis.disclaimer}</p>
          </aside>
        </section>
      )}
    </div>
  )
}

function Block({ title, children }) {
  return <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100"><h3 className="font-bold text-slate-900 mb-2">{title}</h3><div className="text-slate-700 text-sm leading-relaxed">{children}</div></div>
}

function List({ items = [], empty = 'No items available.' }) {
  const list = Array.isArray(items) ? items : String(items || '').split('\n').filter(Boolean)
  return list.length ? <ul className="space-y-2">{list.map((item, index) => <li key={index}>• {item}</li>)}</ul> : <p className="text-slate-500">{empty}</p>
}

export default YouTubeCompanion
