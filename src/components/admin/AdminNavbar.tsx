"use client";

import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { useState } from "react";
import ActionPopup from "@/components/common/ActionPopup";

export default function AdminNavbar() {
  const router = useRouter();

  // state สำหรับ popup ยืนยันออกจากระบบ
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false);

  const handleLogout = () => {
    // ลบข้อมูล auth ที่เก็บไว้ใน browser
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("status");

    // พาไปหน้า login
    router.push("/admin/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          {/* ฝั่งซ้าย: ชื่อหน้า */}
          <div>
            <h2 className="text-lg font-bold text-slate-800 md:text-xl">
              Admin Dashboard
            </h2>
            <p className="text-xs text-slate-500">
              จัดการข้อมูลในระบบตัวแทนจำหน่าย
            </p>
          </div>

          {/* ฝั่งขวา: ข้อมูล user + logout */}
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500">admin@example.com</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <ShieldCheck size={18} />
            </div>

            <button
              type="button"
              onClick={() => setOpenLogoutPopup(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* popup ยืนยันก่อน logout */}
      <ActionPopup
        open={openLogoutPopup}
        type="confirm"
        title="ออกจากระบบ"
        message="คุณต้องการออกจากระบบใช่หรือไม่?"
        confirmText="ออกจากระบบ"
        cancelText="ยกเลิก"
        onClose={() => setOpenLogoutPopup(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}