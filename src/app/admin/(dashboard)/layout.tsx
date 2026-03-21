"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.replace("/login");
    }
  }, [router]);

  // 👇 render ตรงๆ ไม่ต้องมี state checking
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  if (!token || role !== "admin") {
    return null; // ไม่ render อะไรเลย
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}