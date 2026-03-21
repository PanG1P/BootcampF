"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import OrderTable from "@/components/admin/OrderTable";
import ActionPopup from "@/components/common/ActionPopup";
import type { Order } from "@/types/order";
import {
  deleteOrder,
  getOrders,
  updateOrderStatus,
} from "@/services/order.service";

type PopupState = {
  open: boolean;
  type: "success" | "error" | "confirm";
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

type StatusFilter = "all" | "pending" | "shipped" | "completed";

const initialPopupState: PopupState = { open: false, type: "success", title: "", message: "" };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [popup, setPopup] = useState<PopupState>(initialPopupState);

  const closePopup = () => setPopup(initialPopupState);

  const showSuccessPopup = (title: string, message: string) =>
    setPopup({ open: true, type: "success", title, message });

  const showErrorPopup = (title: string, message: string) =>
    setPopup({ open: true, type: "error", title, message });

  const showConfirmPopup = ({
    title, message, confirmText = "ยืนยัน", cancelText = "ยกเลิก", onConfirm,
  }: { title: string; message: string; confirmText?: string; cancelText?: string; onConfirm: () => void }) =>
    setPopup({ open: true, type: "confirm", title, message, confirmText, cancelText, onConfirm });

  const loadOrders = useCallback(async (currentPage: number, currentSize: number) => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) { setError("ไม่พบ token กรุณาเข้าสู่ระบบใหม่"); return; }
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

  useEffect(() => { loadOrders(page, size); }, [page, size, loadOrders]);

  // ── Client-side filter + search (applied on top of server-paginated data) ──
  const statusCounts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((o) => (o.status || "").toLowerCase() === "pending").length,
    shipped: orders.filter((o) => (o.status || "").toLowerCase() === "shipped").length,
    completed: orders.filter((o) => (o.status || "").toLowerCase() === "completed").length,
  }), [orders]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (statusFilter !== "all") result = result.filter((o) => (o.status || "").toLowerCase() === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          (o.order_number || `ORD-${o.id}`).toLowerCase().includes(q) ||
          String(o.shop_id).toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, statusFilter, search]);

  useEffect(() => { setPage(0); }, [statusFilter, search]);

  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) { for (let i = 0; i < totalPages; i++) pages.push(i); return pages; }
    pages.push(0);
    if (page > 2) pages.push("...");
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages - 2, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 3) pages.push("...");
    pages.push(totalPages - 1);
    return pages;
  }, [page, totalPages]);

  const handleMarkAsShipped = (id: number) => {
    showConfirmPopup({
      title: "ยืนยันการเปลี่ยนสถานะ", message: 'ต้องการเปลี่ยนออเดอร์นี้เป็น "จัดส่งแล้ว" ใช่หรือไม่?', confirmText: "ยืนยัน",
      onConfirm: async () => {
        closePopup();
        try {
          const token = localStorage.getItem("token");
          if (!token) { showErrorPopup("เกิดข้อผิดพลาด", "ไม่พบ token กรุณาเข้าสู่ระบบใหม่"); return; }
          const updatedOrder = await updateOrderStatus(id, "SHIPPED", token);
          setOrders((prev) => prev.map((order) => (order.id === id ? updatedOrder : order)));
          showSuccessPopup("สำเร็จ", 'เปลี่ยนสถานะเป็น "จัดส่งแล้ว" เรียบร้อย');
        } catch (err) { showErrorPopup("ไม่สำเร็จ", err instanceof Error ? err.message : "เปลี่ยนสถานะไม่สำเร็จ"); }
      },
    });
  };

  const handleCompleteOrder = (id: number) => {
    showConfirmPopup({
      title: "ยืนยันการปิดงาน", message: "ต้องการปิดงานออเดอร์นี้ใช่หรือไม่?", confirmText: "ปิดงาน",
      onConfirm: async () => {
        closePopup();
        try {
          const token = localStorage.getItem("token");
          if (!token) { showErrorPopup("เกิดข้อผิดพลาด", "ไม่พบ token กรุณาเข้าสู่ระบบใหม่"); return; }
          const updatedOrder = await updateOrderStatus(id, "COMPLETED", token);
          setOrders((prev) => prev.map((order) => (order.id === id ? updatedOrder : order)));
          showSuccessPopup("สำเร็จ", "ปิดงานออเดอร์เรียบร้อย");
        } catch (err) { showErrorPopup("ไม่สำเร็จ", err instanceof Error ? err.message : "ปิดงานไม่สำเร็จ"); }
      },
    });
  };

  const handleDeleteOrder = (id: number) => {
    showConfirmPopup({
      title: "ยืนยันการลบออเดอร์", message: "ต้องการลบออเดอร์นี้หรือไม่? การกระทำนี้อาจไม่สามารถย้อนกลับได้", confirmText: "ลบ",
      onConfirm: async () => {
        closePopup();
        try {
          const token = localStorage.getItem("token");
          if (!token) { showErrorPopup("เกิดข้อผิดพลาด", "ไม่พบ token กรุณาเข้าสู่ระบบใหม่"); return; }
          await deleteOrder(id, token);
          const nextOrders = orders.filter((order) => order.id !== id);
          setOrders(nextOrders);
          setTotalElements((prev) => Math.max(prev - 1, 0));
          if (nextOrders.length === 0 && page > 0) {
            setPage((prev) => prev - 1);
          } else {
            loadOrders(page, size);
          }
          showSuccessPopup("สำเร็จ", "ลบออเดอร์สำเร็จ");
        } catch (err) { showErrorPopup("ไม่สำเร็จ", err instanceof Error ? err.message : "ลบออเดอร์ไม่สำเร็จ"); }
      },
    });
  };

  const filterOptions: { value: StatusFilter; label: string; color: string }[] = [
    { value: "all", label: "ทั้งหมด", color: "bg-slate-200 text-slate-500" },
    { value: "pending", label: "รอดำเนินการ", color: "bg-amber-100 text-amber-600" },
    { value: "shipped", label: "จัดส่งแล้ว", color: "bg-blue-100 text-blue-600" },
    { value: "completed", label: "เสร็จสมบูรณ์", color: "bg-emerald-100 text-emerald-600" },
  ];

  return (
    <>
      <div className="space-y-5 p-6">

        {/* ─── Header ─── */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs font-medium uppercase tracking-widest text-slate-400">Admin Console</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">จัดการออเดอร์</h1>
            <p className="mt-1 text-sm text-slate-400">
              ออเดอร์ทั้งหมด <span className="font-medium text-slate-600">{totalElements.toLocaleString()}</span> รายการ
              {statusCounts.pending > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  รอดำเนินการ {statusCounts.pending}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">แสดง</span>
              <select
                value={size}
                onChange={(e) => { setPage(0); setSize(Number(e.target.value)); }}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <button
              onClick={() => loadOrders(page, size)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50 active:scale-95"
            >
              <RefreshIcon />
              รีเฟรช
            </button>
          </div>
        </section>

        {/* ─── Search + Filter ─── */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาเลขออเดอร์ หรือ Shop ID..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute inset-y-0 right-3 flex items-center text-slate-300 hover:text-slate-500">
                <CloseSmIcon />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${statusFilter === opt.value ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {opt.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${opt.color}`}>
                  {statusCounts[opt.value]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ─── Error ─── */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {/* ─── Table ─── */}
        <OrderTable
          orders={filteredOrders}
          onMarkAsShipped={handleMarkAsShipped}
          onCompleteOrder={handleCompleteOrder}
          onDelete={handleDeleteOrder}
          loading={loading}
        />

        {/* ─── Pagination ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            {filteredOrders.length === 0
              ? "ไม่พบออเดอร์"
              : <>หน้า <span className="font-medium text-slate-700">{page + 1}</span> / <span className="font-medium text-slate-700">{totalPages}</span> <span className="ml-1">({totalElements.toLocaleString()} รายการ)</span></>
            }
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftIcon />
            </button>

            {visiblePages.map((item, index) =>
              item === "..." ? (
                <span key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center text-sm text-slate-400">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item as number)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition ${page === item
                      ? "border-blue-500 bg-blue-500 font-semibold text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {(item as number) + 1}
                </button>
              )
            )}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page + 1 >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      <ActionPopup
        open={popup.open}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
        onConfirm={popup.onConfirm}
        confirmText={popup.confirmText}
        cancelText={popup.cancelText}
      />
    </>
  );
}

function RefreshIcon() { return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13.5 8A5.5 5.5 0 1 1 8 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M13.5 2.5v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>; }
function CloseSmIcon() { return <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>; }
function ChevronLeftIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function ChevronRightIcon() { return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }