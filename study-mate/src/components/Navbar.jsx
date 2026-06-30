import { Menu, LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 h-20 bg-slate-50/90 backdrop-blur border-b border-slate-200">
      <div className="h-full flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="p-2 hover:bg-white rounded-xl transition-colors hidden lg:block"><Menu size={22} /></button>
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary-600"><Sparkles size={14} /> PrepPulse AI</div>
            <p className="text-sm text-slate-500 hidden sm:block">Personalized JEE/NEET study GPS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user?.name || 'Aspirant'}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'PrepPulse'}`} alt="avatar" className="w-10 h-10 rounded-2xl border border-slate-200 bg-white" />
          <button onClick={logout} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="Logout"><LogOut size={20} /></button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
