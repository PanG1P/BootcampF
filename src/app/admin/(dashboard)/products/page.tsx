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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // loading = โหลดตาราง
  const [loading, setLoading] = useState(true);

  // submitting = กำลังส่งข้อมูลจาก form
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  // state กลางสำหรับ popup
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

  // เปิด modal สำหรับเพิ่มสินค้า
  const openAddModal = () => {
    setMode("add");
    setSelectedProduct(null);
    setIsOpen(true);
  };

  // เปิด modal สำหรับแก้ไขสินค้า
  const openEditModal = (product: Product) => {
    setMode("edit");
    setSelectedProduct(product);
    setIsOpen(true);
  };

  // ปิด modal และเคลียร์ค่าที่เลือกอยู่
  const closeModal = () => {
    if (submitting) return;
    setIsOpen(false);
    setSelectedProduct(null);
  };

  // ลบสินค้า โดยแสดง popup ยืนยันก่อน
  const handleDelete = async (id: number) => {
    setPopup({
      open: true,
      type: "confirm",
      title: "ยืนยันการลบสินค้า",
      message: "เมื่อกดลบแล้ว รายการสินค้านี้จะถูกลบออกจากระบบ",
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

          await deleteProduct(id, token);
          await loadProducts();

          setPopup({
            open: true,
            type: "success",
            title: "ลบสินค้าสำเร็จ",
            message: "รายการสินค้าถูกลบออกจากระบบแล้ว",
          });
        } catch (err) {
          setPopup({
            open: true,
            type: "error",
            title: "ลบสินค้าไม่สำเร็จ",
            message: err instanceof Error ? err.message : "เกิดข้อผิดพลาดบางอย่าง",
          });
        }
      },
    });
  };

  // submit form เพิ่ม / แก้ไขสินค้า
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

      // แปลงข้อมูลให้ตรงกับโครงสร้างที่ backend ต้องการ
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
        {/* ส่วนหัวของหน้า */}
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

        {/* แสดง error จากการโหลดข้อมูล */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ตารางสินค้า */}
        <ProductTable
          products={products}
          onEdit={openEditModal}
          onDelete={handleDelete}
          loading={loading}
        />

        {/* modal ฟอร์มเพิ่ม/แก้ไขสินค้า */}
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

      {/* popup กลางจอ */}
      <ActionPopup
        open={popup.open}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={closePopup}
        onConfirm={popup.onConfirm}
        confirmText="ลบสินค้า"
        cancelText="ยกเลิก"
      />
    </>
  );
}