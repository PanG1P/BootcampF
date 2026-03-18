"use client";

import { useEffect, useState } from "react";
import ResellerTable from "@/components/admin/ResellerTable";
import type { Reseller } from "@/types/reseller";
import {
  approveReseller,
  getResellers,
  rejectReseller,
} from "@/services/reseller.service";

export default function AdminResellersPage() {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResellers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const response = await getResellers(token);
      setResellers(response.data ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "โหลดข้อมูลตัวแทนไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResellers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      await approveReseller(id, token);

      setResellers((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "approved" } : item
        )
      );

      alert("อนุมัติตัวแทนเรียบร้อย");
    } catch (err) {
      alert(err instanceof Error ? err.message : "อนุมัติไม่สำเร็จ");
    }
  };

  const handleReject = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      await rejectReseller(id, token);

      setResellers((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "rejected" } : item
        )
      );

      alert("ปฏิเสธตัวแทนเรียบร้อย");
    } catch (err) {
      alert(err instanceof Error ? err.message : "ปฏิเสธไม่สำเร็จ");
    }
  };

  const handleSuspend = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      await rejectReseller(id, token);

      setResellers((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "rejected" } : item
        )
      );

      alert("ระงับบัญชีเรียบร้อย");
    } catch (err) {
      alert(err instanceof Error ? err.message : "ระงับบัญชีไม่สำเร็จ");
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      await approveReseller(id, token);

      setResellers((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "approved" } : item
        )
      );

      alert("เปิดใช้งานบัญชีอีกครั้งเรียบร้อย");
    } catch (err) {
      alert(err instanceof Error ? err.message : "เปิดใช้งานอีกครั้งไม่สำเร็จ");
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-800">จัดการตัวแทน</h1>
        <p className="mt-1 text-slate-500">
          แสดงรายชื่อตัวแทนทั้งหมด และเน้นรายการรออนุมัติ
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <ResellerTable
        resellers={resellers}
        onApprove={handleApprove}
        onReject={handleReject}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
        loading={loading}
      />
    </div>
  );
}