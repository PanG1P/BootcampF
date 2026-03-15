"use client";

import { useState, ChangeEvent, FormEvent } from "react";

type ProductFormData = {
  name: string;
  image: File | null;
  description: string;
  costPrice: string;
  minPrice: string;
  stockQty: string;
};

type ProductFormProps = {
  mode: "add" | "edit";
  initialData?: {
    name?: string;
    description?: string;
    costPrice?: number;
    minPrice?: number;
    stockQty?: number;
    imageUrl?: string;
  };
  onClose: () => void;
  onSubmitSuccess?: (payload: {
    name: string;
    image: File | null;
    description: string;
    costPrice: number;
    minPrice: number;
    stockQty: number;
  }) => void;
};

export default function ProductForm({
  mode,
  initialData,
  onClose,
  onSubmitSuccess,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>({
    name: initialData?.name || "",
    image: null,
    description: initialData?.description || "",
    costPrice: initialData?.costPrice?.toString() || "",
    minPrice: initialData?.minPrice?.toString() || "",
    stockQty: initialData?.stockQty?.toString() || "",
  });

  const [preview, setPreview] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setForm((prev) => ({ ...prev, image: null }));
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "อัปโหลดได้เฉพาะไฟล์ JPG หรือ PNG",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "ไฟล์รูปต้องมีขนาดไม่เกิน 5MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อสินค้า";
    }

    if (mode === "add" && !form.image) {
      newErrors.image = "กรุณาอัปโหลดรูปสินค้า";
    }

    const costPrice = Number(form.costPrice);
    const minPrice = Number(form.minPrice);
    const stockQty = Number(form.stockQty);

    if (!form.costPrice || isNaN(costPrice) || costPrice <= 0) {
      newErrors.costPrice = "ราคาทุนต้องมากกว่า 0";
    }

    if (!form.minPrice || isNaN(minPrice) || minPrice < costPrice) {
      newErrors.minPrice = "ราคาขั้นต่ำต้องมากกว่าหรือเท่ากับราคาทุน";
    }

    if (form.stockQty === "" || isNaN(stockQty) || stockQty < 0) {
      newErrors.stockQty = "จำนวนสต็อกต้องมากกว่าหรือเท่ากับ 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: form.name,
      image: form.image,
      description: form.description,
      costPrice: Number(form.costPrice),
      minPrice: Number(form.minPrice),
      stockQty: Number(form.stockQty),
    };

    console.log("submit product:", payload);

    onSubmitSuccess?.(payload);
    alert(mode === "add" ? "เพิ่มสินค้าเรียบร้อย (mock)" : "แก้ไขสินค้าเรียบร้อย (mock)");
    onClose();
  };

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {mode === "add" ? "เพิ่มสินค้า" : "แก้ไขสินค้า"}
        </h1>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium">ชื่อสินค้า *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
            placeholder="กรอกชื่อสินค้า"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            รูปสินค้า {mode === "add" ? "*" : ""}
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
            className="block w-full rounded-xl border p-3"
          />
          <p className="mt-1 text-xs text-gray-500">
            รองรับไฟล์ JPG/PNG ขนาดไม่เกิน 5MB
          </p>
          {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-3 h-40 w-40 rounded-xl border object-cover"
            />
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">รายละเอียด</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
            placeholder="รายละเอียดสินค้า"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">ราคาทุน *</label>
            <input
              type="number"
              name="costPrice"
              value={form.costPrice}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              placeholder="0"
            />
            {errors.costPrice && (
              <p className="mt-1 text-sm text-red-500">{errors.costPrice}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">ราคาขั้นต่ำ *</label>
            <input
              type="number"
              name="minPrice"
              value={form.minPrice}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              placeholder="0"
            />
            {errors.minPrice && (
              <p className="mt-1 text-sm text-red-500">{errors.minPrice}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">จำนวนสต็อก *</label>
            <input
              type="number"
              name="stockQty"
              value={form.stockQty}
              onChange={handleChange}
              className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
              placeholder="0"
            />
            {errors.stockQty && (
              <p className="mt-1 text-sm text-red-500">{errors.stockQty}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-xl bg-black px-5 py-3 text-white"
          >
            {mode === "add" ? "บันทึกสินค้า" : "อัปเดตสินค้า"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-5 py-3"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}