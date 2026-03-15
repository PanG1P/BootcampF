import ResellerTable from "@/components/admin/ResellerTable";

// mock data สำหรับ reseller
// ใช้ข้อมูลจำลองก่อน เพื่อสร้างหน้า UI ได้โดยไม่ต้องรอ backend
const resellers = [
  {
    id: 1,
    name: "Somchai",
    email: "somchai@example.com",
    shopName: "Smile Dental Shop",
    status: "Pending" as const,
  },
  {
    id: 2,
    name: "Anong",
    email: "anong@example.com",
    shopName: "Bright Clinic Supply",
    status: "Approved" as const,
  },
  {
    id: 3,
    name: "Narin",
    email: "narin@example.com",
    shopName: "Dental Care Plus",
    status: "Rejected" as const,
  },
  {
    id: 4,
    name: "Suda",
    email: "suda@example.com",
    shopName: "Healthy Tooth Market",
    status: "Pending" as const,
  },
];

// component หลักของหน้า /admin/resellers
// หน้าที่คือแสดงหัวข้อหน้า และส่งข้อมูล reseller ไปยัง ResellerTable
export default function AdminResellersPage() {
  return (
    <div className="space-y-6">
      {/* ส่วนหัวของหน้า */}
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resellers</h1>
          <p className="mt-1 text-slate-500">
            Manage reseller applications and approval status
          </p>
        </div>

        <button className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          View Pending
        </button>
      </section>

      {/* เรียกใช้ตาราง reseller และส่งข้อมูลผ่าน props */}
      <ResellerTable resellers={resellers} />
    </div>
  );
}