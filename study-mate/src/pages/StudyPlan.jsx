import { useEffect, useState } from 'react'
import { CalendarCheck, Clock, Loader2, RefreshCw, Target } from 'lucide-react'
import { fetchTodayPlan, generateTodayPlan } from '../api/studyPlanService'

function StudyPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async (regenerate = false) => {
    regenerate ? setRefreshing(true) : setLoading(true)
    try {
      const res = regenerate ? await generateTodayPlan() : await fetchTodayPlan()
      setPlan(res.data)
    } catch (error) {
      setPlan({
        title: 'Today’s Battle Plan', readiness: 68, examType: 'JEE/NEET', dailyStudyHours: 4,
        tasks: [
          { task: 'Revise Electrostatics', duration: '45 minutes', reason: 'Your recent accuracy is weak in formula-based numericals.' },
          { task: 'Solve 20 MCQs', duration: '60 minutes', reason: 'Question practice improves exam speed.' },
          { task: 'Retake mistake-based quiz', duration: '30 minutes', reason: 'Repeated mistakes reduce readiness score.' },
        ],
        disclaimer: 'AI-generated explanations should be verified for high-stakes exam preparation.',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary-600" /></div>

  return (
    <div className="space-y-6">
      <header className="bg-gradient-to-br from-primary-600 to-indigo-600 rounded-3xl p-6 text-white shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-sm mb-4"><CalendarCheck size={16} /> AI-generated daily route</div>
            <h1 className="text-3xl font-bold">Today’s Battle Plan</h1>
            <p className="text-primary-50 mt-2">Exam: {plan.examType} • Available hours: {plan.dailyStudyHours} • Readiness: {plan.readiness}/100</p>
          </div>
          <button onClick={() => load(true)} disabled={refreshing} className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-primary-700 font-semibold rounded-2xl hover:bg-primary-50 disabled:opacity-70">
            {refreshing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />} Regenerate Plan
          </button>
        </div>
      </header>

      <section className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          {plan.tasks?.map((task, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">{index + 1}</div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{task.task}</h2>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"><Clock size={14} /> {task.duration}</span>
                  </div>
                  <p className="text-slate-500 mt-2">Reason: {task.reason}</p>
                  {task.microTopics?.length ? <p className="text-xs text-primary-700 mt-2 font-semibold">Micro-focus: {task.microTopics.join(' • ')}</p> : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card h-fit">
          <Target className="w-9 h-9 text-primary-600 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-3">How this plan is made</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>• Student profile and target exam date</li>
            <li>• Weak subjects and chapter mastery</li>
            <li>• Recent quiz accuracy</li>
            <li>• Mistake Memory patterns</li>
            <li>• Revision due alerts</li>
          </ul>
          <p className="text-xs text-slate-500 mt-6">{plan.disclaimer}</p>
        </aside>
      
      </section>

      {plan.weeklyPlan?.length ? (
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
          <h2 className="text-xl font-bold text-slate-900 mb-4">7-Day Adaptive Strategy Preview</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {plan.weeklyPlan.map((item, index) => (
              <div key={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-primary-700">{item.day}</p>
                <h3 className="font-bold text-slate-900 mt-1">{item.chapter}</h3>
                <p className="text-sm text-slate-500">{item.subject} • {item.focus}</p>
                <p className="text-sm text-slate-700 mt-3">Target: {item.target}</p>
                <p className="text-xs text-slate-500 mt-2">{item.reason}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>

  )
}

export default StudyPlan
