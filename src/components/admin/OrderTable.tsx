"use client";

import type { Order } from "@/types/order";

type OrderTableProps = {
  orders: Order[];
  onMarkAsShipped: (id: number) => void;
  onCompleteOrder: (id: number) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
};

// function getStatusLabel(status: string) {
//   switch (status.toLowerCase()) {
//     case "pending":
//       return "รอดำเนินการ";
//     case "shipped":
//       return "จัดส่งแล้ว";
//     case "completed":
//       return "เสร็จสมบูรณ์";
//     default:
//       return status;
//   }
// }

function getStatusBadge(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "pending") {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        รอดำเนินการ
      </span>
    );
  }

  if (normalized === "shipped") {
    return (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        จัดส่งแล้ว
      </span>
    );
  }

  if (normalized === "completed") {
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        เสร็จสมบูรณ์
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        ไม่พบข้อมูลออเดอร์
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              เลขออเดอร์
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              Shop ID
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ยอดรวม
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              กำไรตัวแทน
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              วันที่สั่ง
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
            orders.map((order) => {
              const normalized = order.status.toLowerCase();

              return (
                <tr key={order.id} className="border-t border-slate-100 align-top">
                  <td className="px-5 py-4 text-sm font-medium text-slate-800">
                    {order.order_number || `ORD-${order.id}`}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {order.shop_id}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    ฿{Number(order.total_amount).toLocaleString()}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {order.reseller_profit
                      ? `฿${Number(order.reseller_profit).toLocaleString()}`
                      : "-"}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {formatDate(order.created_at)}
                  </td>

                  <td className="px-5 py-4 text-sm">
                    {getStatusBadge(order.status)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-2">
                      {normalized === "pending" && (
                        <button
                          onClick={() => onMarkAsShipped(order.id)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          จัดส่งแล้ว
                        </button>
                      )}

                      {normalized === "shipped" && (
                        <button
                          onClick={() => onCompleteOrder(order.id)}
                          className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          ปิดงาน
                        </button>
                      )}

                      {normalized === "completed" && (
                        <span className="text-sm text-slate-400">เสร็จแล้ว</span>
                      )}

                      <button
                        onClick={() => onDelete(order.id)}
                        className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                      >
                        ลบ
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
  );
}