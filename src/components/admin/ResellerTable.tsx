// กำหนดรูปแบบข้อมูลของ reseller 1 คน
// ใช้บอกว่า reseller แต่ละรายการต้องมีข้อมูลอะไรบ้าง
type Reseller = {
  id: number;
  name: string;
  email: string;
  shopName: string;
  status: "Pending" | "Approved" | "Rejected";
};

// กำหนด props ของ component
// component นี้ต้องรับข้อมูล resellers เข้ามาเป็น array
type ResellerTableProps = {
  resellers: Reseller[];
};

// component สำหรับแสดงตาราง reseller
export default function ResellerTable({ resellers }: ResellerTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
      <table className="w-full text-left">
        {/* ส่วนหัวของตาราง */}
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">ID</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Name</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Email</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Shop Name</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Status</th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">Actions</th>
          </tr>
        </thead>

        {/* ส่วนข้อมูลในตาราง */}
        <tbody>
          {/* ใช้ map วนลูปข้อมูล reseller เพื่อสร้างแถวทีละรายการ */}
          {resellers.map((reseller) => (
            <tr key={reseller.id} className="border-t border-slate-100">
              <td className="px-5 py-4 text-sm text-slate-700">{reseller.id}</td>

              <td className="px-5 py-4 text-sm font-medium text-slate-800">
                {reseller.name}
              </td>

              <td className="px-5 py-4 text-sm text-slate-700">
                {reseller.email}
              </td>

              <td className="px-5 py-4 text-sm text-slate-700">
                {reseller.shopName}
              </td>

              {/* แสดงสีตามสถานะ */}
              <td className="px-5 py-4 text-sm">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    reseller.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : reseller.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {reseller.status}
                </span>
              </td>

              {/* ปุ่มจัดการสถานะ */}
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button className="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600">
                    Approve
                  </button>
                  <button className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600">
                    Reject
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