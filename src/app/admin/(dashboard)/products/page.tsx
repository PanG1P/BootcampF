import Link from "next/link";
import ProductTable from "@/components/admin/ProductTable";

// mock data คือข้อมูลจำลอง
// ตอนนี้ใช้แทนข้อมูลจาก backend ไปก่อน
const products = [
  {
    id: 1,
    image: "https://via.placeholder.com/80?text=P1",
    name: "Dental Mirror",
    costPrice: 120,
    minPrice: 150,
    stock: 45,
  },
  {
    id: 2,
    image: "https://via.placeholder.com/80?text=P2",
    name: "Tooth Extraction Forceps",
    costPrice: 850,
    minPrice: 1000,
    stock: 12,
  },
  {
    id: 3,
    image: "https://via.placeholder.com/80?text=P3",
    name: "Disposable Gloves",
    costPrice: 220,
    minPrice: 300,
    stock: 100,
  },
  {
    id: 4,
    image: "https://via.placeholder.com/80?text=P4",
    name: "Face Mask",
    costPrice: 90,
    minPrice: 120,
    stock: 0,
  },
];

// component หลักของหน้า /admin/products
// หน้าที่คือแสดงหัวข้อหน้า และส่งข้อมูลสินค้าเข้า ProductTable
export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">จัดการสินค้า</h1>
          <p className="mt-1 text-slate-500">
            แสดงรายการสินค้าทั้งหมดในระบบ
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + เพิ่มสินค้า
        </Link>
      </section>

      <ProductTable products={products} />
    </div>
  );
}