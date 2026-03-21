type Accent = "green" | "blue" | "amber";

type DashboardCardProps = {
  title: string;
  value: string;
  subtitle: string;
  accent?: Accent;
  trend?: string;
};

const accentStyles: Record<Accent, { value: string; badge: string; blob: string }> = {
  green: {
    value: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200",
    blob: "bg-emerald-500/5",
  },
  blue: {
    value: "text-blue-600",
    badge: "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200",
    blob: "bg-blue-500/5",
  },
  amber: {
    value: "text-amber-600",
    badge: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200",
    blob: "bg-amber-500/5",
  },
};

export default function DashboardCard({
  title,
  value,
  subtitle,
  accent = "green",
  trend,
}: DashboardCardProps) {
  const styles = accentStyles[accent];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Decorative blob */}
      <div
        className={`absolute right-0 top-0 h-16 w-16 rounded-bl-full ${styles.blob}`}
      />

      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className={`mt-2 text-3xl font-semibold ${styles.value}`}>
        {value}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {trend && (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
            ▲ {trend}
          </span>
        )}
        <span className="text-xs text-slate-400">{subtitle}</span>
      </div>
    </div>
  );
}