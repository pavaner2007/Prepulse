import { Sparkles } from 'lucide-react'

function EmptyState({ title, description, action }) {
  return (
    <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-card">
      <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-5">{description}</p>
      {action}
    </div>
  )
}

export default EmptyState
