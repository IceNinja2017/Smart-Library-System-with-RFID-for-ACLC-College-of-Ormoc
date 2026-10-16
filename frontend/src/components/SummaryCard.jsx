

export default function SummaryCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
        <Icon size={19} className="text-[var(--color-primary)]" />
      </div>

      <p className="mt-3 text-3xl font-bold text-[var(--color-text)]">
        {value}
      </p>
    </div>
  )
}