function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <div className="rounded-2xl border border-brand/15 bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink-soft">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink-soft/70">{hint}</p>}
        </div>
        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-dim text-brand">
            <Icon className="text-lg" />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
