"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  getOrderById,
  getOrderItems,
  getOrdersByShopId,
} from "@/services/order.service";
import type { Order, OrderItem } from "@/types/order";

// 💡 1. ย้าย Logic และ UI ทั้งหมดมาไว้ใน Component ย่อยนี้
function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orderIdFromQuery = Number(searchParams.get("orderId") || 0);

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizedSelectedStatus = useMemo(() => {
    return (selectedOrder?.status || "").toUpperCase();
  }, [selectedOrder]);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token") || "";
        if (!token) {
          throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        }

        // ✅ ถ้ามี orderId จาก checkout ให้โหลด order นี้ตรงๆ ก่อน
        if (orderIdFromQuery) {
          const orderData = await getOrderById(orderIdFromQuery, token);

          if (!isMounted) return;

          setSelectedOrder(orderData);
          setOrders(orderData ? [orderData] : []);
          return;
        }

        // ✅ fallback: ใช้ shopId เฉพาะตอนเข้า track-order แบบปกติ
        const shopIdRaw = localStorage.getItem("shopId") || "";
        const shopId = Number(shopIdRaw);

        if (!shopId || Number.isNaN(shopId)) {
          throw new Error("ไม่พบ shopId กรุณาตั้งค่า shopId ก่อนใช้งาน");
        }

        const ordersData = await getOrdersByShopId(shopId, token);

        if (!isMounted) return;

        const safeOrders = Array.isArray(ordersData) ? ordersData : [];
        setOrders(safeOrders);
        setSelectedOrder(safeOrders.length > 0 ? safeOrders[0] : null);
      } catch (err) {
        if (!isMounted) return;

        const message =
          err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลออเดอร์ได้";
        setError(message);
        console.error("Load track orders error:", err);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [orderIdFromQuery]);

  useEffect(() => {
    let isMounted = true;

    async function loadOrderDetail() {
      try {
        if (!selectedOrder) {
          setSelectedItems([]);
          return;
        }

        setDetailLoading(true);
        setError("");

        const token = localStorage.getItem("token") || "";
        if (!token) {
          throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        }

        const orderItems = await getOrderItems(Number(selectedOrder.id), token);

        if (!isMounted) return;
        setSelectedItems(Array.isArray(orderItems) ? orderItems : []);
      } catch (err) {
        if (!isMounted) return;

        const message =
          err instanceof Error
            ? err.message
            : "ไม่สามารถโหลดรายละเอียดออเดอร์ได้";
        setError(message);
        console.error("Load order detail error:", err);
      } finally {
        if (!isMounted) return;
        setDetailLoading(false);
      }
    }

    loadOrderDetail();

    return () => {
      isMounted = false;
    };
  }, [selectedOrder?.id]);

  const getStep = (status: string) => {
    const normalized = status.toUpperCase();

    if (normalized === "PENDING" || normalized === "PREPARING") return 1;
    if (normalized === "SHIPPING" || normalized === "SHIPPED") return 2;
    if (normalized === "DELIVERED" || normalized === "COMPLETED") return 3;

    return 0;
  };

  const getStatusLabel = (status: string) => {
    const normalized = status.toUpperCase();

    if (normalized === "PENDING" || normalized === "PREPARING") {
      return "Preparing";
    }
    if (normalized === "SHIPPING" || normalized === "SHIPPED") {
      return "Shipping";
    }
    if (normalized === "DELIVERED" || normalized === "COMPLETED") {
      return "Delivered";
    }

    return status;
  };

  const formatCurrency = (value?: string | number | null) => {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number.isNaN(amount) ? 0 : amount);
  };

  const steps = ["Preparing", "Shipping", "Delivered"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto mb-10 h-10 w-72 animate-pulse rounded bg-slate-200" />

          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 h-7 w-40 animate-pulse rounded bg-slate-200" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !selectedOrder && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-10 text-center text-4xl font-bold text-black">
            Track Your Order
          </h1>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-semibold text-red-700">
              โหลดข้อมูลไม่สำเร็จ
            </h2>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-10 text-center text-4xl font-bold text-black">
          Track Your Order
        </h1>

        {error && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            {error}
          </div>
        )}

        {orders.length > 1 && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-black">
              Your Orders
            </h2>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:bg-gray-50 hover:shadow ${
                    selectedOrder?.id === order.id
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-black">
                      {order.order_number || `Order #${order.id}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Order ID: {order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total: {formatCurrency(order.total_amount)}
                    </p>
                  </div>

                  <button className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedOrder && (
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-black">
              Order Status
            </h2>

            <div className="mb-8 space-y-2">
              <p className="text-black">
                Order Number:{" "}
                <span className="font-semibold">
                  {selectedOrder.order_number || "-"}
                </span>
              </p>

              <p className="text-gray-600">Order ID: {selectedOrder.id}</p>

              <p className="text-gray-600">
                Status:{" "}
                <span className="font-medium">
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </p>

              <p className="text-gray-600">
                Total: {formatCurrency(selectedOrder.total_amount)}
              </p>

              <p className="text-gray-600">
                Created At:{" "}
                {selectedOrder.created_at
                  ? new Date(selectedOrder.created_at).toLocaleString("th-TH")
                  : "-"}
              </p>
            </div>

            <div className="mb-10 flex items-center justify-between gap-2">
              {steps.map((step, index) => {
                const active = getStep(normalizedSelectedStatus) >= index + 1;

                return (
                  <div key={step} className="flex flex-1 flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white ${
                        active ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <p
                      className={`mt-2 text-sm font-medium ${
                        active ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {step}
                    </p>

                    {index !== steps.length - 1 && (
                      <div
                        className={`mt-3 h-1 w-full ${
                          getStep(normalizedSelectedStatus) >= index + 2
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold text-black">
                Order Items
              </h3>

              {detailLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-14 animate-pulse rounded bg-slate-100"
                    />
                  ))}
                </div>
              ) : selectedItems.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3">Product ID</th>
                        <th className="p-3">Quantity</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedItems.map((item) => {
                        const quantity = Number(item.quantity || 0);
                        const price = Number(
                          item.selling_price ?? item.cost_price ?? 0
                        );
                        const subtotal = quantity * price;

                        return (
                          <tr key={item.id} className="border-t">
                            <td className="p-3">{item.product_id}</td>
                            <td className="p-3">{quantity}</td>
                            <td className="p-3">{formatCurrency(price)}</td>
                            <td className="p-3">
                              {formatCurrency(subtotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                  ไม่พบรายการสินค้าในออเดอร์นี้
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 💡 2. Component หลัก ทำหน้าที่แค่ครอบ Suspense ให้ถูกต้อง
export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="text-xl font-semibold text-gray-500">
            Loading order tracking...
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}