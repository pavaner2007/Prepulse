import { useEffect, useState } from 'react'
import { BarChart3, Loader2, TrendingUp } from 'lucide-react'
import { fetchMastery, fetchReadiness } from '../api/analyticsService'
import ProgressBar from '../components/ProgressBar'

function ProgressAnalytics() {
  const [readiness, setReadiness] = useState(null)
  const [mastery, setMastery] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchReadiness(), fetchMastery()])
      .then(([r, m]) => { setReadiness(r.data); setMastery(m.data) })
      .catch(() => {
        setReadiness({ overall: 68, subjectReadiness: [{ subject: 'Physics', score: 52 }, { subject: 'Chemistry', score: 74 }, { subject: 'Mathematics', score: 63 }], riskAreas: [], recommendedAction: 'Practice 20 Electrostatics questions this week.' })
        setMastery([{ subject: 'Physics', chapter: 'Electrostatics', concept: 'Electric field', masteryScore: 45, accuracy: 52, revisionDue: true }])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary-600" /></div>

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><BarChart3 className="w-8 h-8" /></div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Progress Analytics</h1>
          <p className="text-slate-500">Readiness score, subject risk, weak heatmap, revision alerts, and high-yield syllabus strategy.</p>
        </div>
      </header>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-600 to-indigo-600 rounded-3xl p-6 text-white shadow-soft">
          <p className="text-primary-100">Overall Readiness</p>
          <div className="text-7xl font-black mt-3">{readiness.overall}</div>
          <p className="text-primary-50">out of 100</p>
          <p className="mt-6 text-sm bg-white/15 rounded-2xl p-4">Recommended Action: {readiness.recommendedAction}</p>
        </div>
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
          <h2 className="text-xl font-bold text-slate-900 mb-5">Subject-wise Readiness</h2>
          <div className="space-y-5">
            {readiness.subjectReadiness?.map(item => <ProgressBar key={item.subject} label={item.subject} value={item.score} />)}
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-slate-900">Weak Concept Heatmap</h2>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mastery.map((item, index) => (
            <div key={item._id || index} className="p-5 rounded-2xl border border-slate-100 bg-slate-50">
              <div className="flex justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-slate-900">{item.chapter || item.concept}</h3>
                  <p className="text-sm text-slate-500">{item.subject} • {item.concept}</p>
                </div>
                {item.priorityBand && <span className="h-fit px-2 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">{item.priorityBand}</span>}
                {item.revisionDue && <span className="h-fit px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Revision due</span>}
              </div>
              <ProgressBar value={item.masteryScore || item.accuracy} />
              <p className="text-xs text-slate-500 mt-3">Priority {item.priorityScore || 50}/100 • PYQ {item.pyqFrequency || 6}/10 • NCERT {item.ncertPriority || 6}/10</p>
              {item.recommendedAction && <p className="text-sm text-slate-600 mt-2">{item.recommendedAction}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProgressAnalytics
