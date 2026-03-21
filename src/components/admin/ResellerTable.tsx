"use client";

import type { Reseller } from "@/types/reseller";

type ResellerStatus = "pending" | "approved" | "rejected" | "suspended";
type ResellerWithSuspend = Reseller & { status: ResellerStatus };

type ResellerTableProps = {
  resellers: ResellerWithSuspend[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onSuspend: (id: number) => void;
  onReactivate: (id: number) => void;
  loading?: boolean;
  searchQuery?: string;
};

function getStatusBadge(status: ResellerStatus) {
  const map: Record<ResellerStatus, { label: string; className: string; dotColor: string }> = {
    pending:   { label: "รออนุมัติ",   className: "bg-amber-50 text-amber-800 ring-amber-200",   dotColor: "bg-amber-400" },
    approved:  { label: "อนุมัติแล้ว", className: "bg-emerald-50 text-emerald-800 ring-emerald-200", dotColor: "bg-emerald-500" },
    rejected:  { label: "ถูกปฏิเสธ",  className: "bg-red-50 text-red-800 ring-red-200",         dotColor: "bg-red-500" },
    suspended: { label: "ถูกระงับ",    className: "bg-orange-50 text-orange-800 ring-orange-200", dotColor: "bg-orange-500" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${s.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dotColor}`} />
      {s.label}
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
          <mark key={i} className="rounded bg-indigo-100 px-0.5 text-indigo-800 not-italic">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const colors = ["bg-indigo-100 text-indigo-700", "bg-violet-100 text-violet-700", "bg-blue-100 text-blue-700", "bg-teal-100 text-teal-700"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}>
      {initials || "?"}
    </div>
  );
}

export default function ResellerTable({
  resellers,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
  loading = false,
  searchQuery = "",
}: ResellerTableProps) {
  if (!loading && resellers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <EmptyUsersIcon />
        </div>
        <p className="text-sm font-medium text-slate-600">
          {searchQuery ? `ไม่พบตัวแทน "${searchQuery}"` : "ไม่พบข้อมูลตัวแทน"}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {searchQuery ? "ลองค้นหาด้วยคำอื่น" : "ยังไม่มีตัวแทนในระบบ"}
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
              {["ตัวแทน", "เบอร์โทรศัพท์", "ที่อยู่", "วันที่สมัคร", "สถานะ", "จัดการ"].map((h) => (
                <th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 flex-shrink-0 animate-pulse rounded-full bg-slate-100" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-28 animate-pulse rounded bg-slate-100" />
                        <div className="h-3 w-36 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  </td>
                  {[50, 70, 55, 45, 80].map((w, j) => (
                    <td key={j} className="px-5 py-3.5">
                      <div className="h-4 animate-pulse rounded bg-slate-100" style={{ width: `${w}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              resellers.map((reseller) => (
                <tr
                  key={reseller.id}
                  className={`border-t border-slate-100 transition-colors hover:bg-slate-50/60 ${
                    reseller.status === "pending" ? "bg-amber-50/40" : ""
                  }`}
                >
                  {/* ── ชื่อ + อีเมล ── */}
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={reseller.name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          <Highlight text={reseller.name} query={searchQuery} />
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          <Highlight text={reseller.email} query={searchQuery} />
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3 text-sm text-slate-500 whitespace-nowrap">
                    <Highlight text={reseller.phone || "—"} query={searchQuery} />
                  </td>

                  <td className="px-5 py-3 text-sm text-slate-500 max-w-[160px]">
                    <p className="truncate">{reseller.address || "—"}</p>
                  </td>

                  <td className="px-5 py-3 text-sm text-slate-500 whitespace-nowrap">
                    {formatDate(reseller.createdAt)}
                  </td>

                  <td className="px-5 py-3">
                    {getStatusBadge(reseller.status)}
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {reseller.status === "pending" && (
                        <>
                          <button onClick={() => onApprove(reseller.id)} className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-600 active:scale-95">
                            <CheckIcon /> อนุมัติ
                          </button>
                          <button onClick={() => onReject(reseller.id)} className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 active:scale-95">
                            <XIcon /> ปฏิเสธ
                          </button>
                        </>
                      )}
                      {reseller.status === "approved" && (
                        <button onClick={() => onSuspend(reseller.id)} className="flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-xs font-medium text-orange-600 transition hover:bg-orange-100 active:scale-95">
                          <BanIcon /> ระงับบัญชี
                        </button>
                      )}
                      {(reseller.status === "rejected" || reseller.status === "suspended") && (
                        <button onClick={() => onReactivate(reseller.id)} className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100 active:scale-95">
                          <RefreshIcon /> เปิดใช้งาน
                        </button>
                      )}
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

function CheckIcon() { return <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M13 4L6 12l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function XIcon() { return <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }
function BanIcon() { return <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" /><path d="M4.1 4.1l7.8 7.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>; }
function RefreshIcon() { return <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M13.5 8A5.5 5.5 0 1 1 8 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M13.5 2.5v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function EmptyUsersIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" /><circle cx="9" cy="7" r="4" stroke="#94a3b8" strokeWidth="1.5" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" /></svg>; }