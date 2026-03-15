"use client";

import Link from "next/link";

type Product = {
  id: number;
  image: string;
  name: string;
  costPrice: number;
  minPrice: number;
  stock: number;
};

type ProductTableProps = {
  products: Product[];
};

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">รูปสินค้า</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">ชื่อสินค้า</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">ราคาทุน</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">ราคาขั้นต่ำ</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">สต็อก</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">จัดการ</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-5 py-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
                />
              </td>

              <td className="px-5 py-4 text-sm font-medium text-slate-800">
                {product.name}
              </td>

              <td className="px-5 py-4 text-sm text-slate-700">
                ฿{product.costPrice.toLocaleString()}
              </td>

              <td className="px-5 py-4 text-sm text-slate-700">
                ฿{product.minPrice.toLocaleString()}
              </td>

              <td className="px-5 py-4 text-sm text-slate-700">
                {product.stock}
              </td>

              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/edit/${product.id}`}
                    className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    แก้ไข
                  </Link>

                  <button
                    onClick={() => alert(`ลบสินค้า ID: ${product.id} (mock)`)}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}