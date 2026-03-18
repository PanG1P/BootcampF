"use client";

import { useEffect, useState } from "react";
import OrderTable from "@/components/admin/OrderTable";
import type { Order } from "@/types/order";
import {
  deleteOrder,
  getOrders,
  updateOrderStatus,
} from "@/services/order.service";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const data = await getOrders(token);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดออเดอร์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleMarkAsShipped = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      await updateOrderStatus(id, "shipped", token);
      await loadOrders();
      alert('เปลี่ยนสถานะเป็น "จัดส่งแล้ว" เรียบร้อย');
    } catch (err) {
      alert(err instanceof Error ? err.message : "เปลี่ยนสถานะไม่สำเร็จ");
    }
  };

  const handleCompleteOrder = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      await updateOrderStatus(id, "completed", token);
      await loadOrders();
      alert("ปิดงานออเดอร์เรียบร้อย");
    } catch (err) {
      alert(err instanceof Error ? err.message : "ปิดงานไม่สำเร็จ");
    }
  };

  const handleDeleteOrder = async (id: number) => {
    const confirmed = window.confirm("ต้องการลบออเดอร์นี้หรือไม่?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      await deleteOrder(id, token);
      await loadOrders();
      alert("ลบออเดอร์สำเร็จ");
    } catch (err) {
      alert(err instanceof Error ? err.message : "ลบออเดอร์ไม่สำเร็จ");
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการออเดอร์</h1>
          <p className="mt-1 text-slate-500">
            แสดงออเดอร์ทั้งหมดจากระบบ และเปลี่ยนสถานะได้
          </p>
        </div>

        <button
          type="button"
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          ส่งออกข้อมูล
        </button>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <OrderTable
        orders={orders}
        onMarkAsShipped={handleMarkAsShipped}
        onCompleteOrder={handleCompleteOrder}
        onDelete={handleDeleteOrder}
        loading={loading}
      />
    </div>
  );
}