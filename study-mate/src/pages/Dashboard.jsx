import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, BarChart3, BookOpenCheck, Brain, CalendarCheck, FileText, Flame, Loader2, Target, UploadCloud, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchDashboardAnalytics } from '../api/analyticsService'
import { fetchTodayPlan } from '../api/studyPlanService'
import ProgressBar from '../components/ProgressBar'

const fallbackAnalytics = {
  readiness: 68,
  subjectReadiness: [
    { subject: 'Physics', score: 52 },
    { subject: 'Chemistry', score: 74 },
    { subject: 'Mathematics', score: 63 },
  ],
  weakChapters: [
    { subject: 'Physics', chapter: 'Electrostatics', concept: 'Electric field', masteryScore: 45, accuracy: 52 },
    { subject: 'Chemistry', chapter: 'Thermodynamics', concept: 'Enthalpy', masteryScore: 62, accuracy: 64 },
    { subject: 'Mathematics', chapter: 'Calculus', concept: 'Limits', masteryScore: 70, accuracy: 68 },
  ],
  recentMistakes: [],
  revisionAlerts: [{ topic: 'Electrostatics', subject: 'Physics', reason: 'Recent mastery is below 70%.' }],
  studyStreak: 3,
  quizAccuracy: 64,
  uploadedResourcesCount: 0,
  highYieldChapters: [
    { subject: 'Physics', chapter: 'Electrostatics', priorityBand: 'Attack First', priorityScore: 88, weightagePercent: 7.7, pyqFrequency: 9, ncertPriority: 6 },
    { subject: 'Chemistry', chapter: 'Coordination Compounds', priorityBand: 'Attack First', priorityScore: 84, weightagePercent: 6.5, pyqFrequency: 9, ncertPriority: 9 },
  ],
  strategyInsights: { weightedCoveragePercent: 0, priorityFormula: 'Action Score = syllabus priority + mastery gap + mistakes + revision gap.' },
  repeatedMistakeType: 'Formula Mistake',
}

