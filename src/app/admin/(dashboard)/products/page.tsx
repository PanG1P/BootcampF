"use client";

import { useState } from "react";
import ProductTable from "@/components/admin/ProductTable";
import ProductForm from "@/components/admin/ProductForm";

type Product = {
  id: number;
  image: string;
  name: string;
  costPrice: number;
  minPrice: number;
  stock: number;
  description?: string;
};

const initialProducts: Product[] = [
  {
    id: 1,
    image: "https://via.placeholder.com/80?text=P1",
    name: "Dental Mirror",
    costPrice: 120,
    minPrice: 150,
    stock: 45,
    description: "อุปกรณ์ตรวจในช่องปาก",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/80?text=P2",
    name: "Tooth Extraction Forceps",
    costPrice: 850,
    minPrice: 1000,
    stock: 12,
    description: "คีมถอนฟัน",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/80?text=P3",
    name: "Disposable Gloves",
    costPrice: 220,
    minPrice: 300,
    stock: 100,
    description: "ถุงมือใช้แล้วทิ้ง",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/80?text=P4",
    name: "Face Mask",
    costPrice: 90,
    minPrice: 120,
    stock: 0,
    description: "หน้ากากอนามัย",
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    setIsOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("ต้องการลบสินค้านี้หรือไม่?");
    if (!confirmed) return;

    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการสินค้า</h1>
          <p className="mt-1 text-slate-500">
            แสดงรายการสินค้าทั้งหมดในระบบ
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + เพิ่มสินค้า
        </button>
      </section>

      <ProductTable
        products={products}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] overflow-y-auto">
            <ProductForm
              mode={mode}
              initialData={
                selectedProduct
                  ? {
                      name: selectedProduct.name,
                      description: selectedProduct.description || "",
                      costPrice: selectedProduct.costPrice,
                      minPrice: selectedProduct.minPrice,
                      stockQty: selectedProduct.stock,
                      imageUrl: selectedProduct.image,
                    }
                  : undefined
              }
              onClose={closeModal}
              onSubmitSuccess={(payload) => {
                if (mode === "add") {
                  const newProduct: Product = {
                    id: Date.now(),
                    image: payload.image
                      ? URL.createObjectURL(payload.image)
                      : "https://via.placeholder.com/80?text=New",
                    name: payload.name,
                    costPrice: payload.costPrice,
                    minPrice: payload.minPrice,
                    stock: payload.stockQty,
                    description: payload.description,
                  };

                  setProducts((prev) => [newProduct, ...prev]);
                } else if (selectedProduct) {
                  setProducts((prev) =>
                    prev.map((item) =>
                      item.id === selectedProduct.id
                        ? {
                            ...item,
                            name: payload.name,
                            costPrice: payload.costPrice,
                            minPrice: payload.minPrice,
                            stock: payload.stockQty,
                            description: payload.description,
                            image: payload.image
                              ? URL.createObjectURL(payload.image)
                              : item.image,
                          }
                        : item
                    )
                  );
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}