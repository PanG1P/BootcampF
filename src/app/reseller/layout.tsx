"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("shopId");
    router.push("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/reseller/dashboard" },
    { name: "Catalog", path: "/reseller/catalog" },
    { name: "My Products", path: "/reseller/my-products" },
    { name: "Wallet", path: "/reseller/wallets" },
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

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 HEADER */}
        <div className="bg-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">
            Reseller Dashboard
          </h1>

          <div className="flex items-center gap-4">

            {/* ชื่อ user */}
            <p className="text-sm font-medium text-gray-800">
              Reseller User
            </p>

            {/* avatar */}
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-bold">
              R
            </div>

            {/* logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg"
            >
              Logout
            </button>

          </div>
        </div>

        {/* CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </div>
  );
}