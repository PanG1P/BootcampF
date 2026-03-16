"use client";

import { useState } from "react";
import OrderTable from "@/components/admin/OrderTable";

// กำหนด type ของสินค้าแต่ละรายการในออเดอร์
type OrderItem = {
  productName: string;
  quantity: number;
  sellPrice: number;
  costPrice: number;
};

// กำหนด type ของออเดอร์ 1 รายการ
type Order = {
  id: string;
  resellerShop: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  orderDate: string;
  status: "รอดำเนินการ" | "จัดส่งแล้ว" | "เสร็จสมบูรณ์";
};

// mock data ข้อมูลจำลอง
const initialOrders: Order[] = [
  {
    id: "ORD-20260001",
    resellerShop: "Smile Dental Shop",
    customerName: "กิตติภพ",
    items: [
      { productName: "Dental Mirror", quantity: 2, sellPrice: 150, costPrice: 120 },
      { productName: "Disposable Gloves", quantity: 3, sellPrice: 300, costPrice: 220 },
    ],
    total: 1200,
    orderDate: "2026-03-15 10:30",
    status: "รอดำเนินการ",
  },
  {
    id: "ORD-20260002",
    resellerShop: "Bright Care Supplies",
    customerName: "สุภาวดี",
    items: [
      { productName: "Face Mask", quantity: 5, sellPrice: 120, costPrice: 90 },
    ],
    total: 600,
    orderDate: "2026-03-14 14:20",
    status: "จัดส่งแล้ว",
  },
  {
    id: "ORD-20260003",
    resellerShop: "Dental Pro Market",
    customerName: "อนันต์",
    items: [
      { productName: "Tooth Extraction Forceps", quantity: 1, sellPrice: 1000, costPrice: 850 },
    ],
    total: 1000,
    orderDate: "2026-03-13 09:00",
    status: "เสร็จสมบูรณ์",
  },
];

export default function AdminOrdersPage() {
  // state สำหรับเก็บข้อมูลออเดอร์ทั้งหมด
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // ฟังก์ชันคำนวณกำไรของออเดอร์
  // สูตร: (ราคาขาย - ราคาทุน) × จำนวน ของแต่ละ item แล้วรวมกัน
  const calculateProfit = (items: OrderItem[]) => {
    return items.reduce((sum, item) => {
      const itemProfit = (item.sellPrice - item.costPrice) * item.quantity;
      return sum + itemProfit;
    }, 0);
  };

  // ฟังก์ชันเปลี่ยนสถานะเป็น "จัดส่งแล้ว"
  // ใช้เมื่อ admin กดปุ่มจัดส่งแล้ว
  const handleMarkAsShipped = (id: string) => {
    const targetOrder = orders.find((order) => order.id === id);
    if (!targetOrder) return;

    const profit = calculateProfit(targetOrder.items);

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "จัดส่งแล้ว" } : order
      )
    );

    alert(
      `เปลี่ยนสถานะเป็น "จัดส่งแล้ว" เรียบร้อย\nระบบจะบวกกำไร ${profit.toLocaleString()} บาท เข้า Wallet ตัวแทน (mock)`
    );
  };

  // ฟังก์ชันเปลี่ยนสถานะเป็น "เสร็จสมบูรณ์"
  // ใช้ mock ว่าระบบหรือ admin กดปิดงานได้
  const handleCompleteOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "เสร็จสมบูรณ์" } : order
      )
    );

    alert(`ออเดอร์ ${id} เสร็จสมบูรณ์แล้ว (mock)`);
  };

  return (
    <div className="space-y-6">
      {/* ส่วนหัวของหน้า */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการออเดอร์</h1>
          <p className="mt-1 text-slate-500">
            แสดงออเดอร์ทั้งหมดจากทุกร้านตัวแทน และเปลี่ยนสถานะได้
          </p>
        </div>

        <button className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          ส่งออกข้อมูล
        </button>
      </section>

      {/* เรียกใช้ตารางออเดอร์ */}
      <OrderTable
        orders={orders}
        onMarkAsShipped={handleMarkAsShipped}
        onCompleteOrder={handleCompleteOrder}
      />
    </div>
  );
}