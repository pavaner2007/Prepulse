import { useEffect, useState } from 'react'
import { AlertTriangle, Loader2, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchMistakes } from '../api/mistakeService'
import EmptyState from '../components/EmptyState'

function MistakeMemory() {
  const [data, setData] = useState({ mistakes: [], typeCounts: {}, conceptCounts: {} })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMistakes().then(res => setData(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const topTypes = Object.entries(data.typeCounts || {}).sort((a, b) => b[1] - a[1])
  const topConcepts = Object.entries(data.conceptCounts || {}).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center"><AlertTriangle className="w-8 h-8" /></div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mistake Memory</h1>
            <p className="text-slate-500">Track repeated errors and convert weak patterns into high-retention practice.</p>
          </div>
        </div>
        <Link to="/quiz" className="hidden md:inline-flex items-center gap-2 px-5 py-3 bg-rose-600 text-white font-semibold rounded-2xl hover:bg-rose-700"><RotateCcw className="w-5 h-5" /> Retake Quiz</Link>
      </header>

      {loading ? <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary-600" /></div> : data.mistakes.length ? (
        <>
          <section className="grid md:grid-cols-2 gap-6">
            <Summary title="Repeated Mistake Types" items={topTypes} />
            <Summary title="Weak Concepts" items={topConcepts} />
          </section>

          <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Mistakes</h2>
            <div className="space-y-4">
              {data.mistakes.map(mistake => (
                <div key={mistake._id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{mistake.question}</p>
                      <p className="text-sm text-slate-500 mt-1">{mistake.subject} • {mistake.chapter} • {mistake.concept}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">{mistake.mistakeType}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 mt-4 text-sm">
                    <p><b>Your answer:</b> {mistake.studentAnswer || 'Not answered'}</p>
                    <p><b>Correct answer:</b> {mistake.correctAnswer}</p>
                  </div>
                  <p className="text-sm text-slate-600 mt-3"><b>Explanation:</b> {mistake.explanation}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <EmptyState title="No mistakes yet" description="Take your first quiz to start building your Mistake Memory." action={<Link to="/quiz" className="inline-flex px-5 py-3 bg-primary-600 text-white font-semibold rounded-2xl">Start Adaptive Quiz</Link>} />
      )}
    </div>
  )
}

function Summary({ title, items }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
      <h2 className="text-xl font-bold text-slate-900 mb-4">{title}</h2>
      {items.length ? <div className="space-y-3">{items.map(([name, count]) => <div key={name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50"><span className="font-medium text-slate-800">{name}</span><span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">{count}</span></div>)}</div> : <p className="text-slate-500">No data yet.</p>}
    </div>
  )
}

export default MistakeMemory
