"use client";

import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export default function MyProductsPage() {

  const [products, setProducts] = useState<Product[]>([
    { id: "C001", name: "Oversize T-Shirt", price: 390, stock: 80 },
    { id: "C002", name: "Hoodie Streetwear", price: 890, stock: 40 },
    { id: "C003", name: "Cargo Pants", price: 990, stock: 35 },
    { id: "C004", name: "Denim Jacket", price: 1290, stock: 25 },
  ]);

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleAdd = () => {
    const newProduct: Product = {
      id: "NEW" + (products.length + 1),
      name: "New Product",
      price: 0,
      stock: 0,
    };

    setProducts([...products, newProduct]);
  };

  const handleChange = (
    id: string,
    field: keyof Product,
    value: string | number
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>

        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-left">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Price (฿)</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">

                {/* 🔥 ชื่อสินค้า (ไม่มีขอบ) */}
                <td className="p-4">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      handleChange(product.id, "name", e.target.value)
                    }
                    className="p-2 w-full outline-none border-none bg-transparent hover:bg-gray-100 rounded"
                  />
                </td>

                {/* ราคา */}
                <td className="p-4">
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      handleChange(product.id, "price", Number(e.target.value))
                    }
                    className="border p-2 rounded w-24"
                  />
                </td>

                {/* สต็อก */}
                <td className="p-4">
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) =>
                      handleChange(product.id, "stock", Number(e.target.value))
                    }
                    className="border p-2 rounded w-24"
                  />
                </td>

                <td className="p-4">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}