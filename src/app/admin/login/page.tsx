export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to access the admin dashboard
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white font-semibold hover:bg-slate-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
