"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminLogin, resellerLogin } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setInfo("");

    if (password.trim() === "") {
      setError("รหัสผ่านห้ามเป็นค่าว่าง");
      return;
    }

    if (/\s/.test(password)) {
      setError("รหัสผ่านห้ามมีช่องว่าง");
      return;
    }

    setLoading(true);

    try {
      let result;

      try {
        result = await adminLogin({ email: email.trim(), password });
      } catch {
        result = await resellerLogin({ email: email.trim(), password });
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
      localStorage.setItem("email", email.trim());

      if (result.status) {
        localStorage.setItem("status", result.status);
      }

      if (result.userId !== undefined && result.userId !== null) {
        localStorage.setItem("userId", String(result.userId));
      }

      if (result.shopId !== undefined && result.shopId !== null) {
        localStorage.setItem("shopId", String(result.shopId));
      }

      if (result.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      if (result.role === "reseller") {
        if (result.status === "approved") {
          router.push("/reseller/dashboard");
          return;
        }

        if (result.status === "pending") {
          setInfo("บัญชีรออนุมัติ กรุณารอการติดต่อ");
          return;
        }

        if (result.status === "rejected") {
          setError("บัญชีนี้ไม่ได้รับการอนุมัติ");
          return;
        }

        router.push("/reseller/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="mb-6">
          <p className="text-sm text-slate-500">Sign in</p>
          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            เข้าสู่ระบบ
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งานระบบ
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="กรอกอีเมล"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="กรอกรหัสผ่าน"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {info && (
            <div className="rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 py-3 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          ยังไม่มีบัญชี?{" "}
          <Link
            href="/register"
            className="font-semibold text-slate-900 underline"
          >
            สมัครสมาชิก Reseller
          </Link>
        </p>
      </div>
    </div>
  );
}