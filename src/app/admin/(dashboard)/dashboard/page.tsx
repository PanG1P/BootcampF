"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardCard from "@/components/admin/DashboardCard";
import DashboardStatBadge from "@/components/admin/Dashboardstatbadge";
import type { Order } from "@/types/order";
import type { Reseller } from "@/types/reseller";
import { getOrders } from "@/services/order.service";
import { getResellers } from "@/services/reseller.service";

function getStatusBadge(status: string) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "pending") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
        รอดำเนินการ
      </span>
    );
  }

  if (normalized === "shipped") {
    return (
      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-200">
        จัดส่งแล้ว
      </span>
    );
  }

  if (normalized === "completed") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800 ring-1 ring-inset ring-green-200">
        เสร็จสมบูรณ์
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
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

      const [ordersResponse, resellersResponse] = await Promise.all([
        getOrders(token, 0, 1000),
        getResellers(token),
      ]);

      setOrders(ordersResponse.content ?? []);
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
      (order) => (order.status || "").toLowerCase() === "pending"
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
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <section className="flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Admin Console
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">Dashboard ยอดขาย</h1>
          <p className="mt-1 text-sm text-slate-400">
            ข้อมูลสรุปภาพรวมของระบบ
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 transition hover:bg-slate-50 active:scale-95"
        >
          <RefreshIcon />
          รีเฟรช
        </button>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* KPI Cards — top row */}
      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <DashboardCard
          title="ยอดขายรวม"
          value={loading ? "..." : `฿${dashboardSummary.totalSales.toLocaleString()}`}
          subtitle="ผลรวมยอดทุกออเดอร์"
          accent="green"
          // trend="+12.4%"
        />
        <DashboardCard
          title="กำไรจ่ายตัวแทน"
          value={loading ? "..." : `฿${dashboardSummary.totalResellerProfit.toLocaleString()}`}
          subtitle="ผลรวมกำไรตัวแทน"
          accent="blue"
          // trend="+8.1%"
        />
        <DashboardCard
          title="ออเดอร์ทั้งหมด"
          value={loading ? "..." : dashboardSummary.totalOrders.toLocaleString()}
          subtitle="นับทุกออเดอร์ในระบบ"
          accent="amber"
          // trend="+5.3%"
        />
      </section>

      {/* Stat Badges — bottom row */}
      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <DashboardStatBadge
          label="ออเดอร์รอดำเนินการ"
          value={loading ? "..." : dashboardSummary.pendingOrders.toLocaleString()}
          variant="warning"
          icon="clock"
        />
        <DashboardStatBadge
          label="ตัวแทนที่อนุมัติแล้ว"
          value={loading ? "..." : dashboardSummary.totalApprovedResellers.toLocaleString()}
          variant="success"
          icon="check"
        />
        <DashboardStatBadge
          label="ตัวแทนรออนุมัติ"
          value={loading ? "..." : dashboardSummary.pendingResellers.toLocaleString()}
          variant="danger"
          icon="alert"
        />
      </section>

      {/* Recent Orders Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">ออเดอร์ล่าสุด</h2>
            <p className="mt-0.5 text-xs text-slate-400">5 รายการล่าสุดในระบบ</p>
          </div>
          <a href="/admin/orders" className="text-xs font-medium text-blue-600 hover:underline">
            ดูทั้งหมด →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[20%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[22%]" />
            </colgroup>
            <thead className="bg-slate-50">
              <tr>
                {["เลขออเดอร์", "Shop ID", "สถานะ", "ยอดรวม", "วันที่สั่ง"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-xs font-medium uppercase tracking-wider text-slate-400 ${
                      i >= 3 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">
                    <span className="animate-pulse">กำลังโหลดข้อมูล...</span>
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">
                    ไม่พบข้อมูลออเดอร์
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-slate-100 transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                      {order.order_number || `ORD-${order.id}`}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-500">
                      {order.shop_id}
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm font-medium text-slate-800">
                      ฿{Number(order.total_amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-slate-400">
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

function RefreshIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.5 2.5v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}