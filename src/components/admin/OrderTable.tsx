"use client";

import type { Order } from "@/types/order";

type OrderTableProps = {
  orders: Order[];
  onMarkAsShipped: (id: number) => void;
  onCompleteOrder: (id: number) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
};

function getStatusBadge(status: string) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        รอดำเนินการ
      </span>
    );
  }

  if (normalized === "shipped") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-200">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        จัดส่งแล้ว
      </span>
    );
  }

  if (normalized === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        เสร็จสมบูรณ์
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
      {status}
    </span>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OrderTable({
  orders,
  onMarkAsShipped,
  onCompleteOrder,
  onDelete,
  loading = false,
}: OrderTableProps) {
  if (!loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <EmptyIcon />
        </div>
        <p className="text-sm font-medium text-slate-600">ไม่พบข้อมูลออเดอร์</p>
        <p className="mt-1 text-xs text-slate-400">ยังไม่มีออเดอร์ในระบบ</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {["เลขออเดอร์", "Shop ID", "ยอดรวม", "กำไรตัวแทน", "วันที่สั่ง", "สถานะ", "จัดการ"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-slate-100">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${60 + (j * 13) % 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              orders.map((order) => {
                const normalized = (order.status || "").toLowerCase();

                return (
                  <tr
                    key={order.id}
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                      {order.order_number || `ORD-${order.id}`}
                    </td>

                    <td className="px-5 py-3.5 text-sm text-slate-500">
                      {order.shop_id}
                    </td>

                    <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                      ฿{Number(order.total_amount).toLocaleString()}
                    </td>

                    <td className="px-5 py-3.5 text-sm text-slate-500">
                      {order.reseller_profit
                        ? `฿${Number(order.reseller_profit).toLocaleString()}`
                        : <span className="text-slate-300">—</span>}
                    </td>

                    <td className="px-5 py-3.5 text-sm text-slate-500">
                      {formatDate(order.created_at)}
                    </td>

                    <td className="px-5 py-3.5">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {normalized === "pending" && (
                          <button
                            onClick={() => onMarkAsShipped(order.id)}
                            className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600 active:scale-95"
                          >
                            จัดส่งแล้ว
                          </button>
                        )}

                        {normalized === "shipped" && (
                          <button
                            onClick={() => onCompleteOrder(order.id)}
                            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-600 active:scale-95"
                          >
                            ปิดงาน
                          </button>
                        )}

                        {normalized === "completed" && (
                          <span className="text-xs text-slate-400">เสร็จแล้ว</span>
                        )}

                        <button
                          onClick={() => onDelete(order.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100 active:scale-95"
                          title="ลบออเดอร์"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2Z" stroke="#94a3b8" strokeWidth="1.5" />
      <path d="M9 12h6M9 16h4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}