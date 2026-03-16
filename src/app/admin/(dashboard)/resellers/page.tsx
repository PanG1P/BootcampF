"use client";

import { useState } from "react";
import ResellerTable from "@/components/admin/ResellerTable";

// กำหนดรูปแบบข้อมูลของตัวแทน 1 คน
type Reseller = {
  id: number;
  fullName: string;
  email: string;
  shopName: string;
  phone: string;
  appliedAt: string;
  status: "รออนุมัติ" | "อนุมัติแล้ว" | "ถูกปฏิเสธ";
};

// ข้อมูลจำลองเริ่มต้น
const initialResellers: Reseller[] = [
  {
    id: 1,
    fullName: "สมชาย ใจดี",
    email: "somchai@example.com",
    shopName: "Smile Dental Shop",
    phone: "081-234-5678",
    appliedAt: "2026-03-14 10:30",
    status: "รออนุมัติ",
  },
  {
    id: 2,
    fullName: "สุภาวดี พรชัย",
    email: "supawadee@example.com",
    shopName: "Bright Care Supplies",
    phone: "089-555-1234",
    appliedAt: "2026-03-13 14:15",
    status: "อนุมัติแล้ว",
  },
  {
    id: 3,
    fullName: "กิตติภพ แสงทอง",
    email: "kittipob@example.com",
    shopName: "Dental Pro Market",
    phone: "086-777-8899",
    appliedAt: "2026-03-12 09:00",
    status: "ถูกปฏิเสธ",
  },
];

export default function AdminResellersPage() {
  // state สำหรับเก็บรายการตัวแทนทั้งหมด
  const [resellers, setResellers] = useState<Reseller[]>(initialResellers);

  // ฟังก์ชันอนุมัติ
  // เมื่อกดแล้วจะเปลี่ยน status ของ id ที่ตรงกันเป็น "อนุมัติแล้ว"
  const handleApprove = (id: number) => {
    setResellers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "อนุมัติแล้ว" } : item
      )
    );

    alert("อนุมัติตัวแทนเรียบร้อย (mock)");
  };

  // ฟังก์ชันปฏิเสธ
  // เมื่อกดแล้วจะเปลี่ยน status ของ id ที่ตรงกันเป็น "ถูกปฏิเสธ"
  const handleReject = (id: number) => {
    setResellers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "ถูกปฏิเสธ" } : item
      )
    );

    alert("ปฏิเสธตัวแทนเรียบร้อย (mock)");
  };

  return (
    <div className="space-y-6">
      {/* ส่วนหัวของหน้า */}
      <section>
        <h1 className="text-2xl font-bold text-slate-800">จัดการตัวแทน</h1>
        <p className="mt-1 text-slate-500">
          แสดงรายชื่อตัวแทนทั้งหมด และเน้นรายการรออนุมัติ
        </p>
      </section>

      {/* ส่งข้อมูลและฟังก์ชันไปให้ตาราง */}
      <ResellerTable
        resellers={resellers}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}