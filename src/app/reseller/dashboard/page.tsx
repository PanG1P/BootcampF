"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardCard from "@/components/reseller/DashboardCard";
import { getDashboardSummary } from "@/services/dashboard.service";
import { getOrdersByShopId } from "@/services/order.service";
import type { DashboardSummary } from "@/types/dashboard";
import type { Order } from "@/types/order";

export default function ResellerDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  const totalProductsSold = useMemo(() => {
    return orders.length;
  }, [orders]);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token") || "";
        const shopId = Number(localStorage.getItem("shopId") || "1");

        if (!token) {
          throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        }

        if (!shopId || Number.isNaN(shopId)) {
          throw new Error("shopId ไม่ถูกต้อง");
        }

        let summaryData: DashboardSummary | null = null;
        let ordersData: Order[] = [];

        try {
          summaryData = await getDashboardSummary(shopId, token);
        } catch (err) {
          console.warn("Dashboard summary not found, using default values.", err);
          summaryData = {
            shop_id: shopId,
            total_orders: 0,
            total_revenue: 0,
          };
        }

        try {
          const fetchedOrders = await getOrdersByShopId(shopId, token);
          ordersData = Array.isArray(fetchedOrders) ? fetchedOrders : [];
        } catch (err) {
          console.warn("Orders not found or failed to load.", err);
          ordersData = [];
        }

        if (!isMounted) return;

        setSummary(summaryData);
        setOrders(ordersData);
      } catch (err) {
        if (!isMounted) return;

        const message =
          err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูล dashboard ได้";
        setError(message);
        console.error("Load reseller dashboard error:", err);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusColor = (status: string) => {
    const normalized = status.toUpperCase();

    if (normalized === "PAID" || normalized === "COMPLETED") {
      return "text-green-600";
    }

    if (normalized === "PENDING") {
      return "text-yellow-600";
    }

    if (normalized === "SHIPPED" || normalized === "SHIPPING") {
      return "text-blue-600";
    }

    if (normalized === "DELIVERED") {
      return "text-indigo-600";
    }

    if (normalized === "CANCELLED") {
      return "text-red-600";
    }

    return "text-slate-600";
  };

  const formatCurrency = (value?: number | string | null) => {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number.isNaN(amount) ? 0 : amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <section>
          <div className="h-8 w-64 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded bg-slate-200" />
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-8 w-28 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-4 w-32 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <section>
          <h1 className="text-2xl font-bold text-slate-800">
            Reseller Dashboard
          </h1>
          <p className="mt-1 text-slate-500">
            Overview of your sales and orders
          </p>
        </section>

        <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-lg font-semibold text-red-700">โหลดข้อมูลไม่สำเร็จ</h2>
          <p className="mt-2 text-red-600">{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-800">
          Reseller Dashboard
        </h1>
        <p className="mt-1 text-slate-500">
          Overview of your sales and orders
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="My Orders"
          value={String(summary?.total_orders ?? 0)}
          subtitle="Total orders"
        />
        <DashboardCard
          title="Products Sold"
          value={String(totalProductsSold)}
          subtitle="Orders loaded"
        />
        <DashboardCard
          title="My Revenue"
          value={formatCurrency(summary?.total_revenue ?? 0)}
          subtitle="Revenue summary"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
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
                  Order Number
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  Status
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  Total
                </th>
                <th className="px-5 py-3 text-sm font-semibold text-slate-600">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {order.id}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {order.order_number || "-"}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium">
                      <span className={getStatusColor(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString("th-TH")
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    ยังไม่มีข้อมูลคำสั่งซื้อ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}