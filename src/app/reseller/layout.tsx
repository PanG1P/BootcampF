"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/reseller/dashboard" },
    { name: "Catalog", path: "/reseller/catalog" },
    { name: "My Products", path: "/reseller/my-products" },
    { name: "Wallet", path: "/reseller/wallet" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col">

        <h1 className="text-2xl font-bold mb-8">
          Reseller Panel
        </h1>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-2 rounded-lg transition
              ${
                pathname === item.path
                  ? "bg-white text-black font-semibold"
                  : "hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto text-sm text-gray-400 pt-10">
          © 2026 Reseller System
        </div>

      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  );
}