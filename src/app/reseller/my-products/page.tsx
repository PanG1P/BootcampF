"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: "C001", name: "Oversize T-Shirt", price: 390, stock: 80 },
    { id: "C002", name: "Hoodie Streetwear", price: 890, stock: 40 },
    { id: "C003", name: "Cargo Pants", price: 990, stock: 35 },
    { id: "C004", name: "Denim Jacket", price: 1290, stock: 25 },
  ]);

  const updateProduct = (id: string, field: "price" | "stock", value: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-gray-900">
        Manage Products
      </h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-300">

        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 text-gray-800 font-semibold">
                Product
              </th>
              <th className="px-5 py-3 text-gray-800 font-semibold">
                Price (฿)
              </th>
              <th className="px-5 py-3 text-gray-800 font-semibold">
                Stock
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-5 py-4 font-medium text-gray-900">
                  {product.name}
                </td>

                <td className="px-5 py-4">
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      updateProduct(product.id, "price", Number(e.target.value))
                    }
                    className="border border-gray-400 rounded-md px-3 py-1 w-28 text-gray-900"
                  />
                </td>

                <td className="px-5 py-4">
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) =>
                      updateProduct(product.id, "stock", Number(e.target.value))
                    }
                    className="border border-gray-400 rounded-md px-3 py-1 w-24 text-gray-900"
                  />
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}