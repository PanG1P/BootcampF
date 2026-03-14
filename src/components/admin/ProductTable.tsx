type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Inactive";
};

type ProductTableProps = {
  products: Product[];
};

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">ID</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Product Name</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Category</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Price</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Stock</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Status</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-slate-100">
              <td className="px-5 py-4 text-sm text-slate-700">{product.id}</td>
              <td className="px-5 py-4 text-sm font-medium text-slate-800">
                {product.name}
              </td>
              <td className="px-5 py-4 text-sm text-slate-700">{product.category}</td>
              <td className="px-5 py-4 text-sm text-slate-700">
                ฿{product.price.toLocaleString()}
              </td>
              <td className="px-5 py-4 text-sm text-slate-700">{product.stock}</td>
              <td className="px-5 py-4 text-sm">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.status}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600">
                    Edit
                  </button>
                  <button className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600">
                    Delete
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
