"use client";

import { useEffect, useState } from "react";
import { getShopBySlug } from "@/services/shop.service";
import { getPublicShopProducts } from "@/services/shop-product.service";
import type { ShopProduct } from "@/types/shop-product";
import CheckoutModal from "@/app/checkout/checkoutPopup"; 

type Shop = {
  id: number;
  user_id: number;
  shop_name: string;
  shop_slug: string;
  description?: string;
};

type ShopPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ShopPage({ params }: ShopPageProps) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const getProductImage = (url?: string | null) => {
    if (url && (url.startsWith("http") || url.startsWith("data:image"))) {
      return url;
    }
    return "/placeholder-product.png";
  };

  const handleOpenCheckout = (productItem: any) => {
    const stock = productItem.quantity ?? 0; // ดึงสต็อกของร้านค้า (shop_product)
    if (stock <= 0) return;

    setSelectedProduct({
      id: productItem.id,            // Shop Product ID
      name: productItem.product?.name || "ไม่ระบุชื่อสินค้า",
      price: Number(productItem.selling_price ?? 0),
      shopId: shop?.id,
      maxStock: stock,               // ส่งค่าสต็อกที่มีในร้านไปให้ Modal
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    let isMounted = true;
    async function loadShopAndProducts() {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const currentSlug = resolvedParams.slug;
        if (!isMounted) return;
        setSlug(currentSlug);

        const shopData = await getShopBySlug(currentSlug);
        if (!shopData) throw new Error("ไม่พบข้อมูลร้านค้า");
        if (!isMounted) return;
        setShop(shopData);

        setProductsLoading(true);
        const shopProducts = await getPublicShopProducts(Number(shopData.id));
        if (!isMounted) return;
        setProducts(Array.isArray(shopProducts) ? shopProducts : []);
      } catch (err) {
        if (!isMounted) return;
        setError("ไม่สามารถโหลดข้อมูลร้านค้าได้");
        console.error(err);
      } finally {
        if (!isMounted) return;
        setLoading(false);
        setProductsLoading(false);
      }
    }
    loadShopAndProducts();
    return () => {
      isMounted = false;
    };
  }, [params]);

  const formatCurrency = (value?: number | string | null) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(Number(value ?? 0));
  };

  if (loading) return <div className="p-10 text-center text-black font-medium">กำลังโหลดข้อมูลร้านค้า...</div>;
  if (error || !shop) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-500 font-bold text-xl mb-2">เกิดข้อผิดพลาด</div>
        <div className="text-gray-600">{error || "ไม่พบข้อมูลร้านค้า"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
          <p className="text-blue-600 font-semibold text-sm mb-1">Official Shop</p>
          <h1 className="text-3xl font-bold text-slate-800">🛍️ {shop.shop_name}</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            {shop.description || "ร้านค้านี้ยังไม่มีคำอธิบายอย่างเป็นทางการ"}
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">สินค้าทั้งหมด</h2>
            <span className="bg-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                {products.length} รายการ
            </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((productItem: any) => {
            const detail = productItem.product;
            const isOutOfStock = (productItem.quantity ?? 0) <= 0;

            return (
              <div
                key={productItem.id}
                onClick={() => handleOpenCheckout(productItem)}
                className={`group cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 ${
                  isOutOfStock ? "opacity-60 grayscale-[0.5]" : ""
                }`}
              >
                <div className="relative h-56 bg-gray-100">
                  {isOutOfStock && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 text-white font-bold backdrop-blur-[2px]">
                      สินค้าหมด
                    </div>
                  )}
                  <img
                    src={getProductImage(detail?.image_url)}
                    alt={detail?.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-black line-clamp-1">{detail?.name || "ไม่มีชื่อสินค้า"}</h3>
                  <p className="text-green-600 font-bold text-lg mt-1">
                    {formatCurrency(productItem.selling_price)}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">สต็อกคงเหลือ</p>
                    <p className={`text-xs font-bold ${productItem.quantity < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                        {productItem.quantity ?? 0} ชิ้น
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
      />
    </div>
  );
}