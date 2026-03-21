"use client";

import { useEffect, useMemo, useState } from "react";
import ResellerTable from "@/components/admin/ResellerTable";
import ActionPopup from "@/components/common/ActionPopup";
import type { Reseller } from "@/types/reseller";
import {
  approveReseller,
  getResellers,
  rejectReseller,
} from "@/services/reseller.service";

type ResellerStatus = "pending" | "approved" | "rejected" | "suspended";
type ResellerWithSuspend = Reseller & { status: ResellerStatus };

type PopupState = {
  open: boolean;
  type: "success" | "error" | "confirm";
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

const initialPopupState: PopupState = { open: false, type: "success", title: "", message: "" };

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "suspended";

export default function AdminResellersPage() {
  const [resellers, setResellers] = useState<ResellerWithSuspend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [popup, setPopup] = useState<PopupState>(initialPopupState);

  const closePopup = () => setPopup(initialPopupState);

  const showSuccessPopup = (title: string, message: string) =>
    setPopup({ open: true, type: "success", title, message });

  const showErrorPopup = (title: string, message: string) =>
    setPopup({ open: true, type: "error", title, message });

  const showConfirmPopup = ({ title, message, confirmText = "ยืนยัน", cancelText = "ยกเลิก", onConfirm }: { title: string; message: string; confirmText?: string; cancelText?: string; onConfirm: () => void }) =>
    setPopup({ open: true, type: "confirm", title, message, confirmText, cancelText, onConfirm });

  const loadResellers = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) { setError("ไม่พบ token กรุณาเข้าสู่ระบบใหม่"); return; }
      const response = await getResellers(token);
      const mappedData: ResellerWithSuspend[] = (response.data ?? []).map((item) => ({ ...item, status: (item.status as ResellerStatus) ?? "pending" }));
      setResellers(mappedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลตัวแทนไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadResellers(); }, []);

  // ── Counts per status ──
  const statusCounts = useMemo(() => ({
    all: resellers.length,
    pending: resellers.filter((r) => r.status === "pending").length,
    approved: resellers.filter((r) => r.status === "approved").length,
    rejected: resellers.filter((r) => r.status === "rejected").length,
    suspended: resellers.filter((r) => r.status === "suspended").length,
  }), [resellers]);

  // ── Filter + search ──
  const filtered = useMemo(() => {
    let result = resellers;
    if (statusFilter !== "all") result = result.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || (r.phone || "").includes(q)
      );
    }
    return result;
  }, [resellers, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));

  const paginatedResellers = useMemo(() => {
    const start = page * size;
    return filtered.slice(start, start + size);
  }, [filtered, page, size]);

  useEffect(() => { setPage(0); }, [statusFilter, search]);
  useEffect(() => { if (page > totalPages - 1) setPage(Math.max(totalPages - 1, 0)); }, [page, totalPages]);

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

  const handleApprove = (id: number) => {
    showConfirmPopup({
      title: "ยืนยันการอนุมัติ", message: "ต้องการอนุมัติตัวแทนรายนี้ใช่หรือไม่?", confirmText: "อนุมัติ",
      onConfirm: async () => {
        closePopup();
        try {
          const token = localStorage.getItem("token");
          if (!token) { showErrorPopup("เกิดข้อผิดพลาด", "ไม่พบ token"); return; }
          await approveReseller(id, token);
          setResellers((prev) => prev.map((item) => item.id === id ? { ...item, status: "approved" } : item));
          showSuccessPopup("สำเร็จ", "อนุมัติตัวแทนเรียบร้อย");
        } catch (err) { showErrorPopup("ไม่สำเร็จ", err instanceof Error ? err.message : "อนุมัติไม่สำเร็จ"); }
      },
    });
  };

  const handleReject = (id: number) => {
    showConfirmPopup({
      title: "ยืนยันการปฏิเสธ", message: "ต้องการปฏิเสธตัวแทนรายนี้ใช่หรือไม่?", confirmText: "ปฏิเสธ",
      onConfirm: async () => {
        closePopup();
        try {
          const token = localStorage.getItem("token");
          if (!token) { showErrorPopup("เกิดข้อผิดพลาด", "ไม่พบ token"); return; }
          await rejectReseller(id, token);
          setResellers((prev) => prev.map((item) => item.id === id ? { ...item, status: "rejected" } : item));
          showSuccessPopup("สำเร็จ", "ปฏิเสธตัวแทนเรียบร้อย");
        } catch (err) { showErrorPopup("ไม่สำเร็จ", err instanceof Error ? err.message : "ปฏิเสธไม่สำเร็จ"); }
      },
    });
  };

  const handleSuspend = (id: number) => {
    showConfirmPopup({
      title: "ยืนยันการระงับบัญชี", message: "ต้องการระงับบัญชีตัวแทนรายนี้ใช่หรือไม่?", confirmText: "ระงับ",
      onConfirm: async () => {
        closePopup();
        try {
          const token = localStorage.getItem("token");
          if (!token) { showErrorPopup("เกิดข้อผิดพลาด", "ไม่พบ token"); return; }
          setResellers((prev) => prev.map((item) => item.id === id ? { ...item, status: "suspended" } : item));
          showSuccessPopup("สำเร็จ", "ระงับบัญชีเรียบร้อย");
        } catch (err) { showErrorPopup("ไม่สำเร็จ", err instanceof Error ? err.message : "ระงับบัญชีไม่สำเร็จ"); }
      },
    });
  };

  const handleReactivate = (id: number) => {
    showConfirmPopup({
      title: "ยืนยันการเปิดใช้งาน", message: "ต้องการเปิดใช้งานบัญชีตัวแทนรายนี้อีกครั้งใช่หรือไม่?", confirmText: "เปิดใช้งาน",
      onConfirm: async () => {
        closePopup();
        try {
          const token = localStorage.getItem("token");
          if (!token) { showErrorPopup("เกิดข้อผิดพลาด", "ไม่พบ token"); return; }
          setResellers((prev) => prev.map((item) => item.id === id ? { ...item, status: "approved" } : item));
          showSuccessPopup("สำเร็จ", "เปิดใช้งานบัญชีอีกครั้งเรียบร้อย");
        } catch (err) { showErrorPopup("ไม่สำเร็จ", err instanceof Error ? err.message : "เปิดใช้งานอีกครั้งไม่สำเร็จ"); }
      },
    });
  };

  const filterOptions: { value: StatusFilter; label: string; color: string }[] = [
    { value: "all", label: "ทั้งหมด", color: "bg-slate-200 text-slate-500" },
    { value: "pending", label: "รออนุมัติ", color: "bg-amber-100 text-amber-600" },
    { value: "approved", label: "อนุมัติแล้ว", color: "bg-emerald-100 text-emerald-600" },
    { value: "rejected", label: "ถูกปฏิเสธ", color: "bg-red-100 text-red-600" },
    { value: "suspended", label: "ถูกระงับ", color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <>
      <div className="space-y-5 p-6">

        {/* ─── Header ─── */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-medium uppercase tracking-widest text-slate-400">Admin Console</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">จัดการตัวแทน</h1>
            <p className="mt-1 text-sm text-slate-400">
              ตัวแทนทั้งหมด <span className="font-medium text-slate-600">{resellers.length}</span> ราย
              {statusCounts.pending > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  รออนุมัติ {statusCounts.pending}
                </span>
              )}
            </p>
          </div>

          <button
            onClick={loadResellers}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50 active:scale-95"
          >
            <RefreshIcon />
            รีเฟรช
          </button>
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
              placeholder="ค้นหาชื่อ อีเมล หรือเบอร์โทร..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute inset-y-0 right-3 flex items-center text-slate-300 hover:text-slate-500">
                <CloseSmIcon />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
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
        <ResellerTable
          resellers={paginatedResellers}
          onApprove={handleApprove}
          onReject={handleReject}
          onSuspend={handleSuspend}
          onReactivate={handleReactivate}
          loading={loading}
          searchQuery={search}
        />

        {/* ─── Pagination ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-400">
              {filtered.length === 0
                ? "ไม่พบตัวแทน"
                : <>หน้า <span className="font-medium text-slate-700">{page + 1}</span> / <span className="font-medium text-slate-700">{totalPages}</span> <span className="ml-1">({filtered.length.toLocaleString()} ราย)</span></>
              }
            </p>
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
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
              <ChevronLeftIcon />
            </button>
            {visiblePages.map((item, index) =>
              item === "..." ? (
                <span key={`e-${index}`} className="flex h-8 w-8 items-center justify-center text-sm text-slate-400">…</span>
              ) : (
                <button key={item} onClick={() => setPage(item as number)} className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition ${page === item ? "border-indigo-500 bg-indigo-500 font-semibold text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {(item as number) + 1}
                </button>
              )
            )}
            <button onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))} disabled={page + 1 >= totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">
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