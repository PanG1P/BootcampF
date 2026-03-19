"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const loadOrders = useCallback(async (currentPage: number, currentSize: number) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const data = await getOrders(token, currentPage, currentSize);
      setOrders(data.content ?? []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดออเดอร์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(page, size);
  }, [page, size, loadOrders]);

  const handleMarkAsShipped = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const updatedOrder = await updateOrderStatus(id, "SHIPPED", token);

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );

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

      const updatedOrder = await updateOrderStatus(id, "COMPLETED", token);

      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );

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

      const nextOrders = orders.filter((order) => order.id !== id);
      setOrders(nextOrders);
      setTotalElements((prev) => Math.max(prev - 1, 0));

      if (nextOrders.length === 0 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        loadOrders(page, size);
      }

      alert("ลบออเดอร์สำเร็จ");
    } catch (err) {
      alert(err instanceof Error ? err.message : "ลบออเดอร์ไม่สำเร็จ");
    }
  };

  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(0);

    if (page > 2) {
      pages.push("...");
    }

    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages - 2, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages - 1);

    return pages;
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการออเดอร์</h1>
          <p className="mt-1 text-slate-500">
            แสดงออเดอร์ทั้งหมดจากระบบ และเปลี่ยนสถานะได้
          </p>
        </div>
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          หน้า {page + 1} / {totalPages} ({totalElements} รายการ)
        </p>

        <div className="flex items-center gap-2">
          <select
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

          <div className="flex items-center overflow-hidden rounded-lg border border-slate-300">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="px-3 py-2 text-sm disabled:opacity-50"
            >
              {"<"}
            </button>

            {visiblePages.map((item, index) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm text-slate-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item as number)}
                  className={`px-3 py-2 text-sm border-l border-slate-300 ${page === item
                      ? "bg-slate-100 font-semibold text-slate-900"
                      : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  {(item as number) + 1}
                </button>
              )
            )}

            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={page + 1 >= totalPages}
              className="border-l border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}