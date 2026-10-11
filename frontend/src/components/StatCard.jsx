
export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = 'emerald',
}) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
  }

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${colors[color] ?? colors.emerald}`}>
          {Icon && <Icon size={22} />}
        </div>
      </div>
    </article>
  )
}
