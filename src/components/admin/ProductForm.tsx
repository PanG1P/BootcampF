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
    costPrice: initialData?.costPrice !== undefined ? String(initialData.costPrice) : "",
    minPrice: initialData?.minPrice !== undefined ? String(initialData.minPrice) : "",
    stockQty: initialData?.stockQty !== undefined ? String(initialData.stockQty) : "",
    imageUrl: initialData?.imageUrl ?? "",
  };
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
  colSpan?: boolean;
};

function Field({ label, error, children, colSpan }: FieldProps) {
  return (
    <div className={colSpan ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function ProductForm({ mode, initialData, onClose, onSubmitSuccess }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialForm(initialData));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const preview = useMemo(() => form.imageUrl.trim(), [form.imageUrl]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) nextErrors.name = "กรุณากรอกชื่อสินค้า";
    if (!form.description.trim()) nextErrors.description = "กรุณากรอกรายละเอียดสินค้า";
    if (!form.imageUrl.trim()) nextErrors.imageUrl = "กรุณากรอกลิงก์รูปสินค้า";

    const costPrice = Number(form.costPrice);
    const minPrice = Number(form.minPrice);
    const stockQty = Number(form.stockQty);

    if (!form.costPrice.trim()) nextErrors.costPrice = "กรุณากรอกราคาทุน";
    else if (Number.isNaN(costPrice) || costPrice <= 0) nextErrors.costPrice = "ราคาทุนต้องมากกว่า 0";

    if (!form.minPrice.trim()) nextErrors.minPrice = "กรุณากรอกราคาขั้นต่ำ";
    else if (Number.isNaN(minPrice) || minPrice <= 0) nextErrors.minPrice = "ราคาขั้นต่ำต้องมากกว่า 0";
    else if (!Number.isNaN(costPrice) && minPrice < costPrice) nextErrors.minPrice = "ราคาขั้นต่ำต้องไม่น้อยกว่าราคาทุน";

    if (!form.stockQty.trim()) nextErrors.stockQty = "กรุณากรอกจำนวนสต็อก";
    else if (Number.isNaN(stockQty) || !Number.isInteger(stockQty) || stockQty < 0) nextErrors.stockQty = "จำนวนสต็อกต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป";

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

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-300 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500/20";

  return (
    <div className="w-full min-w-[320px] max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

      {/* Modal Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            {mode === "add" ? "เพิ่มสินค้าใหม่" : "แก้ไขสินค้า"}
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            กรอกข้อมูลสินค้าให้ครบถ้วนก่อนบันทึก
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">

          <Field label="ชื่อสินค้า" error={errors.name} colSpan>
            <input name="name" value={form.name} onChange={handleChange} placeholder="เช่น สินค้า A" className={inputClass} />
          </Field>

          <Field label="รายละเอียดสินค้า" error={errors.description} colSpan>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="อธิบายรายละเอียดสินค้า..." className={inputClass} />
          </Field>

          <Field label="ลิงก์รูปสินค้า" error={errors.imageUrl} colSpan>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." className={inputClass} />
          </Field>

          {/* Image Preview */}
          {preview && (
            <div className="md:col-span-2">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">ตัวอย่างรูป</p>
              <div className="h-24 w-24 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              </div>
            </div>
          )}

          <Field label="ราคาทุน (฿)" error={errors.costPrice}>
            <input name="costPrice" type="number" min="0" step="0.01" value={form.costPrice} onChange={handleChange} placeholder="0.00" className={inputClass} />
          </Field>

          <Field label="ราคาขั้นต่ำ (฿)" error={errors.minPrice}>
            <input name="minPrice" type="number" min="0" step="0.01" value={form.minPrice} onChange={handleChange} placeholder="0.00" className={inputClass} />
          </Field>

          <Field label="จำนวนสต็อก" error={errors.stockQty} colSpan>
            <input name="stockQty" type="number" min="0" step="1" value={form.stockQty} onChange={handleChange} placeholder="0" className={inputClass} />
          </Field>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-95"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 active:scale-95"
          >
            {mode === "add" ? "บันทึกสินค้า" : "อัปเดตสินค้า"}
          </button>
        </div>
      </form>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}