// Type ของข้อมูล order
type Order = {
  id: string;
  customer: string;
  total: number;
  status: "Pending" | "Paid" | "Shipped" | "Cancelled";
  date: string;
};

// props ของ component
type OrderTableProps = {
  orders: Order[];
};

// component ตารางออเดอร์
export default function OrderTable({ orders }: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
      <table className="w-full text-left">

        {/* หัวตาราง */}
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              Order ID
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              Customer
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              Date
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              Total
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              Status
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              Actions
            </th>
          </tr>
        </thead>

        {/* ข้อมูลในตาราง */}
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-slate-100">

              <td className="px-5 py-4 text-sm font-medium text-slate-800">
                {order.id}
              </td>

              <td className="px-5 py-4 text-sm text-slate-700">
                {order.customer}
              </td>

              <td className="px-5 py-4 text-sm text-slate-700">
                {order.date}
              </td>

              <td className="px-5 py-4 text-sm text-slate-700">
                ฿{order.total.toLocaleString()}
              </td>

              {/* แสดงสีตามสถานะ */}
              <td className="px-5 py-4 text-sm">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              {/* ปุ่มจัดการ */}
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">
                    View
                  </button>
                  <button className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white">
                    Cancel
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}