function Dashboard() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(fallbackAnalytics)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [analyticsRes, planRes] = await Promise.all([fetchDashboardAnalytics(), fetchTodayPlan()])
        setAnalytics({ ...fallbackAnalytics, ...analyticsRes.data })
        setPlan(planRes.data)
      } catch (error) {
        console.error('Dashboard fallback loaded', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="w-9 h-9 animate-spin text-primary-600" /></div>
  }

  const tasks = plan?.tasks || [
    { task: 'Revise Electrostatics', duration: '45 minutes', reason: 'Recent accuracy dropped below 60%.' },
    { task: 'Solve 20 targeted MCQs', duration: '60 minutes', reason: 'Practice improves speed and confidence.' },
    { task: 'Retake mistake-based quiz', duration: '30 minutes', reason: 'Convert repeated mistakes into memory triggers.' },
  ]

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-indigo-600 to-cyan-500 rounded-3xl p-6 lg:p-8 text-white shadow-soft">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-sm mb-4">
              <Zap size={16} /> Agentic Study GPS for JEE/NEET Aspirants
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">Welcome back, {user?.name?.split(' ')[0] || 'Aspirant'} 👋</h1>
            <p className="text-primary-50 max-w-2xl">PrepPulse AI turns random hard work into personalized, data-driven smart work — today’s study, revision, mistakes, and exam readiness in one dashboard.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[280px]">
            <Link to="/doubt" className="bg-white text-primary-700 rounded-2xl px-4 py-3 font-semibold hover:bg-primary-50 transition-colors">Ask a Doubt</Link>
            <Link to="/quiz" className="bg-white/15 text-white rounded-2xl px-4 py-3 font-semibold hover:bg-white/25 transition-colors">Take Quiz</Link>
            <Link to="/upload" className="bg-white/15 text-white rounded-2xl px-4 py-3 font-semibold hover:bg-white/25 transition-colors">Upload Notes</Link>
            <Link to="/study-plan" className="bg-white text-primary-700 rounded-2xl px-4 py-3 font-semibold hover:bg-primary-50 transition-colors">Battle Plan</Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Metric icon={Target} label="Exam Readiness" value={`${analytics.readiness}/100`} tone="primary" />
        <Metric icon={Flame} label="Study Streak" value={`${analytics.studyStreak} days`} tone="orange" />
        <Metric icon={BookOpenCheck} label="Quiz Accuracy" value={`${analytics.quizAccuracy}%`} tone="green" />
        <Metric icon={UploadCloud} label="Resources" value={analytics.uploadedResourcesCount} tone="purple" />
      </section>


      <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Syllabus Intelligence GPS</h2>
            <p className="text-sm text-slate-500">High-yield chapter priority based on trend weightage, PYQ frequency, NCERT priority, and your weak areas.</p>
          </div>
          <Link to="/syllabus-strategy" className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold">Open Strategy Map</Link>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {analytics.highYieldChapters?.slice(0, 4).map((item, index) => (
            <div key={`${item.subject}-${item.chapter}-${index}`} className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-primary-50 border border-primary-100">
              <p className="text-xs font-bold text-primary-700">{item.priorityBand || 'High Yield'} • {item.priorityScore || item.actionScore}/100</p>
              <h3 className="font-bold text-slate-900 mt-1">{item.chapter}</h3>
              <p className="text-xs text-slate-500">{item.subject}</p>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                <span className="bg-white rounded-lg p-2">W: {item.weightagePercent}%</span>
                <span className="bg-white rounded-lg p-2">PYQ: {item.pyqFrequency}/10</span>
                <span className="bg-white rounded-lg p-2">NCERT: {item.ncertPriority}/10</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Today’s Battle Plan</h2>
              <p className="text-sm text-slate-500">Focused tasks generated from profile, weak areas, mistakes, and revision gaps.</p>
            </div>
            <CalendarCheck className="w-8 h-8 text-primary-600" />
          </div>
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={index} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/80">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{index + 1}. {task.task}</h3>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">{task.duration}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Reason: {task.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900">Readiness Score</h2>
            <BarChart3 className="w-7 h-7 text-indigo-600" />
          </div>
          <div className="text-center mb-6">
            <div className="text-6xl font-black text-slate-900">{analytics.readiness}</div>
            <p className="text-slate-500">out of 100</p>
          </div>
          <div className="space-y-4">
            {analytics.subjectReadiness?.map(item => <ProgressBar key={item.subject} label={item.subject} value={item.score} />)}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Panel title="Weak Concept Heatmap" icon={Brain}>
          <div className="space-y-4">
            {analytics.weakChapters?.slice(0, 5).map((item, index) => (
              <div key={`${item.subject}-${index}`} className="p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-800">{item.chapter || item.concept}</p>
                    <p className="text-xs text-slate-500">{item.subject} • {item.concept}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{item.masteryScore || item.accuracy}%</span>
                </div>
                <ProgressBar compact value={item.masteryScore || item.accuracy} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Mistake Memory" icon={AlertTriangle}>
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 mb-4">
            <p className="text-sm text-rose-700">Most repeated mistake</p>
            <h3 className="text-xl font-bold text-rose-900">{analytics.repeatedMistakeType}</h3>
          </div>
          {analytics.recentMistakes?.length ? analytics.recentMistakes.slice(0, 3).map((m, i) => (
            <div key={i} className="py-3 border-b border-slate-100 last:border-0">
              <p className="text-sm font-medium text-slate-800 line-clamp-2">{m.question}</p>
              <p className="text-xs text-slate-500">{m.subject} • {m.chapter} • {m.mistakeType}</p>
            </div>
          )) : (
            <p className="text-slate-500 text-sm">No mistakes yet. Take your first quiz to start building your Mistake Memory.</p>
          )}
          <Link to="/mistakes" className="inline-flex mt-4 text-sm font-semibold text-primary-600">Open Mistake Memory →</Link>
        </Panel>

        <Panel title="Revision Alerts" icon={FileText}>
          <div className="space-y-3">
            {analytics.revisionAlerts?.slice(0, 4).map((alert, index) => (
              <div key={index} className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="font-semibold text-amber-900">{alert.topic}</p>
                <p className="text-xs text-amber-700 mt-1">{alert.reason}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <p className="text-xs text-slate-500 text-center">AI-generated explanations should be verified for high-stakes exam preparation.</p>
    </div>
  )
}

function Metric({ icon: Icon, label, value, tone }) {
  const tones = {
    primary: 'bg-primary-50 text-primary-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-indigo-50 text-indigo-600',
  }
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-card card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tones[tone]}`}><Icon className="w-6 h-6" /></div>
      </div>
    </div>
  )
}

function Panel({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      {children}
    </div>
  )
}

export default Dashboard
