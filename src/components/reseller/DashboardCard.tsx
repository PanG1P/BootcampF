type Props = {
  title: string;
  value: string;
  subtitle: string;
};

export default function DashboardCard({ title, value, subtitle }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <h3 className="text-sm text-slate-500">{title}</h3>

      <p className="text-2xl font-bold text-slate-800 mt-1">
        {value}
      </p>

      <p className="text-xs text-slate-400 mt-1">
        {subtitle}
      </p>
    </div>
  );
}