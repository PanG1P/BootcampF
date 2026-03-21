"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { registerReseller } from "@/services/auth.service";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "password" || name === "confirmPassword") {
      const noSpaces = value.replace(/\s/g, "");
      setForm({ ...form, [name]: noSpaces });
      return;
    }

    if (name === "shopName") {
      setForm({ ...form, shopName: value.slice(0, 25) });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      shopName: "",
      address: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      shopName: form.shopName.trim(),
      address: form.address.trim(),
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.phone ||
      !payload.password ||
      !payload.confirmPassword ||
      !payload.shopName ||
      !payload.address
    ) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (payload.password.trim() === "" || payload.confirmPassword.trim() === "") {
      setError("รหัสผ่านห้ามเป็นค่าว่าง");
      return;
    }

    if (/\s/.test(payload.password) || /\s/.test(payload.confirmPassword)) {
      setError("รหัสผ่านห้ามมีเว้นวรรค");
      return;
    }

    if (payload.password.length < 8) {
      setError("รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      setError("ยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!/^\d{10}$/.test(payload.phone)) {
      setError("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก");
      return;
    }

    if (payload.shopName.length > 25) {
      setError("ชื่อร้านต้องไม่เกิน 25 ตัวอักษร");
      return;
    }

    try {
      setLoading(true);

      const result = await registerReseller({
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        password: payload.password,
        shop_name: payload.shopName,
        address: payload.address,
      });

      setSuccess(result.message || "สมัครสำเร็จ กรุณารอการอนุมัติจาก Admin");
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={16} />
            กลับไปหน้า Login
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-slate-800">
          สมัครสมาชิก Reseller
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          หลังสมัครสำเร็จต้องรอ Admin อนุมัติก่อนเข้าสู่ระบบ
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            name="name"
            placeholder="ชื่อ-นามสกุล"
            value={form.name}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400"
            autoComplete="name"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400"
            autoComplete="email"
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="เบอร์โทรศัพท์"
            value={form.phone}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400"
            autoComplete="tel"
            required
          />

          <div>
            <input
              name="shopName"
              placeholder="ชื่อร้านค้า"
              value={form.shopName}
              onChange={handleChange}
              maxLength={25}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400"
              required
            />
            <p className="mt-1 text-xs text-slate-500">
              {form.shopName.length}/25 ตัวอักษร
            </p>
          </div>

          <input
            name="password"
            type="password"
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400"
            autoComplete="new-password"
            required
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={form.confirmPassword}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400"
            autoComplete="new-password"
            required
          />

          <textarea
            name="address"
            placeholder="ที่อยู่"
            value={form.address}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder:text-slate-400 md:col-span-2"
            rows={4}
            required
          />

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 md:col-span-2">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-600 md:col-span-2">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-slate-900 py-3 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
          >
            {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
          </button>
        </form>
      </div>
    </div>
  );
}