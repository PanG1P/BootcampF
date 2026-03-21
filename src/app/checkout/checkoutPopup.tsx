"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrder, createOrderItem } from "@/services/order.service";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    shopId: number;
  };
}

export default function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const subtotal = useMemo(() => (product?.price || 0) * quantity, [product, quantity]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency", currency: "THB", minimumFractionDigits: 0,
    }).format(value);
  };

  if (!isOpen || !product) return null;

  const handleOrder = async () => {
        try {
        setLoading(true);
        setError("");
        setInfo("");

        const token = localStorage.getItem("token") || "";
        if (!token) throw new Error("กรุณาเข้าสู่ระบบก่อนสั่งซื้อ");
        if (!name || !phone || !address) throw new Error("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
        if (quantity <= 0) throw new Error("จำนวนสินค้าต้องมากกว่า 0");

        setInfo("กำลังบันทึกคำสั่งซื้อ...");

        const createdOrder = await createOrder({
            shop_id: product.shopId,
            total_amount: subtotal,
            reseller_profit: 0,
            status: "PENDING",
        }, token);

        await createOrderItem({
            order_id: createdOrder.id,
            product_id: product.id,
            cost_price: product.price,
            selling_price: product.price,
            quantity: quantity,
        }, token);

        setInfo("กำลังตัดสต็อกสินค้า...");

        const stockRes = await fetch("http://localhost:8080/stock-deductions", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
            order_id: createdOrder.id,
            product_id: product.id, 
            quantity: quantity
            }),
        });

        if (!stockRes.ok) {
            let errorMsg = "ระบบตัดสต็อกขัดข้อง แต่บันทึกคำสั่งซื้อแล้ว";
            try {
            const errorData = await stockRes.json();
            errorMsg = errorData.message || errorMsg;
            } catch (e) {
            console.error("Stock API returned non-JSON response");
            }
            throw new Error(errorMsg);
        }

        setInfo("สั่งซื้อสำเร็จ! กำลังนำคุณไปยังหน้าติดตามสถานะ...");

        setTimeout(() => {
            router.push(`/track-order?orderId=${createdOrder.id}`);
            onClose();
        }, 1500);

        } catch (err: any) {
        setError(err.message);
        setInfo("");
        } finally {
        setLoading(false);
        }
    };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        
        <button onClick={onClose} className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-black transition">✕</button>

        <div className="p-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-800">ยืนยันการสั่งซื้อ</h1>
          
          {error && <div className="mb-4 rounded-xl bg-red-50 p-4 text-red-700 border border-red-100 font-medium">⚠️ {error}</div>}
          {info && <div className="mb-4 rounded-xl bg-blue-50 p-4 text-blue-700 border border-blue-100 font-medium animate-pulse">ℹ️ {info}</div>}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 text-black">
            <div className="space-y-5">
               <h2 className="text-xl font-semibold border-b pb-2">📍 ข้อมูลการจัดส่ง</h2>
               <div className="space-y-3">
                 <input type="text" placeholder="ชื่อ-นามสกุล" className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-black outline-none transition" value={name} onChange={(e)=>setName(e.target.value)} />
                 <input type="text" placeholder="เบอร์โทรศัพท์" className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-black outline-none transition" value={phone} onChange={(e)=>setPhone(e.target.value)} />
                 <textarea placeholder="ที่อยู่จัดส่งโดยละเอียด" className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-black outline-none transition" rows={3} value={address} onChange={(e)=>setAddress(e.target.value)} />
               </div>
               
               <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                  <span className="font-medium">จำนวนสินค้า:</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full border bg-white">-</button>
                    <input type="number" min="1" value={quantity} onChange={(e)=>setQuantity(Math.max(1, Number(e.target.value)))} className="w-16 text-center bg-transparent font-bold" />
                    <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 rounded-full border bg-white">+</button>
                  </div>
               </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6 border border-slate-100 flex flex-col">
               <h2 className="mb-4 text-xl font-semibold border-b border-slate-200 pb-2">🧾 สรุปคำสั่งซื้อ</h2>
               <div className="flex-1 space-y-3">
                 <div className="flex justify-between">
                    <span className="text-gray-600">{product.name} (x{quantity})</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                 </div>
               </div>
               
               <hr className="my-4 border-dashed border-gray-300"/>

               <div className="flex justify-between items-end mb-6">
                  <span className="text-lg font-bold">ยอดรวมสุทธิ</span>
                  <span className="text-3xl font-extrabold text-green-600">{formatCurrency(subtotal)}</span>
               </div>

               <button 
                 onClick={handleOrder} 
                 disabled={loading} 
                 className={`w-full rounded-2xl py-4 text-white font-bold text-lg shadow-lg transition-all 
                   ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-slate-800 active:scale-[0.98]"}`}
               >
                 {loading ? "กำลังดำเนินการ..." : "ยืนยันชำระเงินตอนนี้"}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}