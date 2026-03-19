"use client";

import { useEffect, useMemo, useState } from "react";
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

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

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

  const totalPages = Math.max(1, Math.ceil(resellers.length / size));

  const paginatedResellers = useMemo(() => {
    const start = page * size;
    const end = start + size;
    return resellers.slice(start, end);
  }, [resellers, page, size]);

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

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(totalPages - 1, 0));
    }
  }, [page, totalPages]);

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
        resellers={paginatedResellers}
        onApprove={handleApprove}
        onReject={handleReject}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
        loading={loading}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          หน้า {page + 1} / {totalPages} ({resellers.length} รายการ)
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
                  className={`border-l border-slate-300 px-3 py-2 text-sm ${page === item
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