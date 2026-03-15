import ProductTable from "@/components/admin/ProductTable";

const products = [
  {
    id: 1,
    name: "Dental Mirror",
    category: "Dental Tools",
    price: 250,
    stock: 45,
    status: "Active" as const,
  },
  {
    id: 2,
    name: "Tooth Extraction Forceps",
    category: "Dental Tools",
    price: 1200,
    stock: 12,
    status: "Active" as const,
  },
  {
    id: 3,
    name: "Disposable Gloves",
    category: "Consumables",
    price: 350,
    stock: 100,
    status: "Active" as const,
  },
  {
    id: 4,
    name: "Face Mask",
    category: "Consumables",
    price: 180,
    stock: 0,
    status: "Inactive" as const,
  },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="mt-1 text-slate-500">
            Manage product list, stock, and product status
          </p>
        </div>

        <button className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          + Add Product
        </button>
      </section>

      <ProductTable products={products} />
    </div>
  );
}