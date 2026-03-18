"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardCard from "@/components/admin/DashboardCard";
import type { Order } from "@/types/order";
import type { Reseller } from "@/types/reseller";
import { getOrders } from "@/services/order.service";
import { getResellers } from "@/services/reseller.service";

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

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const [ordersData, resellersResponse] = await Promise.all([
        getOrders(token),
        getResellers(token),
      ]);

      setOrders(ordersData);
      setResellers(resellersResponse.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลแดชบอร์ดไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const dashboardSummary = useMemo(() => {
    const totalSales = orders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    const totalResellerProfit = orders.reduce(
      (sum, order) => sum + Number(order.reseller_profit || 0),
      0
    );

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.status?.toLowerCase() === "pending"
    ).length;

    const totalApprovedResellers = resellers.filter(
      (reseller) => reseller.status === "approved"
    ).length;

    const pendingResellers = resellers.filter(
      (reseller) => reseller.status === "pending"
    ).length;

    return {
      totalSales,
      totalResellerProfit,
      totalOrders,
      pendingOrders,
      totalApprovedResellers,
      pendingResellers,
    };
  }, [orders, resellers]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard ยอดขาย</h1>
        <p className="mt-1 text-slate-500">
          หน้าแรกหลัง Admin Login แสดงข้อมูลสรุปภาพรวมของระบบ
        </p>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="ยอดขายรวม (บาท)"
          value={
            loading
              ? "..."
              : `฿${dashboardSummary.totalSales.toLocaleString()}`
          }
          subtitle="ผลรวมยอดทุกออเดอร์ในระบบ"
        />

        <DashboardCard
          title="กำไรรวมที่จ่ายตัวแทน (บาท)"
          value={
            loading
              ? "..."
              : `฿${dashboardSummary.totalResellerProfit.toLocaleString()}`
          }
          subtitle="ผลรวมกำไรตัวแทนจากทุกออเดอร์"
        />

        <DashboardCard
          title="จำนวนออเดอร์ทั้งหมด"
          value={loading ? "..." : dashboardSummary.totalOrders.toLocaleString()}
          subtitle="นับทุกออเดอร์ในระบบ"
        />

        <DashboardCard
          title="ออเดอร์รอดำเนินการ"
          value={loading ? "..." : dashboardSummary.pendingOrders.toLocaleString()}
          subtitle="ออเดอร์ที่ยังไม่ได้จัดส่ง"
        />

        <DashboardCard
          title="จำนวนตัวแทนที่อนุมัติแล้ว"
          value={
            loading
              ? "..."
              : dashboardSummary.totalApprovedResellers.toLocaleString()
          }
          subtitle="นับเฉพาะตัวแทนที่อนุมัติแล้ว"
        />

        <DashboardCard
          title="ตัวแทนรออนุมัติ"
          value={loading ? "..." : dashboardSummary.pendingResellers.toLocaleString()}
          subtitle="จำนวนที่ยังรอการตรวจสอบ"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-800">ออเดอร์ล่าสุด</h2>
          <p className="mt-1 text-sm text-slate-500">
            แสดง 5 ออเดอร์ล่าสุดจากระบบ
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
                  Shop ID
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  สถานะ
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  ยอดรวม
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  วันที่สั่ง
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-sm text-slate-500"
                  >
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-sm text-slate-500"
                  >
                    ไม่พบข้อมูลออเดอร์
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-slate-100">
                    <td className="px-5 py-4 text-sm font-medium text-slate-800">
                      {order.order_number || `ORD-${order.id}`}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {order.shop_id}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      ฿{Number(order.total_amount).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {new Date(order.created_at).toLocaleString("th-TH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}