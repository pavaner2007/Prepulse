function ProgressBar({ value = 0, label, compact = false }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0))
  const status = safe <= 50 ? 'Weak' : safe <= 75 ? 'Improving' : 'Strong'
  const barClass = safe <= 50 ? 'bg-rose-500' : safe <= 75 ? 'bg-amber-500' : 'bg-emerald-500'

  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">{label}</span>
          <span className="text-slate-500">{safe}% • {status}</span>
        </div>
      )}
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${safe}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
