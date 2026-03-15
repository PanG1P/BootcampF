"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  // useState ใช้เก็บค่าที่ผู้ใช้พิมพ์ใน input
  // email เก็บค่าอีเมล
  // password เก็บค่ารหัสผ่าน
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  // useState สำหรับเก็บข้อความแจ้งเตือน
  const [message, setMessage] = useState("");

  // function นี้จะทำงานเมื่อผู้ใช้กด submit form
  const handleSubmit = (e: React.FormEvent) => {
    // ป้องกันไม่ให้ form reload หน้าเว็บ
    e.preventDefault();

    // ตรวจสอบว่า input ถูกกรอกครบหรือยัง
    if (!email || !password) {
      setMessage("Please fill in both email and password.");
      return;
    }

    // ตอนนี้ยังไม่ได้เชื่อม backend
    // เลยใช้แค่แสดงข้อความจำลองว่ากด login สำเร็จ
    setMessage("Login success");

    // จำลอง login สำเร็จ แล้วพาไป dashboard
    setTimeout(() => {
      router.push("/reseller/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* ส่วนหัวของหน้า */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Login</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access the dashboard
          </p>
        </div>

        {/* form คือส่วนรับข้อมูลจากผู้ใช้ */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* กล่องกรอก email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            />
          </div>

          {/* กล่องกรอกรหัสผ่าน */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
            />
          </div>

          {/* ปุ่ม submit form */}
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
          >
            Login
          </button>
        </form>

        {/* แสดงข้อความแจ้งเตือน */}
        {message && (
          <p className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}