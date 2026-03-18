"use client";

import { useEffect, useState } from "react";
import ProductTable from "@/components/admin/ProductTable";
import ProductForm from "@/components/admin/ProductForm";
import type { Product, ProductPayload } from "@/types/product";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/services/product.service";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const data = await getProducts(token);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดสินค้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setMode("add");
    setSelectedProduct(null);
    setIsOpen(true);
  };

  const openEditModal = (product: Product) => {
    setMode("edit");
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setIsOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("ต้องการลบสินค้านี้หรือไม่?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      await deleteProduct(id, token);
      await loadProducts();
      alert("ลบสินค้าสำเร็จ");
    } catch (err) {
      alert(err instanceof Error ? err.message : "ลบสินค้าไม่สำเร็จ");
    }
  };

  const handleSubmitProduct = async (payload: {
    name: string;
    description: string;
    imageUrl: string;
    costPrice: number;
    minPrice: number;
    stockQty: number;
  }) => {
    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      const requestBody: ProductPayload = {
        name: payload.name,
        description: payload.description,
        image_url: payload.imageUrl,
        cost_price: String(payload.costPrice),
        min_price: String(payload.minPrice),
        stock: payload.stockQty,
      };

      if (mode === "add") {
        await createProduct(requestBody, token);
        alert("เพิ่มสินค้าเรียบร้อย");
      } else if (selectedProduct) {
        await updateProduct(selectedProduct.id, requestBody, token);
        alert("แก้ไขสินค้าเรียบร้อย");
      }

      await loadProducts();
      closeModal();
    } catch (err) {
      alert(err instanceof Error ? err.message : "บันทึกสินค้าไม่สำเร็จ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการสินค้า</h1>
          <p className="mt-1 text-slate-500">แสดงรายการสินค้าทั้งหมดในระบบ</p>
        </div>

        <button
          onClick={openAddModal}
          disabled={loading}
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          + เพิ่มสินค้า
        </button>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <ProductTable
        products={products}
        onEdit={openEditModal}
        onDelete={handleDelete}
        loading={loading}
      />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] overflow-y-auto">
            <ProductForm
              key={selectedProduct?.id ?? "new"}
              mode={mode}
              initialData={
                selectedProduct
                  ? {
                    name: selectedProduct.name,
                    description: selectedProduct.description || "",
                    costPrice: Number(selectedProduct.cost_price),
                    minPrice: Number(selectedProduct.min_price),
                    stockQty: selectedProduct.stock,
                    imageUrl: selectedProduct.image_url,
                  }
                  : undefined
              }
              onClose={closeModal}
              onSubmitSuccess={handleSubmitProduct}
            />
          </div>
        </div>
      )}
    </div>
  );
}