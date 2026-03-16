import DashboardCard from "@/components/reseller/DashboardCard";

type Order = {
  id: string;
  product: string;
  customer: string;
  status: "Paid" | "Pending" | "Shipped";
  total: string;
};

const resellerOrders: Order[] = [
  {
    id: "RS-001",
    product: "Oversize T-Shirt",
    customer: "Somchai",
    status: "Paid",
    total: "฿390",
  },
  {
    id: "RS-002",
    product: "Hoodie Streetwear",
    customer: "Nok",
    status: "Pending",
    total: "฿890",
  },
  {
    id: "RS-003",
    product: "Cargo Pants",
    customer: "Jane",
    status: "Shipped",
    total: "฿990",
  },
];

export default function ResellerDashboardPage() {
  const getStatusColor = (status: string) => {
    if (status === "Paid") return "text-green-600";
    if (status === "Pending") return "text-yellow-600";
    return "text-blue-600";
  };

  return (
    <div className="space-y-6">

      <section>
        <h1 className="text-2xl font-bold text-slate-800">
          Reseller Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Overview of your sales and orders
        </p>
      </section>

      {/* Dashboard Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <DashboardCard title="My Orders" value="42" subtitle="Total orders" />
        <DashboardCard title="Products Sold" value="86" subtitle="Items sold" />
        <DashboardCard title="My Revenue" value="฿12,450" subtitle="This month" />
      </section>

      {/* Recent Orders Table */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm">

        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            My Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  Order ID
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  Product
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
              {resellerOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {order.id}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {order.product}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-700">
                    {order.customer}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium">
                    <span className={getStatusColor(order.status)}>
                      {order.status}
                    </span>
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