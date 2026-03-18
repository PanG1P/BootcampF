"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";

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
    description: string;
    imageUrl: string;
    costPrice: number;
    minPrice: number;
    stockQty: number;
  }) => void;
};

type FormState = {
  name: string;
  description: string;
  costPrice: string;
  minPrice: string;
  stockQty: string;
  imageUrl: string;
};

function buildInitialForm(initialData?: ProductFormProps["initialData"]): FormState {
  return {
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    costPrice:
      initialData?.costPrice !== undefined ? String(initialData.costPrice) : "",
    minPrice:
      initialData?.minPrice !== undefined ? String(initialData.minPrice) : "",
    stockQty:
      initialData?.stockQty !== undefined ? String(initialData.stockQty) : "",
    imageUrl: initialData?.imageUrl ?? "",
  };
}

export default function ProductForm({
  mode,
  initialData,
  onClose,
  onSubmitSuccess,
}: ProductFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialForm(initialData));

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );

  const preview = useMemo(() => form.imageUrl.trim(), [form.imageUrl]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) nextErrors.name = "กรุณากรอกชื่อสินค้า";
    if (!form.description.trim()) nextErrors.description = "กรุณากรอกรายละเอียดสินค้า";
    if (!form.imageUrl.trim()) nextErrors.imageUrl = "กรุณากรอกลิงก์รูปสินค้า";

    const costPrice = Number(form.costPrice);
    const minPrice = Number(form.minPrice);
    const stockQty = Number(form.stockQty);

    if (!form.costPrice.trim()) {
      nextErrors.costPrice = "กรุณากรอกราคาทุน";
    } else if (Number.isNaN(costPrice) || costPrice <= 0) {
      nextErrors.costPrice = "ราคาทุนต้องมากกว่า 0";
    }

    if (!form.minPrice.trim()) {
      nextErrors.minPrice = "กรุณากรอกราคาขั้นต่ำ";
    } else if (Number.isNaN(minPrice) || minPrice <= 0) {
      nextErrors.minPrice = "ราคาขั้นต่ำต้องมากกว่า 0";
    } else if (!Number.isNaN(costPrice) && minPrice < costPrice) {
      nextErrors.minPrice = "ราคาขั้นต่ำต้องไม่น้อยกว่าราคาทุน";
    }

    if (!form.stockQty.trim()) {
      nextErrors.stockQty = "กรุณากรอกจำนวนสต็อก";
    } else if (
      Number.isNaN(stockQty) ||
      !Number.isInteger(stockQty) ||
      stockQty < 0
    ) {
      nextErrors.stockQty = "จำนวนสต็อกต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmitSuccess?.({
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
      costPrice: Number(form.costPrice),
      minPrice: Number(form.minPrice),
      stockQty: Number(form.stockQty),
    });
  };

  return (
    <div className="w-full min-w-[320px] max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {mode === "add" ? "เพิ่มสินค้า" : "แก้ไขสินค้า"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            กรอกข้อมูลสินค้าให้ครบถ้วนก่อนบันทึก
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
        >
          ปิด
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            ชื่อสินค้า
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            รายละเอียดสินค้า
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            ลิงก์รูปสินค้า
          </label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>
          )}
        </div>

        {preview && (
          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-medium text-slate-700">ตัวอย่างรูป</p>
            <img
              src={preview}
              alt="Preview"
              className="h-40 w-40 rounded-xl border border-slate-200 object-cover"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            ราคาทุน
          </label>
          <input
            name="costPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.costPrice}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />
          {errors.costPrice && (
            <p className="mt-1 text-sm text-red-500">{errors.costPrice}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            ราคาขั้นต่ำ
          </label>
          <input
            name="minPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.minPrice}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />
          {errors.minPrice && (
            <p className="mt-1 text-sm text-red-500">{errors.minPrice}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            จำนวนสต็อก
          </label>
          <input
            name="stockQty"
            type="number"
            min="0"
            step="1"
            value={form.stockQty}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />
          {errors.stockQty && (
            <p className="mt-1 text-sm text-red-500">{errors.stockQty}</p>
          )}
        </div>

        <div className="mt-2 flex justify-end gap-3 md:col-span-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            {mode === "add" ? "บันทึกสินค้า" : "อัปเดตสินค้า"}
          </button>
        </div>
      </form>
    </div>
  );
}