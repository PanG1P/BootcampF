"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("ยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก");
      return;
    }

    setSuccess("สมัครสำเร็จ สถานะบัญชีของคุณคือ รออนุมัติ");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">สมัครสมาชิก Reseller</h1>
        <p className="mt-2 text-sm text-slate-500">
          หลังสมัครสำเร็จต้องรอ Admin อนุมัติก่อนเข้าสู่ระบบ
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            name="name"
            placeholder="ชื่อ-นามสกุล"
            value={form.name}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            name="phone"
            placeholder="เบอร์โทรศัพท์"
            value={form.phone}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            name="shopName"
            placeholder="ชื่อร้านค้า"
            value={form.shopName}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={form.confirmPassword}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <textarea
            name="address"
            placeholder="ที่อยู่"
            value={form.address}
            onChange={handleChange}
            className="md:col-span-2 rounded-xl border border-slate-300 px-4 py-3"
            rows={4}
            required
          />

          {error && (
            <div className="md:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="md:col-span-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="md:col-span-2 rounded-xl bg-slate-900 py-3 text-white hover:bg-slate-800"
          >
            สมัครสมาชิก
          </button>
        </form>
      </div>
    </div>
  );
}