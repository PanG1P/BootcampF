"use client";

import { useEffect, useMemo, useState } from "react";
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

type StockFilter = "all" | "ok" | "low" | "out";

function getDeleteProductErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message.toLowerCase() : "";
  if (raw.includes("order_items") || raw.includes("product_id") || raw.includes("violates") || raw.includes("constraint"))
    return "ไม่สามารถลบสินค้านี้ได้ เนื่องจากมีรายการสั่งซื้อที่อ้างอิงอยู่";
  if (raw.includes("400")) return "ลบสินค้าไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง";
  if (raw.includes("404")) return "ไม่พบสินค้าที่ต้องการลบ";
  if (raw.includes("500")) return "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง";
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

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [popup, setPopup] = useState<PopupState>({ open: false, type: "success", title: "", message: "" });
  const closePopup = () => setPopup({ open: false, type: "success", title: "", message: "" });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) { setError("ไม่พบ token กรุณาเข้าสู่ระบบใหม่"); return; }
      const data = await getProducts(token);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดสินค้าไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  // ── Derived counts for filter badges ──
  const stockCounts = useMemo(() => ({
    all: products.length,
    ok: products.filter((p) => p.stock > 10).length,
    low: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    out: products.filter((p) => p.stock === 0).length,
  }), [products]);

  // ── Filter + search ──
  const filteredProducts = useMemo(() => {
    let result = products;

    if (stockFilter === "ok") result = result.filter((p) => p.stock > 10);
    else if (stockFilter === "low") result = result.filter((p) => p.stock > 0 && p.stock <= 10);
    else if (stockFilter === "out") result = result.filter((p) => p.stock === 0);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, stockFilter, search]);

  const totalElements = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));

  const paginatedProducts = useMemo(() => {
    const start = page * size;
    return filteredProducts.slice(start, start + size);
  }, [filteredProducts, page, size]);

  // Reset page when filter/search changes
  useEffect(() => { setPage(0); }, [search, stockFilter]);
  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(totalPages - 1, 0));
  }, [page, totalPages]);

  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) { for (let i = 0; i < totalPages; i++) pages.push(i); return pages; }
    pages.push(0);
    if (page > 2) pages.push("...");
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages - 2, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 3) pages.push("...");
    pages.push(totalPages - 1);
    return pages;
  }, [page, totalPages]);

  const openAddModal = () => { setMode("add"); setSelectedProduct(null); setIsOpen(true); };
  const openEditModal = (product: Product) => { setMode("edit"); setSelectedProduct(product); setIsOpen(true); };
  const closeModal = () => { if (submitting) return; setIsOpen(false); setSelectedProduct(null); };

  const handleDelete = async (product: Product) => {
    setPopup({
      open: true, type: "confirm",
      title: "ยืนยันการลบสินค้า",
      message: `คุณต้องการลบสินค้า "${product.name}" ใช่หรือไม่?`,
      onConfirm: async () => {
        try {
          closePopup();
          const token = localStorage.getItem("token");
          if (!token) { setPopup({ open: true, type: "error", title: "ไม่พบสิทธิ์การใช้งาน", message: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง" }); return; }
          await deleteProduct(product.id, token);
          await loadProducts();
          setPopup({ open: true, type: "success", title: "ลบสินค้าสำเร็จ", message: `สินค้า "${product.name}" ถูกลบเรียบร้อยแล้ว` });
        } catch (err) {
          setPopup({ open: true, type: "error", title: "ลบสินค้าไม่สำเร็จ", message: getDeleteProductErrorMessage(err) });
        }
      },
    });
  };

  const handleSubmitProduct = async (payload: { name: string; description: string; imageUrl: string; costPrice: number; minPrice: number; stockQty: number }) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      if (!token) { setPopup({ open: true, type: "error", title: "ไม่พบสิทธิ์การใช้งาน", message: "กรุณาเข้าสู่ระบบใหม่อีกครั้ง" }); return; }
      const requestBody: ProductPayload = { name: payload.name, description: payload.description, image_url: payload.imageUrl, cost_price: String(payload.costPrice), min_price: String(payload.minPrice), stock: payload.stockQty };
      if (mode === "add") {
        await createProduct(requestBody, token);
        setPopup({ open: true, type: "success", title: "เพิ่มสินค้าสำเร็จ", message: "ระบบได้บันทึกสินค้าใหม่เรียบร้อยแล้ว" });
      } else if (selectedProduct) {
        await updateProduct(selectedProduct.id, requestBody, token);
        setPopup({ open: true, type: "success", title: "แก้ไขสินค้าสำเร็จ", message: "ข้อมูลสินค้าถูกอัปเดตเรียบร้อยแล้ว" });
      }
      await loadProducts();
      closeModal();
    } catch (err) {
      setPopup({ open: true, type: "error", title: "บันทึกสินค้าไม่สำเร็จ", message: err instanceof Error ? err.message : "เกิดข้อผิดพลาดบางอย่าง" });
    } finally {
      setSubmitting(false);
    }
  };

  const stockFilterOptions: { value: StockFilter; label: string; countKey: StockFilter }[] = [
    { value: "all", label: "ทั้งหมด", countKey: "all" },
    { value: "ok", label: "ปกติ", countKey: "ok" },
    { value: "low", label: "ใกล้หมด", countKey: "low" },
    { value: "out", label: "หมดแล้ว", countKey: "out" },
  ];

  return (
    <>
      <div className="space-y-5 p-6">

        {/* ─── Header ─── */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-xs font-medium uppercase tracking-widest text-slate-400">Admin Console</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">จัดการสินค้า</h1>
            <p className="mt-1 text-sm text-slate-400">
              สินค้าทั้งหมด{" "}
              <span className="font-medium text-slate-600">{products.length}</span> รายการ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadProducts}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50 active:scale-95"
            >
              <RefreshIcon />
              รีเฟรช
            </button>
            <button
              onClick={openAddModal}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PlusIcon />
              เพิ่มสินค้า
            </button>
          </div>
        </section>

        {/* ─── Search + Stock Filter ─── */}
        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อหรือรายละเอียดสินค้า..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-3 flex items-center text-slate-300 hover:text-slate-500"
              >
                <CloseSmIcon />
              </button>
            )}
          </div>

          {/* Stock filter tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            {stockFilterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStockFilter(opt.value)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${stockFilter === opt.value
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {opt.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${opt.value === "out" ? "bg-red-100 text-red-600" :
                    opt.value === "low" ? "bg-amber-100 text-amber-600" :
                      opt.value === "ok" ? "bg-emerald-100 text-emerald-600" :
                        "bg-slate-200 text-slate-500"
                  }`}>
                  {stockCounts[opt.countKey]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ─── Error ─── */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        {/* ─── Table ─── */}
        <ProductTable
          products={paginatedProducts}
          onEdit={openEditModal}
          onDelete={handleDelete}
          loading={loading}
          searchQuery={search}
        />

        {/* ─── Pagination ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-400">
              {totalElements === 0
                ? "ไม่พบสินค้า"
                : <>หน้า <span className="font-medium text-slate-700">{page + 1}</span> / <span className="font-medium text-slate-700">{totalPages}</span> <span className="ml-1">({totalElements.toLocaleString()} รายการ)</span></>
              }
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">แสดง</span>
              <select
                value={size}
                onChange={(e) => { setPage(0); setSize(Number(e.target.value)); }}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeftIcon />
            </button>

            {visiblePages.map((item, index) =>
              item === "..." ? (
                <span key={`e-${index}`} className="flex h-8 w-8 items-center justify-center text-sm text-slate-400">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item as number)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition ${page === item
                      ? "border-violet-500 bg-violet-500 font-semibold text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  {(item as number) + 1}
                </button>
              )
            )}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page + 1 >= totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Modal ─── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
            <ProductForm
              key={selectedProduct?.id ?? "new"}
              mode={mode}
              initialData={
                selectedProduct
                  ? { name: selectedProduct.name, description: selectedProduct.description || "", costPrice: Number(selectedProduct.cost_price), minPrice: Number(selectedProduct.min_price), stockQty: selectedProduct.stock, imageUrl: selectedProduct.image_url }
                  : undefined
              }
              onClose={closeModal}
              onSubmitSuccess={handleSubmitProduct}
            />
          </div>
        </div>
      )}

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

function RefreshIcon() {
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13.5 8A5.5 5.5 0 1 1 8 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M13.5 2.5v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function PlusIcon() {
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}
function SearchIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" /><path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
}
function CloseSmIcon() {
  return <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}
function ChevronLeftIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ChevronRightIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}