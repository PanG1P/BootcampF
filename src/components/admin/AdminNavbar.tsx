export default function AdminNavbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Admin Dashboard</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-800">Admin User</p>
          <p className="text-xs text-slate-500">admin@example.com</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold">
          A
        </div>
      </div>
    </header>
  );
}
