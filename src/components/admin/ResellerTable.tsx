"use client";

import type { Reseller } from "@/types/reseller";

type ResellerStatus = "pending" | "approved" | "rejected" | "suspended";

type ResellerWithSuspend = Reseller & {
  status: ResellerStatus;
};

type ResellerTableProps = {
  resellers: ResellerWithSuspend[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onSuspend: (id: number) => void;
  onReactivate: (id: number) => void;
  loading?: boolean;
};

function getStatusBadge(status: ResellerStatus) {
  switch (status) {
    case "pending":
      return (
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          รออนุมัติ
        </span>
      );
    case "approved":
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          อนุมัติแล้ว
        </span>
      );
    case "rejected":
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          ถูกปฏิเสธ
        </span>
      );
    case "suspended":
      return (
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
          ถูกระงับ
        </span>
      );
    default:
      return null;
  }
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

export default function ResellerTable({
  resellers,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
  loading = false,
}: ResellerTableProps) {
  if (!loading && resellers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        ไม่พบข้อมูลตัวแทน
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ชื่อ
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              อีเมล
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              เบอร์โทรศัพท์
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ที่อยู่
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              วันที่สมัคร
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              สถานะ
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              จัดการ
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-6 text-center text-sm text-slate-500"
              >
                กำลังโหลดข้อมูล...
              </td>
            </tr>
          ) : (
            resellers.map((reseller) => (
              <tr
                key={reseller.id}
                className={`border-t border-slate-100 ${
                  reseller.status === "pending" ? "bg-yellow-50" : ""
                }`}
              >
                <td className="px-5 py-4 text-sm font-medium text-slate-800">
                  {reseller.name}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {reseller.email}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {reseller.phone || "-"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {reseller.address || "-"}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {formatDate(reseller.createdAt)}
                </td>

                <td className="px-5 py-4 text-sm">
                  {getStatusBadge(reseller.status)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {reseller.status === "pending" && (
                      <>
                        <button
                          onClick={() => onApprove(reseller.id)}
                          className="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600"
                        >
                          อนุมัติ
                        </button>

                        <button
                          onClick={() => onReject(reseller.id)}
                          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                        >
                          ปฏิเสธ
                        </button>
                      </>
                    )}

                    {reseller.status === "approved" && (
                      <button
                        onClick={() => onSuspend(reseller.id)}
                        className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600"
                      >
                        ระงับบัญชี
                      </button>
                    )}

                    {reseller.status === "rejected" && (
                      <button
                        onClick={() => onReactivate(reseller.id)}
                        className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                      >
                        อนุมัติอีกครั้ง
                      </button>
                    )}

                    {reseller.status === "suspended" && (
                      <button
                        onClick={() => onReactivate(reseller.id)}
                        className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                      >
                        เปิดใช้งานอีกครั้ง
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
  );
}