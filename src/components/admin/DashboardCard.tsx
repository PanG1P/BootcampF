type DashboardCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

export default function DashboardCard({
  title,
  value,
  subtitle,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}
