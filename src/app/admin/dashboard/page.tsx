import DashboardCard from "@/components/admin/DashboardCard";

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Krittipong",
    status: "Pending",
    total: "฿1,250",
  },
  {
    id: "ORD-002",
    customer: "Anan",
    status: "Paid",
    total: "฿2,490",
  },
  {
    id: "ORD-003",
    customer: "Suda",
    status: "Shipped",
    total: "฿980",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Overview of products, orders, and resellers
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Orders"
          value="128"
          subtitle="Updated today"
        />
        <DashboardCard
          title="Total Products"
          value="54"
          subtitle="Items in system"
        />
        <DashboardCard
          title="Total Resellers"
          value="16"
          subtitle="Approved accounts"
        />
        <DashboardCard
          title="Revenue"
          value="฿24,800"
          subtitle="This month"
        />
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Recent Orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  Order ID
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  Customer
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  Status
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 text-sm text-slate-700">{order.id}</td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {order.customer}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {order.status}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {order.total}
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
