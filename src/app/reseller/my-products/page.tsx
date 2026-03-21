"use client";

import { useEffect, useState } from "react";
import {
  deleteShopProduct,
  getShopProducts,
  updateShopProduct,
} from "@/services/shop-product.service";
import type { ShopProductPayload } from "@/types/shop-product";

type EditableRow = {
  id: number;
  shop_id: number;
  product_id: number;
  product_name?: string;
  selling_price: number;
  quantity: number;
  image_url?: string;
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
          // ใช้ (item as any) เพื่อเลี่ยง Error ของ TypeScript ในกรณีที่ API Join ข้อมูลมา
          const i = item as any;

          // ดึงชื่อสินค้า: 
          // 1. ลองดึงจาก product_name (ที่ Reseller ตั้งเอง)
          // 2. ลองดึงจาก i.product.name (ชื่อดั้งเดิมจากตาราง products ที่ Join มา)
          // 3. ลองดึงจาก i.name (ถ้า API ส่งมาตรงๆ)
          const actualName = 
            i.product_name || 
            (i.product && i.product.name) || 
            i.name || 
            `Product #${i.product_id}`;

          return {
            id: Number(i.id),
            shop_id: Number(i.shop_id),
            product_id: Number(i.product_id),
            product_name: actualName, // <--- ชื่อจะถูกใส่ที่นี่
            selling_price: Number(i.selling_price),
            quantity: Number(i.quantity ?? 0),
            image_url: i.product?.image_url || i.image_url || "",
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

    // แก้ไขตรงนี้: ใช้ any เพื่อให้ส่ง quantity และ product_name ไปได้โดยไม่ติด Error
    const payload: any = {
      shop_id: product.shop_id,
      product_id: product.product_id,
      selling_price: product.selling_price,
      quantity: product.quantity,       // ส่งจำนวนสต็อก
      product_name: product.product_name, // ส่งชื่อสินค้า (ที่เราพิมพ์แก้)
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
        <p className="text-sm text-slate-500">จัดการรายละเอียดสินค้า ราคา และสต็อก</p>
      </header>

      {info && <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm">{info}</div>}
      {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const isEditing = editingId === product.id;
          return (
            <div key={product.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              {/* Product Image Area */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white border-b border-slate-100">
                <img
                  src={
                   product.image_url?.startsWith('http') || product.image_url?.startsWith('data:image')
                    ? product.image_url
                    : "/placeholder-product.png"
                }
                className="absolute inset-0 h-full w-full object-contain p-4 group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Details Area */}
              <div className="p-4 space-y-4">
                {/* Product Name Display/Input */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Product Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={product.product_name}
                      onChange={(e) => handleChange(product.id, "product_name", e.target.value)}
                      className="w-full bg-slate-50 border border-blue-300 rounded-lg p-2 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    />
                  ) : (
                    <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{product.product_name}</h3>
                  )}
                  <p className="text-[10px] text-slate-400">System ID: {product.product_id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Price (฿)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={product.selling_price}
                        onChange={(e) => handleChange(product.id, "selling_price", e.target.value)}
                        className="w-full bg-slate-50 border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none font-bold"
                      />
                    ) : (
                      <p className="text-xl font-black text-green-600">฿{product.selling_price.toLocaleString()}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Stock</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleChange(product.id, "quantity", e.target.value)}
                        className="w-full bg-slate-50 border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                      />
                    ) : (
                      <p className="text-xl font-bold text-slate-700">{product.quantity}</p>
                    )}
                  </div>
                </div>

                {/* Buttons Area */}
                <div className="pt-4 flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSave(product)}
                        disabled={savingId === product.id}
                        className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                      >
                        {savingId === product.id ? "Saving..." : "Save Change"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 bg-slate-100 text-slate-600 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingId(product.id)}
                        className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="px-3 border border-red-100 text-red-500 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}