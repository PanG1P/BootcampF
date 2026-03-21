"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Resellers", href: "/admin/resellers", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 min-h-screen flex-col border-r border-slate-100 bg-white px-4 py-6">

      {/* Logo */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" fillOpacity="0.5" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" fillOpacity="0.5" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-none">Admin Panel</p>
            <p className="mt-0.5 text-xs text-slate-400 leading-none">Reseller System</p>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        เมนูหลัก
      </p>

      {/* Menu */}
      <nav className="flex flex-col gap-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${isActive
                  ? "bg-slate-900 font-medium text-white"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
            >
              <Icon
                size={16}
                className={isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}
              />
              {item.name}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-2 pt-6">
        <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
          <p className="text-xs font-medium text-slate-500">Bootcamp Project</p>
          <p className="mt-0.5 text-[10px] text-slate-400">© 2026 All rights reserved</p>
        </div>
      </div>
    </aside>
  );
}