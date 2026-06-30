import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, BarChart3, BookOpenCheck, BrainCircuit, CalendarDays, Loader2, RefreshCw, Target, Trophy } from 'lucide-react'
import { fetchPersonalizedPriorityMap, fetchSyllabusIntelligence } from '../api/syllabusService'
import { getSubjects } from '../data/syllabusData'
import ProgressBar from '../components/ProgressBar'

function SyllabusStrategy() {
  const [examType, setExamType] = useState('JEE')
  const [subject, setSubject] = useState('')
  const [intelligence, setIntelligence] = useState(null)
  const [priorityMap, setPriorityMap] = useState(null)
  const [loading, setLoading] = useState(true)

  const subjects = useMemo(() => getSubjects(examType), [examType])

  const load = async () => {
    setLoading(true)
    try {
      const [intelRes, priorityRes] = await Promise.all([
        fetchSyllabusIntelligence(examType, subject),
        fetchPersonalizedPriorityMap(),
      ])
      setIntelligence(intelRes.data)
      setPriorityMap(priorityRes.data)
    } catch (error) {
      console.error(error)
      setPriorityMap(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [examType, subject])

  const chapterRows = subject
    ? intelligence?.chapters || []
    : Object.values(intelligence?.subjects || {}).flat().sort((a, b) => b.priorityScore - a.priorityScore)

  const topPriority = priorityMap?.topPriority?.length ? priorityMap.topPriority : chapterRows.slice(0, 8)

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-primary-600 to-cyan-500 rounded-3xl p-6 lg:p-8 text-white shadow-soft">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-sm mb-4"><BrainCircuit size={16} /> Winning Strategy Layer</div>
            <h1 className="text-3xl lg:text-4xl font-black">Syllabus Intelligence GPS</h1>
            <p className="text-primary-50 max-w-3xl mt-2">Prioritizes chapters using trend weightage, PYQ frequency, NCERT priority, your weak areas, mistakes, revision gap, and target exam pressure.</p>
          </div>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-primary-700 font-semibold rounded-2xl hover:bg-primary-50"><RefreshCw className="w-5 h-5" /> Refresh Strategy</button>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <Control label="Exam">
          <select className="input-field" value={examType} onChange={e => { setExamType(e.target.value); setSubject('') }}>
            <option>JEE</option><option>NEET</option>
          </select>
        </Control>
        <Control label="Subject">
          <select className="input-field" value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="">All subjects</option>
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </Control>
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card">
          <p className="text-sm text-slate-500">Weighted Coverage</p>
          <p className="text-3xl font-black text-slate-900">{priorityMap?.weightedCoveragePercent ?? 0}%</p>
          <p className="text-xs text-slate-500 mt-1">Coverage weighted by chapter importance, not just chapter count.</p>
        </div>
      </section>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" /></div> : (
        <>
          <section className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
              <div className="flex items-center gap-2 mb-5"><Trophy className="w-6 h-6 text-amber-500" /><h2 className="text-xl font-bold text-slate-900">Attack-First Priority Map</h2></div>
              <div className="grid md:grid-cols-2 gap-4">
                {topPriority.slice(0, 8).map((item, index) => <ChapterCard key={`${item.subject}-${item.chapter}-${index}`} item={item} index={index} />)}
              </div>
            </div>
            <aside className="space-y-4">
              <InfoCard icon={Target} title="Strategy Formula" text={priorityMap?.priorityFormula || 'Action Score = syllabus priority + mastery gap + mistakes + revision gap + weak-subject boost.'} />
              <InfoCard icon={BookOpenCheck} title="NCERT Priority" text={intelligence?.sourceNotes?.ncertMeaning || 'NCERT priority shows how much direct theory/line-by-line recall matters for the chapter.'} />
              <InfoCard icon={AlertCircle} title="Important Caveat" text={intelligence?.sourceNotes?.trendBasis || 'Weightage is trend-based. Official bodies publish syllabus, not fixed chapter-wise weightage.'} />
            </aside>
          </section>

          <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
            <div className="flex items-center gap-2 mb-5"><BarChart3 className="w-6 h-6 text-primary-600" /><h2 className="text-xl font-bold text-slate-900">Full Chapter Intelligence</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-slate-500 border-b"><th className="py-3 pr-4">Chapter</th><th className="py-3 pr-4">Subject</th><th className="py-3 pr-4">Priority</th><th className="py-3 pr-4">Trend Weight</th><th className="py-3 pr-4">PYQ</th><th className="py-3 pr-4">NCERT</th><th className="py-3 pr-4">Action</th></tr></thead>
                <tbody>
                  {chapterRows.map((item) => (
                    <tr key={`${item.subject}-${item.chapter}`} className="border-b border-slate-100 align-top">
                      <td className="py-4 pr-4 font-semibold text-slate-900 min-w-[220px]">{item.chapter}<p className="text-xs text-slate-500 font-normal mt-1">{item.microTopics?.slice(0, 3).join(' • ')}</p></td>
                      <td className="py-4 pr-4 text-slate-600">{item.subject}</td>
                      <td className="py-4 pr-4 min-w-[160px]"><ProgressBar compact value={item.priorityScore} /><p className="text-xs text-slate-500 mt-1">{item.priorityBand}</p></td>
                      <td className="py-4 pr-4 text-slate-700">{item.weightagePercent}%</td>
                      <td className="py-4 pr-4 text-slate-700">{item.pyqFrequency}/10</td>
                      <td className="py-4 pr-4 text-slate-700">{item.ncertPriority}/10</td>
                      <td className="py-4 pr-4 text-slate-600 min-w-[260px]">{item.recommendedAction || `Revise ${item.microTopics?.[0] || item.chapter} and solve timed questions.`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {priorityMap?.revisionDue?.length > 0 && (
            <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
              <div className="flex items-center gap-2 mb-5"><CalendarDays className="w-6 h-6 text-amber-600" /><h2 className="text-xl font-bold text-slate-900">Revision Due Queue</h2></div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {priorityMap.revisionDue.slice(0, 6).map((item, index) => <div key={index} className="p-4 rounded-2xl bg-amber-50 border border-amber-100"><p className="font-bold text-amber-950">{item.chapter}</p><p className="text-sm text-amber-800">{item.subject} • {item.recommendedAction}</p></div>)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function Control({ label, children }) { return <label className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card"><span className="block text-sm font-semibold text-slate-700 mb-2">{label}</span>{children}</label> }
function InfoCard({ icon: Icon, title, text }) { return <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card"><Icon className="w-7 h-7 text-primary-600 mb-3" /><h3 className="font-bold text-slate-900">{title}</h3><p className="text-sm text-slate-500 mt-2">{text}</p></div> }
function ChapterCard({ item, index }) {
  return <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50">
    <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-primary-700">#{index + 1} • {item.priorityBand}</p><h3 className="font-bold text-slate-900 mt-1">{item.chapter}</h3><p className="text-sm text-slate-500">{item.subject}</p></div><span className="px-3 py-1 rounded-full bg-white text-slate-700 text-xs font-bold border">{item.actionScore || item.priorityScore}/100</span></div>
    <div className="grid grid-cols-3 gap-2 mt-4 text-center"><Mini label="Weight" value={`${item.weightagePercent}%`} /><Mini label="PYQ" value={`${item.pyqFrequency}/10`} /><Mini label="NCERT" value={`${item.ncertPriority}/10`} /></div>
    <p className="text-sm text-slate-600 mt-4">{item.recommendedAction || item.strategyTags?.join(' • ')}</p>
  </div>
}
function Mini({ label, value }) { return <div className="p-2 rounded-xl bg-white border border-slate-100"><p className="text-[10px] text-slate-500">{label}</p><p className="font-bold text-slate-900">{value}</p></div> }

export default SyllabusStrategy
