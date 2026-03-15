import DashboardCard from "@/components/admin/DashboardCard";

// ข้อมูลจำลองสรุปภาพรวม
const dashboardSummary = {
  totalSales: 24800,
  totalResellerProfit: 5400,
  totalOrders: 128,
  pendingOrders: 12,
  totalApprovedResellers: 16,
  pendingResellers: 5,
};

// ข้อมูลจำลองออเดอร์ล่าสุด
const recentOrders = [
  {
    id: "ORD-20260001",
    resellerShop: "Smile Dental Shop",
    customerName: "กิตติภพ",
    status: "รอดำเนินการ",
    total: 1200,
  },
  {
    id: "ORD-20260002",
    resellerShop: "Bright Care Supplies",
    customerName: "สุภาวดี",
    status: "จัดส่งแล้ว",
    total: 600,
  },
  {
    id: "ORD-20260003",
    resellerShop: "Dental Pro Market",
    customerName: "อนันต์",
    status: "เสร็จสมบูรณ์",
    total: 1000,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* ส่วนหัวของหน้า */}
      <section>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard ยอดขาย</h1>
        <p className="mt-1 text-slate-500">
          หน้าแรกหลัง Admin Login แสดงข้อมูลสรุปภาพรวมของระบบ
        </p>
      </section>

      {/* การ์ดสรุปข้อมูล */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="ยอดขายรวม (บาท)"
          value={`฿${dashboardSummary.totalSales.toLocaleString()}`}
          subtitle="ผลรวมยอดทุกออเดอร์ที่จัดส่งแล้วหรือเสร็จสมบูรณ์"
        />

        <DashboardCard
          title="กำไรรวมที่จ่ายตัวแทน (บาท)"
          value={`฿${dashboardSummary.totalResellerProfit.toLocaleString()}`}
          subtitle="ผลรวมกำไรที่บวกเข้า Wallet ตัวแทนทั้งหมด"
        />

        <DashboardCard
          title="จำนวนออเดอร์ทั้งหมด"
          value={dashboardSummary.totalOrders.toLocaleString()}
          subtitle="นับทุกออเดอร์ในระบบ"
        />

        <DashboardCard
          title="ออเดอร์รอดำเนินการ"
          value={dashboardSummary.pendingOrders.toLocaleString()}
          subtitle="ออเดอร์ที่ยังไม่ได้จัดส่ง"
        />

        <DashboardCard
          title="จำนวนตัวแทนทั้งหมด"
          value={dashboardSummary.totalApprovedResellers.toLocaleString()}
          subtitle="นับเฉพาะตัวแทนที่อนุมัติแล้ว"
        />

        <DashboardCard
          title="ตัวแทนรออนุมัติ"
          value={dashboardSummary.pendingResellers.toLocaleString()}
          subtitle="จำนวนที่ยังรอการตรวจสอบ"
        />
      </section>

      {/* ตารางออเดอร์ล่าสุด */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-800">
            ออเดอร์ล่าสุด
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            ตัวอย่างข้อมูลออเดอร์ล่าสุดในระบบ
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
                  สถานะ
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  ยอดรวม
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 text-sm font-medium text-slate-800">
                    {order.id}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {order.resellerShop}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {order.customerName}
                  </td>

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

                  <td className="px-5 py-4 text-sm text-slate-700">
                    ฿{order.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}