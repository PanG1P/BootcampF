"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import ActionPopup from "@/components/common/ActionPopup";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function getSnapshot() { return localStorage.getItem("email") || ""; }
function getServerSnapshot() { return ""; }

export default function AdminNavbar() {
  const router = useRouter();
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false);

  const userEmail = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    });
    router.replace("/login");
    setTimeout(() => { window.location.reload(); }, 100);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">

          {/* Left: breadcrumb-style title */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-medium text-slate-700">Dashboard</span>
          </div>

          {/* Right: user + logout */}
          <div className="flex items-center gap-3">
            {/* User info */}
            <div className="hidden items-center gap-2.5 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <ShieldCheck size={15} />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-slate-700 leading-none">Admin User</p>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-none">
                  {userEmail || "ไม่พบอีเมล"}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-5 w-px bg-slate-200 sm:block" />

            {/* Logout */}
            <button
              type="button"
              onClick={() => setOpenLogoutPopup(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
            >
              <LogOut size={13} />
              ออกจากระบบ
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