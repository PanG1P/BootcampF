"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts } from "@/services/product.service";
import { createShopProduct } from "@/services/shop-product.service";

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [shopId, setShopId] = useState<string>("1");

  // เก็บสถานะสินค้าที่กำลังถูก "แก้ไขก่อนเพิ่ม"
  const [addingProduct, setAddingProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";

        const storedShopId = localStorage.getItem("shopId") || "1";
        setShopId(storedShopId);

        if (!token) throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        const data = await getProducts(token);
        if (!isMounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;
        setError("ไม่สามารถโหลด catalog ได้");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  const startAdding = (product: any) => {
    setAddingProduct({
      id: product.id,
      product_name: product.name || product.product_name,
      selling_price: Number(product.price || product.min_price || 0),
      quantity: 1, 
      image_url: product.image_url || product.imageUrl || "",
    });
  };

  const handleConfirmAdd = async () => {
    if (!addingProduct) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token") || "";
      const shopId = Number(localStorage.getItem("shopId") || "1");

      const payload = {
        shop_id: shopId,
        product_id: Number(addingProduct.id),
        product_name: addingProduct.product_name,
        selling_price: Number(addingProduct.selling_price),
        quantity: Number(addingProduct.quantity),
      };
      await createShopProduct(payload, token);

      setSuccessMsg(`เพิ่ม "${payload.product_name}" และตัดสต็อกกลางเรียบร้อย!`);
      setAddingProduct(null); 
      setTimeout(() => setSuccessMsg(""), 3000);

    } catch (err) {
      alert("ผิดพลาด: " + (err instanceof Error ? err.message : "เกิดข้อผิดพลาด"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 }).format(value);
  };

  if (loading) return <div className="p-6 text-center text-slate-500">กำลังโหลดรายการสินค้า...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Clothing Catalog</h1>
        <Link
          href={`/shop/${shopId}`}
          className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-700 transition-all"
        >
          ไปที่ร้านค้าของฉัน →
        </Link>
      </div>

      {successMsg && (
        <div className="fixed bottom-10 right-10 z-[60] bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
          {successMsg}
        </div>
      )}

      {/* --- Modal ฟอร์มแก้ไขก่อนเพิ่ม --- */}
      {addingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">ตั้งค่าก่อนเพิ่มเข้าร้าน</h2>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">ชื่อสินค้าในร้านของคุณ</label>
                <input
                  type="text"
                  value={addingProduct.product_name}
                  onChange={(e) => setAddingProduct({ ...addingProduct, product_name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">ราคาขาย (฿)</label>
                  <input
                    type="number"
                    value={addingProduct.selling_price}
                    onChange={(e) => setAddingProduct({ ...addingProduct, selling_price: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setAddingProduct(null)}
                className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-600 hover:bg-slate-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmAdd}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการเพิ่ม"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Catalog Grid --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          // 💡 1. เช็กสถานะสต็อก: ถ้าไม่มีค่า หรือ เป็น 0 ให้ถือว่าหมด
          const isOutOfStock = Number(product.stock || 0) <= 0;

          return (
            <div
              key={product.id}
              // 💡 2. ถ้าของหมด ให้ปิดการคลิกที่ Card ทั้งใบ
              onClick={() => !isOutOfStock && startAdding(product)}
              className={`group flex flex-col rounded-2xl border bg-white p-4 transition-all 
                ${isOutOfStock
                  ? 'cursor-not-allowed border-slate-100 opacity-60' // ของหมด: จางลง + เปลียนเมาส์
                  : 'cursor-pointer border-slate-200 hover:border-blue-500 hover:shadow-xl' // มีของ: สว่าง + Hover ได้
                }`}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white border-b border-slate-100">

                {/* 💡 3. ปรับป้าย Badge: ถ้าหมดให้เป็นสีแดง "สินค้าหมด" */}
                <div className={`absolute top-3 left-3 z-10 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider shadow-md transition-colors
                  ${isOutOfStock
                    ? 'bg-red-600 text-white'
                    : 'bg-black/70 backdrop-blur-sm text-white'
                  }`}>
                  {isOutOfStock ? 'สินค้าหมด' : `เหลือ ${product.stock} ชิ้น`}
                </div>

                <img
                  src={
                    product.image_url?.startsWith('http') || product.image_url?.startsWith('data:image')
                      ? product.image_url
                      : "/placeholder-product.png"
                  }
                  // 💡 4. ถ้าของหมด ให้รูปเป็นสีขาวดำ (Grayscale)
                  className={`absolute inset-0 h-full w-full object-contain p-4 transition-transform
                    ${isOutOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
                  alt={product.name}
                />
              </div>

              <div className="mt-4 flex-1 space-y-1">
                <h2 className={`font-bold line-clamp-1 transition-colors ${isOutOfStock ? 'text-slate-400' : 'text-slate-800 group-hover:text-blue-600'}`}>
                  {product.name || product.product_name}
                </h2>
                <p className={`text-lg font-black ${isOutOfStock ? 'text-slate-300' : 'text-green-600'}`}>
                  {formatCurrency(Number(product.price || product.min_price || 0))}
                </p>
                <p className="text-xs text-slate-400">ID: {product.id}</p>
              </div>

              {/* 💡 5. ปรับปุ่ม: ถ้าหมดให้ปุ่มเป็นสีเทาและกดไม่ได้ (Disabled) */}
              <button
                disabled={isOutOfStock}
                className={`mt-4 w-full rounded-xl py-3 text-sm font-bold shadow-md transition-all
                  ${isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                  }`}
              >
                {isOutOfStock ? 'ไม่สามารถเพิ่มได้' : '+ เลือกเพิ่มสินค้า'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}