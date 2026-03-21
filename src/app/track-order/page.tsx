"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Home } from "lucide-react"; 
import {
  getOrderById,
  getOrderItems,
  getOrdersByShopId,
} from "@/services/order.service";
import type { Order, OrderItem } from "@/types/order";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
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

  // 🏠 ฟังก์ชันกดย้อนกลับไปหน้าร้านค้า
  const handleGoBackToShop = () => {
    const shopId = selectedOrder?.shop_id || localStorage.getItem("shopId");
    if (shopId) {
      router.push(`/shop?shopId=${shopId}`);
    } else {
      router.push("/"); 
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadOrders() {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token") || "";
        if (!token) throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");

        if (orderIdFromQuery) {
          const orderData = await getOrderById(orderIdFromQuery, token);
          if (!isMounted) return;
          setSelectedOrder(orderData);
          setOrders(orderData ? [orderData] : []);
          return;
        }

        const shopIdRaw = localStorage.getItem("shopId") || "";
        const shopId = Number(shopIdRaw);
        if (!shopId) throw new Error("ไม่พบข้อมูลร้านค้า");

        const ordersData = await getOrdersByShopId(shopId, token);
        if (!isMounted) return;
        const safeOrders = Array.isArray(ordersData) ? ordersData : [];
        setOrders(safeOrders);
        setSelectedOrder(safeOrders.length > 0 ? safeOrders[0] : null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadOrders();
    return () => { isMounted = false; };
  }, [orderIdFromQuery]);

  useEffect(() => {
    let isMounted = true;
    async function loadOrderDetail() {
      if (!selectedOrder?.id) return;
      try {
        setDetailLoading(true);
        const token = localStorage.getItem("token") || "";
        const orderItems = await getOrderItems(Number(selectedOrder.id), token);
        if (isMounted) setSelectedItems(Array.isArray(orderItems) ? orderItems : []);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setDetailLoading(false);
      }
    }
    loadOrderDetail();
    return () => { isMounted = false; };
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
    if (normalized === "PENDING" || normalized === "PREPARING") return "Preparing";
    if (normalized === "SHIPPING" || normalized === "SHIPPED") return "Shipping";
    if (normalized === "DELIVERED" || normalized === "COMPLETED") return "Delivered";
    return status;
  };

  const formatCurrency = (value?: string | number | null) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  if (loading) return <div className="p-20 text-center text-black font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        
        {/* --- 🏠 HEADER: ปุ่ม Home ใหญ่ ชิดซ้าย --- */}
        <div className="relative mb-12 flex items-center">
          <button
            onClick={handleGoBackToShop}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 text-gray-700 shadow-md transition hover:bg-gray-50 hover:text-black hover:shadow-lg active:scale-95"
          >
            <Home size={32} strokeWidth={2.5} />
            <span className="text-lg font-bold">กลับหน้าร้านค้า</span>
          </button>

          <h1 className="ml-auto text-4xl font-black text-black">
            Track Order
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 font-medium">
            {error}
          </div>
        )}

        {selectedOrder && (
          <div className="rounded-3xl bg-white p-8 shadow-xl border border-white">
            <div className="mb-8 flex flex-wrap justify-between items-start gap-4">
               <div>
                  <h2 className="text-2xl font-bold text-black mb-2">Order Status</h2>
                  <p className="text-gray-500">ID: {selectedOrder.id}</p>
               </div>
               <div className="text-right">
                  <p className="text-sm text-gray-400">Order Number</p>
                  <p className="font-mono font-bold text-black">{selectedOrder.order_number}</p>
               </div>
            </div>
            
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
              <p className="text-gray-600">สถานะ: <span className="font-bold text-blue-600">{getStatusLabel(selectedOrder.status)}</span></p>
              <p className="text-gray-600">ยอดรวม: <span className="font-bold text-black">{formatCurrency(selectedOrder.total_amount)}</span></p>
              <p className="text-gray-600">วันที่สั่ง: {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString("th-TH") : "-"}</p>
            </div>

            {/* --- Progress Steps --- */}
            <div className="mb-12 flex items-center justify-between px-2 relative">
              {["Preparing", "Shipping", "Delivered"].map((step, index) => {
                const stepNum = index + 1;
                const active = getStep(normalizedSelectedStatus) >= stepNum;
                return (
                  <div key={step} className="flex flex-1 flex-col items-center relative z-10">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full font-black text-white shadow-md transition-all ${active ? "bg-green-500 scale-110" : "bg-gray-300"}`}>
                      {stepNum}
                    </div>
                    <p className={`mt-3 text-sm font-bold ${active ? "text-green-600" : "text-gray-400"}`}>{step}</p>
                  </div>
                );
              })}
              {/* Line background */}
              <div className="absolute top-6 left-0 h-1 w-full bg-gray-200 -z-0" />
            </div>

            {/* --- Order Items Table --- */}
            <div className="mt-12">
              <h3 className="mb-5 text-xl font-bold text-black border-l-4 border-black pl-3">รายการสินค้า</h3>
              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="p-5 font-bold">Product</th>
                      <th className="p-5 font-bold text-center">Qty</th>
                      <th className="p-5 font-bold text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-black">
                    {selectedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-5 font-medium">Product ID: {item.product_id}</td>
                        <td className="p-5 text-center font-bold">{item.quantity}</td>
                        <td className="p-5 text-right font-bold">{formatCurrency(item.selling_price || item.cost_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold">Loading Application...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}