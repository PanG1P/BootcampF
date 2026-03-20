"use client";

import { useEffect, useState } from "react";
import {
  createShopProduct,
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
  isNew?: boolean;
};

export default function MyProductsPage() {
  const [products, setProducts] = useState<EditableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const getCurrentShopId = () => {
    return Number(localStorage.getItem("shopId") || "1");
  };

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        setInfo("");

        const token = localStorage.getItem("token") || "";
        const shopId = getCurrentShopId();

        if (!token) {
          throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        }

        if (!shopId || Number.isNaN(shopId)) {
          throw new Error("shopId ไม่ถูกต้อง");
        }

        const data = await getShopProducts(shopId, token);

        if (!isMounted) return;

        const mapped = (Array.isArray(data) ? data : []).map((item) => ({
          id: Number(item.id),
          shop_id: Number(item.shop_id),
          product_id: Number(item.product_id),
          product_name: item.product_name || `Product #${item.product_id}`,
          selling_price: Number(item.selling_price),
          quantity: Number(item.quantity ?? 0),
        }));

        setProducts(mapped);
      } catch (err) {
        if (!isMounted) return;

        const message =
          err instanceof Error
            ? err.message
            : "ไม่สามารถโหลดข้อมูลสินค้าได้";
        setError(message);
        console.error("Load my-products error:", err);
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

  const handleAdd = () => {
    const shopId = getCurrentShopId();

    if (!shopId || Number.isNaN(shopId)) {
      setError("shopId ไม่ถูกต้อง");
      return;
    }

    const tempId = -Date.now();

    const newRow: EditableRow = {
      id: tempId,
      shop_id: shopId,
      product_id: 0,
      product_name: "",
      selling_price: 0,
      quantity: 0,
      isNew: true,
    };

    setProducts((prev) => [newRow, ...prev]);
    setInfo("เพิ่มแถวใหม่แล้ว กรุณากรอก Product ID และราคา จากนั้นกด Save");
  };

  const handleChange = (
    id: number,
    field: keyof EditableRow,
    value: string | number
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            [field]:
              field === "product_id" ||
                field === "selling_price" ||
                field === "quantity" ||
                field === "shop_id"
                ? Number(value)
                : value,
          }
          : p
      )
    );
  };

  const handleSave = async (product: EditableRow) => {
    try {
      setSavingId(product.id);
      setError("");
      setInfo("");

      const token = localStorage.getItem("token") || "";

      if (!token) {
        throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
      }

      if (!product.shop_id || Number.isNaN(product.shop_id)) {
        throw new Error("shop_id ไม่ถูกต้อง");
      }

      if (!product.product_id || Number.isNaN(product.product_id)) {
        throw new Error("กรุณากรอก Product ID ให้ถูกต้อง");
      }

      if (product.selling_price < 0) {
        throw new Error("ราคาต้องไม่ติดลบ");
      }

      const payload: ShopProductPayload = {
        shop_id: product.shop_id,
        product_id: product.product_id,
        selling_price: product.selling_price,
      };

      if (product.isNew || product.id < 0) {
        const created = await createShopProduct(payload, token);

        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? {
                id: Number(created.id),
                shop_id: Number(created.shop_id),
                product_id: Number(created.product_id),
                product_name:
                  created.product_name || `Product #${created.product_id}`,
                selling_price: Number(created.selling_price),
                quantity: Number(created.quantity ?? 0),
                isNew: false,
              }
              : p
          )
        );

        setInfo("เพิ่มสินค้าเข้าร้านสำเร็จ");
        return;
      }

      const updated = await updateShopProduct(product.id, payload, token);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
              id: Number(updated.id),
              shop_id: Number(updated.shop_id),
              product_id: Number(updated.product_id),
              product_name:
                updated.product_name || `Product #${updated.product_id}`,
              selling_price: Number(updated.selling_price),
              quantity: Number(updated.quantity ?? 0),
              isNew: false,
            }
            : p
        )
      );

      setInfo("บันทึกการแก้ไขสำเร็จ");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "ไม่สามารถบันทึกสินค้าได้";
      setError(message);
      console.error("Save shop product error:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (product: EditableRow) => {
    try {
      setDeletingId(product.id);
      setError("");
      setInfo("");

      const token = localStorage.getItem("token") || "";

      if (!token) {
        throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
      }

      if (product.id < 0 || product.isNew) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        setInfo("ลบแถวใหม่ออกแล้ว");
        return;
      }

      await deleteShopProduct(product.id, token);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setInfo("ลบสินค้าออกจากร้านสำเร็จ");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "ไม่สามารถลบสินค้าได้";
      setError(message);
      console.error("Delete shop product error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6 h-8 w-56 animate-pulse rounded bg-slate-200" />
        <div className="rounded-xl bg-white shadow">
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded bg-slate-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            จัดการสินค้าที่อยู่ในร้านของคุณ
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          + Add Product
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {info && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
          {info}
        </div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Product ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Selling Price (฿)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => {
                  const isSaving = savingId === product.id;
                  const isDeleting = deletingId === product.id;

                  return (
                    <tr key={product.id} className="border-t">
                      <td className="p-4">
                        <input
                          type="number"
                          value={product.product_id}
                          onChange={(e) =>
                            handleChange(
                              product.id,
                              "product_id",
                              Number(e.target.value)
                            )
                          }
                          className="w-full rounded border p-2 outline-none focus:border-blue-400"
                          placeholder="Product ID"
                        />
                      </td>

                      <td className="p-4 text-slate-700">
                        {product.product_name || "-"}
                      </td>

                      <td className="p-4">
                        <input
                          type="number"
                          value={product.selling_price}
                          onChange={(e) =>
                            handleChange(
                              product.id,
                              "selling_price",
                              Number(e.target.value)
                            )
                          }
                          className="w-28 rounded border p-2"
                          min={0}
                        />
                      </td>

                      <td className="p-4">
                        <input
                          type="number"
                          value={product.quantity}
                          className="w-24 rounded border p-2"
                          disabled
                        />
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleSave(product)}
                            disabled={isSaving || isDeleting}
                            className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isSaving ? "Saving..." : "Save"}
                          </button>

                          <button
                            onClick={() => handleDelete(product)}
                            disabled={isSaving || isDeleting}
                            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    ยังไม่มีสินค้าในร้าน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
