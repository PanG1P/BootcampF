"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import ActionPopup from "@/components/common/ActionPopup";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem("email") || "";
}

function getServerSnapshot() {
  return "";
}

export default function AdminNavbar() {
  const router = useRouter();
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false);

  const userEmail = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const handleLogout = () => {
    //  เคลียร์ทุกอย่าง
    localStorage.clear();
    sessionStorage.clear();

    //  เคลียร์ cookie (เผื่อมีในอนาคต)
    document.cookie
      .split(";")
      .forEach((c) => {
        document.cookie =
          c.trim().split("=")[0] +
          "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
      });

    //  redirect แบบกันย้อนกลับ
    router.replace("/login");

    //  รีเฟรชเพื่อเคลียร์ state ทั้งหมด
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800 md:text-xl">
              Admin Dashboard
            </h2>
            <p className="text-xs text-slate-500">
              จัดการข้อมูลในระบบตัวแทนจำหน่าย
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">Admin User</p>
              <p className="text-xs text-slate-500">
                {userEmail || "ไม่พบอีเมล"}
              </p>
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