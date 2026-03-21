"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getShopBySlug } from "@/services/shop.service";
import { getPublicShopProducts } from "@/services/shop-product.service";
import type { ShopProduct } from "@/types/shop-product";

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

  useEffect(() => {
    let isMounted = true;

    async function loadShopAndProducts() {
      try {
        setLoading(true);
        setError("");

        const resolvedParams = await params;
        const currentSlug = resolvedParams.slug;

        if (!isMounted) return;
        setSlug(currentSlug);

        const shopData = await getShopBySlug(currentSlug);

        if (!shopData) {
          throw new Error("ไม่พบข้อมูลร้านค้า");
        }

        if (!isMounted) return;
        setShop(shopData);

        setProductsLoading(true);

        const shopProducts = await getPublicShopProducts(Number(shopData.id));

        if (!isMounted) return;
        setProducts(Array.isArray(shopProducts) ? shopProducts : []);
      } catch (err) {
        if (!isMounted) return;
        setError("ไม่สามารถโหลดข้อมูลร้านค้าได้");
        console.error("Load shop error:", err);
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
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number.isNaN(amount) ? 0 : amount);
  };

  const getProductImage = (url?: string | null) => {
    if (url && (url.startsWith("http") || url.startsWith("data:image"))) {
      return url;
    }
    return "/placeholder-product.png";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="mb-4 h-10 w-64 rounded bg-gray-200" />
            <div className="mb-10 h-6 w-96 rounded bg-gray-200" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl bg-white shadow"
                >
                  <div className="h-56 bg-gray-200" />
                  <div className="p-4">
                    <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
                    <div className="mb-2 h-5 w-1/3 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-2xl font-bold text-red-700">ไม่พบร้านค้า</h1>
          <p className="mt-2 text-red-600">
            {error || "ไม่สามารถโหลดร้านจาก slug นี้ได้"}
          </p>
          <p className="mt-2 text-sm text-gray-600">slug: {slug || "-"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Shop</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-800">
            🛍️ {shop.shop_name}
          </h1>

          <p className="mt-2 text-sm text-slate-500">Slug: {shop.shop_slug}</p>

          <p className="mt-4 text-slate-600">
            {shop.description?.trim()
              ? shop.description
              : "ร้านค้านี้ยังไม่มีคำอธิบาย"}
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Shop Products</h2>

          <span className="rounded-full bg-slate-200 px-4 py-2 text-sm text-slate-700">
            {products.length} รายการ
          </span>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow"
              >
                <div className="h-56 animate-pulse bg-gray-200" />
                <div className="p-4">
                  <div className="mb-3 h-5 animate-pulse rounded bg-gray-200" />
                  <div className="mb-2 h-5 w-1/2 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((productItem) => {
              const productDetail = productItem.product;

              const name =
                productDetail?.name ||
                productItem.product_name ||
                "ไม่ระบุชื่อสินค้า";

              const price = Number(productItem.selling_price ?? 0);

              const stock = Number(
                productDetail?.stock ?? productItem.quantity ?? 0
              );

              const imageUrl =
                productDetail?.image_url ||
                productDetail?.imageUrl ||
                productDetail?.image ||
                productItem.image_url ||
                productItem.imageUrl ||
                productItem.image ||
                null;

              return (
                <Link
                  key={productItem.id}
                  href={`/checkout?id=${
                    productItem.product_id
                  }&name=${encodeURIComponent(name)}&price=${price}&shopId=${
                    shop.id
                  }`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-lg">
                    <img
                      src={getProductImage(imageUrl)}
                      alt={name}
                      className="h-56 w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{name}</h3>

                      <p className="font-bold text-green-600">
                        {formatCurrency(price)}
                      </p>

                      <p className="text-sm text-gray-500">Stock: {stock}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500">ร้านนี้ยังไม่มีสินค้า</div>
        )}
      </div>
    </div>
  );
}