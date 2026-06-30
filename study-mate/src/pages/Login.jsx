import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpenCheck, Mail, Lock, Eye, EyeOff, User, Target, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ email: '', password: '', name: '', college: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLogin) await login(formData.email, formData.password)
      else await register(formData.name, formData.email, formData.password, formData.college)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-primary-950 to-indigo-950 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <section className="hidden lg:block text-white space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-primary-50">
            <Sparkles size={18} /> Hackathon-ready AI mentor
          </div>
          <div>
            <h1 className="text-6xl font-black tracking-tight leading-tight">PrepPulse AI</h1>
            <p className="text-2xl text-cyan-100 mt-4">Agentic Study GPS for JEE/NEET Aspirants</p>
          </div>
          <p className="text-lg text-slate-300 max-w-xl">Know what to study today, what to revise, which mistakes repeat, and how exam-ready you are — with open-source Ollama-ready AI and safe fallback flows.</p>
          <div className="grid grid-cols-3 gap-4 max-w-xl">
            {['Battle Plan', 'Mistake Memory', 'RAG Doubts'].map(item => (
              <div key={item} className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-md mx-auto">
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
              <BookOpenCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">PrepPulse AI</h1>
            <p className="text-slate-300 mt-2">Agentic Study GPS for JEE/NEET</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
                <p className="text-sm text-slate-500">Start your personalized prep journey.</p>
              </div>
            </div>

            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
              <button type="button" onClick={() => { setIsLogin(true); setError('') }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Sign In</button>
              <button type="button" onClick={() => { setIsLogin(false); setError('') }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${!isLogin ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Sign Up</button>
            </div>

            {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Pavan E R" required className="input-field pl-11" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="aspirant@example.com" required className="input-field pl-11" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="input-field pl-11 pr-11" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60">
                {loading ? 'Please wait...' : isLogin ? 'Enter PrepPulse' : 'Create Account'}
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-5">AI-generated explanations should be verified for high-stakes exam preparation.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
