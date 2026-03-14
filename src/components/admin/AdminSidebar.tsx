"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Products", href: "/admin/products" },
  { name: "Orders", href: "/admin/orders" },
  { name: "Resellers", href: "/admin/resellers" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-slate-300 mt-1">Bootcamp Frontend</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-white text-slate-900 font-semibold"
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
