"use client";

import type { Product } from "@/types/product";

type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  loading?: boolean;
};

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  loading = false,
}: ProductTableProps) {
  if (!loading && products.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
        ไม่พบข้อมูลสินค้า
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              รูปสินค้า
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ชื่อสินค้า
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ราคาทุน
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ราคาขั้นต่ำ
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              สต็อก
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              จัดการ
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={6}
                className="px-5 py-6 text-center text-sm text-slate-500"
              >
                กำลังโหลดข้อมูล...
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <img
                    src={
                      product.image_url ||
                      "https://via.placeholder.com/80?text=No+Image"
                    }
                    alt={product.name}
                    className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                  />
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-800">
                    {product.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {product.description || "-"}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  ฿{Number(product.cost_price).toLocaleString()}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  ฿{Number(product.min_price).toLocaleString()}
                </td>

                <td className="px-5 py-4 text-sm text-slate-700">
                  {product.stock}
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      แก้ไข
                    </button>

                    <button
                      onClick={() => onDelete(product)}
                      className="rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}