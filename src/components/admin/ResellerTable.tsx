"use client";

// กำหนดรูปแบบข้อมูลของตัวแทน 1 คน
type Reseller = {
  id: number;
  fullName: string;
  email: string;
  shopName: string;
  phone: string;
  appliedAt: string;
  status: "รออนุมัติ" | "อนุมัติแล้ว" | "ถูกปฏิเสธ";
};

// กำหนด props ที่ component นี้ต้องรับ
type ResellerTableProps = {
  resellers: Reseller[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

// component สำหรับแสดงตารางตัวแทน
export default function ResellerTable({
  resellers,
  onApprove,
  onReject,
}: ResellerTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left">
        {/* หัวตาราง */}
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ชื่อ-นามสกุล
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              อีเมล
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              ชื่อร้าน
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              เบอร์โทรศัพท์
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              วันที่สมัคร
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              สถานะ
            </th>
            <th className="px-5 py-3 text-sm font-semibold text-slate-600">
              จัดการ
            </th>
          </tr>
        </thead>

        {/* ข้อมูลในตาราง */}
        <tbody>
          {resellers.map((reseller) => (
            <tr
              key={reseller.id}
              className={`border-t border-slate-100 ${
                reseller.status === "รออนุมัติ" ? "bg-yellow-50" : ""
              }`}
            >
              {/* ชื่อ-นามสกุล */}
              <td className="px-5 py-4 text-sm font-medium text-slate-800">
                {reseller.fullName}
              </td>

              {/* อีเมล */}
              <td className="px-5 py-4 text-sm text-slate-700">
                {reseller.email}
              </td>

              {/* ชื่อร้าน */}
              <td className="px-5 py-4 text-sm text-slate-700">
                {reseller.shopName}
              </td>

              {/* เบอร์โทรศัพท์ */}
              <td className="px-5 py-4 text-sm text-slate-700">
                {reseller.phone}
              </td>

              {/* วันที่สมัคร */}
              <td className="px-5 py-4 text-sm text-slate-700">
                {reseller.appliedAt}
              </td>

              {/* สถานะ */}
              <td className="px-5 py-4 text-sm">
                {reseller.status === "รออนุมัติ" && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    รออนุมัติ
                  </span>
                )}

                {reseller.status === "อนุมัติแล้ว" && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    อนุมัติแล้ว
                  </span>
                )}

                {reseller.status === "ถูกปฏิเสธ" && (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                    ถูกปฏิเสธ
                  </span>
                )}
              </td>

              {/* ปุ่มจัดการ */}
              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(reseller.id)}
                    disabled={reseller.status !== "รออนุมัติ"}
                    className="rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    อนุมัติ
                  </button>

                  <button
                    onClick={() => onReject(reseller.id)}
                    disabled={reseller.status !== "รออนุมัติ"}
                    className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    ปฏิเสธ
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