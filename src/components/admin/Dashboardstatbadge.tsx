type Variant = "warning" | "success" | "danger";
type IconType = "clock" | "check" | "alert";

type DashboardStatBadgeProps = {
  label: string;
  value: string;
  variant: Variant;
  icon: IconType;
};

const variantStyles: Record<Variant, { iconBg: string; iconColor: string }> = {
  warning: { iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  success: { iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  danger:  { iconBg: "bg-red-50",    iconColor: "text-red-600"    },
};

function Icon({ type, className }: { type: IconType; className?: string }) {
  if (type === "clock") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "check") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
        <path d="M13 4L6 12l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v3M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function DashboardStatBadge({
  label,
  value,
  variant,
  icon,
}: DashboardStatBadgeProps) {
  const { iconBg, iconColor } = variantStyles[variant];

  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon type={icon} className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}