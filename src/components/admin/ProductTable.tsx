"use client";

import type { Product } from "@/types/product";

type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  loading?: boolean;
  searchQuery?: string;
};

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        หมด
      </span>
    );
  }
  if (stock <= 10) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        {stock} เหลือน้อย
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {stock}
    </span>
  );
}

function Highlight({ text, query }: { text: string; query?: string }) {
  if (!query?.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="rounded bg-violet-100 px-0.5 text-violet-800 not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  loading = false,
  searchQuery = "",
}: ProductTableProps) {
  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <EmptyBoxIcon />
        </div>
        <p className="text-sm font-medium text-slate-600">
          {searchQuery ? `ไม่พบสินค้า "${searchQuery}"` : "ไม่พบข้อมูลสินค้า"}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {searchQuery ? "ลองค้นหาด้วยคำอื่น" : "ยังไม่มีสินค้าในระบบ"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {[
                { label: "สินค้า", width: "w-[40%]" },
                { label: "ราคาทุน", width: "w-[12%]" },
                { label: "ราคาขั้นต่ำ", width: "w-[12%]" },
                { label: "สต็อก", width: "w-[14%]" },
                { label: "จัดการ", width: "w-[12%]" },
              ].map((h) => (
                <th key={h.label} className={`${h.width} px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-400`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-lg bg-slate-100" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-32 animate-pulse rounded bg-slate-100" />
                        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  </td>
                  {[70, 70, 60, 80].map((w, j) => (
                    <td key={j} className="px-5 py-3.5">
                      <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${w}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/60">

                  {/* ── ชื่อ + รูป (priority 1) ── */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                        <img
                          src={product.image_url || "https://via.placeholder.com/80?text=—"}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          <Highlight text={product.name} query={searchQuery} />
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          <Highlight text={product.description || "—"} query={searchQuery} />
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ── ราคาทุน (priority 2) ── */}
                  <td className="px-5 py-3 text-sm font-semibold text-slate-800">
                    ฿{Number(product.cost_price).toLocaleString()}
                  </td>

                  {/* ── ราคาขั้นต่ำ (priority 2) ── */}
                  <td className="px-5 py-3 text-sm text-slate-500">
                    ฿{Number(product.min_price).toLocaleString()}
                  </td>

                  {/* ── สต็อก (priority 2) ── */}
                  <td className="px-5 py-3">
                    <StockBadge stock={product.stock} />
                  </td>

                  {/* ── จัดการ ── */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 active:scale-95"
                      >
                        <EditIcon />
                        แก้ไข
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100 active:scale-95"
                        title="ลบสินค้า"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EditIcon() {
  return <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13H3v-2L11.5 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function TrashIcon() {
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function EmptyBoxIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}