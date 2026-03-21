"use client";

import { useEffect, useState } from "react";
import {
  deleteShopProduct,
  getShopProducts,
  updateShopProduct,
} from "@/services/shop-product.service";

type EditableRow = {
  id: number;
  shop_id: number;
  product_id: number;
  product_name?: string;
  selling_price: number;
  quantity: number;
  image_url?: string;
  admin_stock?: number;
  min_price?: number; // 💡 เพิ่มสำหรับคำนวณกำไรและราคาขั้นต่ำ
};

export default function MyProductsPage() {
  const [products, setProducts] = useState<EditableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const getCurrentShopId = () => Number(localStorage.getItem("shopId") || "1");

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const shopId = getCurrentShopId();
        const data = await getShopProducts(shopId, token);

        if (!isMounted) return;

        const mapped = (Array.isArray(data) ? data : []).map((item) => {
          const i = item as any;
          const actualName = i.product_name || (i.product && i.product.name) || i.name || `Product #${i.product_id}`;

          return {
            id: Number(i.id),
            shop_id: Number(i.shop_id),
            product_id: Number(i.product_id),
            product_name: actualName,
            selling_price: Number(i.selling_price),
            quantity: Number(i.quantity ?? 0),
            image_url: i.product?.image_url || i.image_url || "",
            admin_stock: Number(i.product?.stock || 0),
            min_price: Number(i.product?.min_price || 0), // ดึงราคาต้นทุนมา
          };
        });

        setProducts(mapped);
      } catch (err) {
        if (isMounted) setError("ไม่สามารถโหลดข้อมูลสินค้าได้");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (id: number, field: keyof EditableRow, value: string | number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, [field]: ["selling_price", "quantity", "product_id"].includes(field) ? Number(value) : value }
          : p
      )
    );
  };

  const handleSave = async (product: EditableRow) => {
    try {
      setSavingId(product.id);
      const token = localStorage.getItem("token") || "";
      const payload: any = {
        shop_id: product.shop_id,
        product_id: product.product_id,
        selling_price: product.selling_price,
        quantity: product.quantity,
        product_name: product.product_name,
      };

      await updateShopProduct(product.id, payload, token);
      setInfo("บันทึกข้อมูลเรียบร้อยแล้ว");
      setEditingId(null);
      setTimeout(() => setInfo(""), 3000);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (product: EditableRow) => {
    if (!confirm(`ต้องการลบ "${product.product_name}" ออกจากร้านใช่หรือไม่?`)) return;
    try {
      setDeletingId(product.id);
      const token = localStorage.getItem("token") || "";
      await deleteShopProduct(product.id, token);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-6 text-center text-slate-500">กำลังโหลดสินค้าของคุณ...</div>;

  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">My Shop Inventory</h1>
        <p className="text-sm text-slate-500">จัดการรายละเอียดสินค้าและราคาขายของคุณ</p>
      </header>

      {info && <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm">{info}</div>}
      {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">{error}</div>}

      {/* --- เริ่มต้นตาราง List View --- */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

        {/* หัวตาราง (Table Header) */}
        <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
          <div className="col-span-4">สินค้า</div>
          <div className="col-span-2 text-center">ราคาขายขั้นต่ำ</div>
          <div className="col-span-2 text-center">ราคาขายของคุณ ⇅</div>
          <div className="col-span-2 text-center">กำไรโดยประมาณ</div>
          <div className="col-span-2 text-right">จัดการ</div>
        </div>

        {/* รายการสินค้า (Table Body) */}
        <div className="divide-y divide-slate-100">
          {products.map((product) => {
            const isEditing = editingId === product.id;
            const profit = product.selling_price - (product.min_price || 0); // คำนวณกำไร

            return (
              <div key={product.id} className="grid grid-cols-12 gap-4 px-8 py-5 items-center hover:bg-slate-50/50 transition-colors">

                {/* 1. คอลัมน์ รูป + ชื่อ */}
                <div className="col-span-4 flex items-center gap-4">
                  <div className="h-14 w-14 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={product.image_url?.startsWith('http') || product.image_url?.startsWith('data:image') ? product.image_url : "/placeholder-product.png"}
                      className="h-full w-full object-cover"
                      alt={product.product_name}
                    />
                  </div>
                  {/* ✅ เหลือแค่นี้ ชื่อจะถูกล็อคไว้ แก้ไขไม่ได้แล้ว */}
                  <div className="font-medium text-slate-800 line-clamp-2">{product.product_name}</div>
                </div>

                {/* 2. คอลัมน์ ราคาขั้นต่ำ (ทุน) */}
                <div className="col-span-2 text-center font-medium text-slate-500">
                  {product.min_price} บาท
                </div>

                {/* 3. คอลัมน์ ราคาขายของคุณ */}
                <div className="col-span-2 flex justify-center">
                  {isEditing ? (
                    <input
                      type="number"
                      value={product.selling_price}
                      onChange={(e) => handleChange(product.id, "selling_price", e.target.value)}
                      className="w-24 text-center bg-white border border-blue-300 rounded-lg p-2 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  ) : (
                    <div className="bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-full text-sm">
                      {product.selling_price} บาท
                    </div>
                  )}
                </div>

                {/* 4. คอลัมน์ กำไร */}
                <div className="col-span-2 flex justify-center">
                  <div className={`font-bold px-4 py-2 rounded-full text-sm ${profit >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {profit > 0 ? '+' : ''}{profit} บาท
                  </div>
                </div>

                {/* 5. คอลัมน์ จัดการ (ปุ่มแก้ไข/ลบ) */}
                <div className="col-span-2 flex justify-end gap-2">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(product)} disabled={savingId === product.id} className="p-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-2.5 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(product.id)} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>
                      </button>
                      <button onClick={() => handleDelete(product)} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-red-500 hover:text-red-500 transition-all shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}