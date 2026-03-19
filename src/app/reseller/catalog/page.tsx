"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token") || "";
        if (!token) {
          throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        }

        const data = await getProducts(token);

        if (!isMounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;

        const message =
          err instanceof Error ? err.message : "ไม่สามารถโหลด catalog ได้";
        setError(message);
        console.error("Load catalog error:", err);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (value?: number | string | null) => {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number.isNaN(amount) ? 0 : amount);
  };

  const getProductImage = (productId: number | string) => {
    return `/placeholder-product.png`;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="h-40 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-5 w-1/2 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold text-slate-800">Clothing Catalog</h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-lg font-semibold text-red-700">
            โหลดข้อมูลไม่สำเร็จ
          </h2>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Clothing Catalog</h1>
        <p className="mt-1 text-sm text-slate-500">
          รายการสินค้าหลักของระบบสำหรับ reseller
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const productId = Number((product as { id?: number | string }).id ?? 0);
            const productName =
              (product as { name?: string; product_name?: string }).name ||
              (product as { name?: string; product_name?: string }).product_name ||
              `Product #${productId}`;

            const price =
              Number(
                (product as {
                  price?: number | string;
                  min_price?: number | string;
                  selling_price?: number | string;
                }).price ??
                  (product as {
                    price?: number | string;
                    min_price?: number | string;
                    selling_price?: number | string;
                  }).min_price ??
                  (product as {
                    price?: number | string;
                    min_price?: number | string;
                    selling_price?: number | string;
                  }).selling_price ??
                  0
              ) || 0;

            const stock =
              Number(
                (product as { stock?: number | string; quantity?: number | string })
                  .stock ??
                  (product as { stock?: number | string; quantity?: number | string })
                    .quantity ??
                  0
              ) || 0;

            return (
              <Link
                key={productId}
                href={`/reseller/my-products?productId=${productId}`}
                className="group"
              >
                <div className="relative cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
                  <img
                    src={getProductImage(productId)}
                    alt={productName}
                    className="h-40 w-full rounded object-cover"
                  />

                  <h2 className="mt-3 font-semibold text-slate-800">
                    {productName}
                  </h2>

                  <p className="font-bold text-green-600">
                    {formatCurrency(price)}
                  </p>

                  <p className="text-sm text-gray-500">Stock left: {stock}</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Product ID: {productId}
                  </p>

                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/80 text-white opacity-0 transition group-hover:opacity-100">
                    <p className="text-lg font-bold">{productName}</p>
                    <p className="mt-1">Price: {formatCurrency(price)}</p>
                    <p className="mt-1">Stock left: {stock}</p>
                    <p className="mt-3 text-sm text-slate-200">
                      ไปจัดการใน My Products
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          ยังไม่มีสินค้าใน catalog
        </div>
      )}
    </div>
  );
}