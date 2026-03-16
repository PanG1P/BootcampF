"use client";

// type ของสินค้าในออเดอร์
type OrderItem = {
  productName: string;
  quantity: number;
  sellPrice: number;
  costPrice: number;
};

// type ของออเดอร์
type Order = {
  id: string;
  resellerShop: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  orderDate: string;
  status: "รอดำเนินการ" | "จัดส่งแล้ว" | "เสร็จสมบูรณ์";
};

// props ที่ component นี้ต้องรับ
type OrderTableProps = {
  orders: Order[];
  onMarkAsShipped: (id: string) => void;
  onCompleteOrder: (id: string) => void;
};

// component ตารางออเดอร์
export default function OrderTable({
  orders,
  onMarkAsShipped,
  onCompleteOrder,
}: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left">
        {/* หัวตาราง */}
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              เลขออเดอร์
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ร้านตัวแทน
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ชื่อลูกค้า
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              สินค้า / จำนวน
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ยอดรวม
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

        {/* ข้อมูลในตาราง */}
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-slate-100 align-top">
              {/* เลขออเดอร์ */}
              <td className="px-5 py-4 text-sm font-medium text-slate-800">
                {order.id}
              </td>

              {/* ร้านตัวแทน */}
              <td className="px-5 py-4 text-sm text-slate-700">
                {order.resellerShop}
              </td>

              {/* ชื่อลูกค้า */}
              <td className="px-5 py-4 text-sm text-slate-700">
                {order.customerName}
              </td>

              {/* สินค้า / จำนวน */}
              <td className="px-5 py-4 text-sm text-slate-700">
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.productName} × {item.quantity}
                    </div>
                  ))}
                </div>
              </td>

              {/* ยอดรวม */}
              <td className="px-5 py-4 text-sm text-slate-700">
                ฿{order.total.toLocaleString()}
              </td>

              {/* วันที่สั่ง */}
              <td className="px-5 py-4 text-sm text-slate-700">
                {order.orderDate}
              </td>

              {/* สถานะ */}
              <td className="px-5 py-4 text-sm">
                {order.status === "รอดำเนินการ" && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    รอดำเนินการ
                  </span>
                )}

                {order.status === "จัดส่งแล้ว" && (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    จัดส่งแล้ว
                  </span>
                )}

                {order.status === "เสร็จสมบูรณ์" && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    เสร็จสมบูรณ์
                  </span>
                )}
              </td>

              {/* ปุ่มจัดการ */}
              <td className="px-5 py-4">
                <div className="flex flex-col gap-2">
                  {/* แสดงปุ่ม "จัดส่งแล้ว" เฉพาะตอนยังรอดำเนินการ */}
                  {order.status === "รอดำเนินการ" && (
                    <button
                      onClick={() => onMarkAsShipped(order.id)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      จัดส่งแล้ว
                    </button>
                  )}

                  {/* แสดงปุ่ม "เสร็จสมบูรณ์" เฉพาะตอนจัดส่งแล้ว */}
                  {order.status === "จัดส่งแล้ว" && (
                    <button
                      onClick={() => onCompleteOrder(order.id)}
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      ปิดงาน
                    </button>
                  )}

                  {/* ถ้าเสร็จสมบูรณ์แล้ว แสดงข้อความแทน */}
                  {order.status === "เสร็จสมบูรณ์" && (
                    <span className="text-sm text-slate-400">เสร็จแล้ว</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}