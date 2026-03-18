"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminLogin, resellerLogin } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  // state เก็บค่าฟอร์ม
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // state สำหรับ error / info / loading
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  // ฟังก์ชัน submit login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setInfo("");
    setLoading(true);

    try {
      let result;

      // ลอง login admin ก่อน
      try {
        result = await adminLogin({ email, password });
      } catch {
        // ถ้าไม่ใช่ admin → ลอง reseller
        result = await resellerLogin({ email, password });
      }

      // เก็บ token และ role ไว้ใช้
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);

      if (result.status) {
        localStorage.setItem("status", result.status);
      }

      // redirect ตาม role
      if (result.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      // ตรวจ status reseller
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
    // container กลางหน้าจอ
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      {/* การ์ด login */}
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
        
        {/* หัวข้อ */}
        <div className="mb-6">
          <p className="text-sm text-slate-500">Sign in</p>
          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            เข้าสู่ระบบ
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งานระบบ
          </p>
        </div>

        {/* ฟอร์ม */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="กรอกอีเมล"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Info เช่น pending */}
          {info && (
            <div className="rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
              {info}
            </div>
          )}

          {/* ปุ่ม login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-slate-900 py-3 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        {/* Register link */}
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