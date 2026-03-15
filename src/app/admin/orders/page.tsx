import OrderTable from "@/components/admin/OrderTable";

// mock data คือข้อมูลจำลอง
// ใช้สำหรับทำ UI ก่อน โดยยังไม่ต้องรอ backend
const orders = [
  {
    id: "ORD-001",
    customer: "Krittipong",
    total: 1250,
    status: "Pending" as const,
    date: "2026-03-15",
  },
  {
    id: "ORD-002",
    customer: "Anan",
    total: 2490,
    status: "Paid" as const,
    date: "2026-03-14",
  },
  {
    id: "ORD-003",
    customer: "Suda",
    total: 980,
    status: "Shipped" as const,
    date: "2026-03-13",
  },
  {
    id: "ORD-004",
    customer: "Nida",
    total: 1500,
    status: "Cancelled" as const,
    date: "2026-03-12",
  },
];

// component หลักของหน้า /admin/orders
// หน้าที่คือแสดงหัวข้อหน้า และส่งข้อมูล orders ไปยัง OrderTable
export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      {/* ส่วนหัวของหน้า */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
          <p className="mt-1 text-slate-500">
            Manage customer orders and order status
          </p>
        </div>

        <button className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          Export Orders
        </button>
      </section>

      {/* เรียกใช้ตารางออเดอร์ และส่งข้อมูล orders ผ่าน props */}
      <OrderTable orders={orders} />
    </div>
  );
}