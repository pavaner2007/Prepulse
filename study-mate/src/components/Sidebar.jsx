import { NavLink } from 'react-router-dom'
import { AlertTriangle, BarChart3, BookOpenCheck, Brain, CalendarCheck, BrainCircuit, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard, UploadCloud, UserCircle, Youtube, Globe } from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/doubt', icon: Brain, label: 'AI Doubt Solver' },
  { path: '/chatbot', icon: Globe, label: 'Web Scraping Agent' },
  { path: '/upload', icon: UploadCloud, label: 'Upload Resources' },
  { path: '/youtube', icon: Youtube, label: 'YouTube Companion' },
  { path: '/quiz', icon: ClipboardList, label: 'Adaptive Quiz' },
  { path: '/mistakes', icon: AlertTriangle, label: 'Mistake Memory' },
  { path: '/study-plan', icon: CalendarCheck, label: 'Study Plan' },
  { path: '/syllabus-strategy', icon: BrainCircuit, label: 'Syllabus Strategy' },
  { path: '/analytics', icon: BarChart3, label: 'Progress Analytics' },
  { path: '/profile', icon: UserCircle, label: 'Profile' },
]

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 shadow-soft transition-all duration-300 z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="h-full flex flex-col">
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpenCheck className="w-6 h-6 text-white" />
            </div>
            {isOpen && <div className="min-w-0"><p className="font-black text-xl text-slate-900 leading-tight">PrepPulse AI</p><p className="text-[11px] text-slate-500 truncate">Agentic Study GPS</p></div>}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-2xl transition-all ${isActive ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`} title={!isOpen ? item.label : ''}>
              <item.icon size={21} className="flex-shrink-0" />
              {isOpen && <span className="text-sm whitespace-nowrap">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {isOpen && (
          <div className="p-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-50 to-cyan-50 border border-primary-100">
              <p className="text-sm font-bold text-slate-900">Demo-safe AI</p>
              <p className="text-xs text-slate-500 mt-1">Groq/HuggingFace deployable AI with deterministic demo fallback.</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
