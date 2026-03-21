"use client";

import { useEffect, useState } from "react";
import ProductTable from "@/components/admin/ProductTable";
import ProductForm from "@/components/admin/ProductForm";
import ActionPopup from "@/components/common/ActionPopup";
import type { Product, ProductPayload } from "@/types/product";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/services/product.service";

type PopupState = {
  open: boolean;
  type: "success" | "error" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
};

function getDeleteProductErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message.toLowerCase() : "";

  if (
    raw.includes("order_items") ||
    raw.includes("product_id") ||
    raw.includes("violates") ||
    raw.includes("constraint")
  ) {
    return "ไม่สามารถลบสินค้านี้ได้ เนื่องจากมีรายการสั่งซื้อที่อ้างอิงอยู่";
  }

  if (raw.includes("400")) {
    return "ลบสินค้าไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง";
  }

  if (raw.includes("404")) {
    return "ไม่พบสินค้าที่ต้องการลบ";
  }

  if (raw.includes("500")) {
    return "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
  }

  return "ลบสินค้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [popup, setPopup] = useState<PopupState>({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const closePopup = () => {
    setPopup({
      open: false,
      type: "success",
      title: "",
      message: "",
    });
  };

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

  const handleDelete = async (product: Product) => {
    setPopup({
      open: true,
      type: "confirm",
      title: "ยืนยันการลบสินค้า",
      message: `คุณต้องการลบสินค้า "${product.name}" ใช่หรือไม่?`,
      onConfirm: async () => {
        try {
          closePopup();

          const token = localStorage.getItem("token");
          if (!token) {
            setPopup({
              open: true,
              type: "error",
              title: "ไม่พบสิทธิ์การใช้งาน",
              message: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
            });
            return;
          }

          await deleteProduct(product.id, token);
          await loadProducts();

          setPopup({
            open: true,
            type: "success",
            title: "ลบสินค้าสำเร็จ",
            message: `สินค้า "${product.name}" ถูกลบเรียบร้อยแล้ว`,
          });
        } catch (err) {
          setPopup({
            open: true,
            type: "error",
            title: "ลบสินค้าไม่สำเร็จ",
            message: getDeleteProductErrorMessage(err),
          });
        }
      },
    });
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
        setPopup({
          open: true,
          type: "error",
          title: "ไม่พบสิทธิ์การใช้งาน",
          message: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
        });
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

        setPopup({
          open: true,
          type: "success",
          title: "เพิ่มสินค้าสำเร็จ",
          message: "ระบบได้บันทึกสินค้าใหม่เรียบร้อยแล้ว",
        });
      } else if (selectedProduct) {
        await updateProduct(selectedProduct.id, requestBody, token);

        setPopup({
          open: true,
          type: "success",
          title: "แก้ไขสินค้าสำเร็จ",
          message: "ข้อมูลสินค้าถูกอัปเดตเรียบร้อยแล้ว",
        });
      }

      await loadProducts();
      closeModal();
    } catch (err) {
      setPopup({
        open: true,
        type: "error",
        title: "บันทึกสินค้าไม่สำเร็จ",
        message: err instanceof Error ? err.message : "เกิดข้อผิดพลาดบางอย่าง",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">จัดการสินค้า</h1>
            <p className="mt-1 text-sm text-slate-500">
              แสดงรายการสินค้าทั้งหมดในระบบ พร้อมเพิ่ม แก้ไข และลบข้อมูล
            </p>
          </div>

          <button
            onClick={openAddModal}
            disabled={loading}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
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

      <ActionPopup
        open={popup.open}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
        onConfirm={popup.onConfirm}
        confirmText={popup.type === "confirm" ? "ลบสินค้า" : "ตกลง"}
        cancelText={popup.type === "confirm" ? "ยกเลิก" : undefined}
      />
    </>
  );
}