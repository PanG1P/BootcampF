"use client";

import { useEffect, useMemo, useState } from "react";
import { getWalletByUserId, getWalletLogs } from "@/services/wallet.service";
import type { Wallet, WalletLog } from "@/types/wallet";

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletLog[]>([]);
  const [selectedTx, setSelectedTx] = useState<WalletLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalIncome = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  }, [transactions]);

  const getCurrentUserId = () => {
    return Number(localStorage.getItem("userId") || "0");
  };

  useEffect(() => {
    let isMounted = true;

    async function loadWalletData() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token") || "";
        const userId = getCurrentUserId();

        if (!token) {
          throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        }

        if (!userId || Number.isNaN(userId)) {
          throw new Error("ไม่พบ userId กรุณา login ใหม่");
        }

        const [walletData, walletLogs] = await Promise.all([
          getWalletByUserId(userId, token),
          getWalletLogs(userId, token),
        ]);

        if (!isMounted) return;

        setWallet(walletData);
        setTransactions(Array.isArray(walletLogs) ? walletLogs : []);
      } catch (err) {
        if (!isMounted) return;

        const message =
          err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูล wallet ได้";
        setError(message);
        console.error("Load wallet error:", err);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    loadWalletData();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (value?: number | string | null) => {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number.isNaN(amount) ? 0 : amount);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border bg-white p-6 shadow"
            >
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-8 w-36 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-white shadow">
          <div className="border-b p-4">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded bg-slate-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold text-black">My Wallet</h1>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="text-lg font-semibold text-red-700">
            โหลดข้อมูลไม่สำเร็จ
          </h2>
          <p className="mt-2 text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-black">My Wallet</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow">
          <p className="text-sm text-gray-600">Current Balance</p>
          <h2 className="text-3xl font-bold text-green-600">
            {formatCurrency(wallet?.balance)}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow">
          <p className="text-sm text-gray-600">Total Profit History</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {formatCurrency(totalIncome)}
          </h2>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow">
        <div className="border-b p-4">
          <h2 className="font-semibold">Profit History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="cursor-pointer border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{tx.id}</td>
                    <td className="p-3">{tx.order_id ?? "-"}</td>
                    <td className="p-3">Profit</td>
                    <td className="p-3 font-semibold text-green-600">
                      +{formatCurrency(tx.amount)}
                    </td>
                    <td className="p-3">
                      {tx.created_at
                        ? new Date(tx.created_at).toLocaleString("th-TH")
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    ยังไม่มีประวัติรายได้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTx && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-80 rounded-xl bg-white p-6">
            <h2 className="mb-3 font-bold">Transaction Detail</h2>

            <p>ID: {selectedTx.id}</p>
            <p>Order ID: {selectedTx.order_id ?? "-"}</p>
            <p>Type: Profit</p>
            <p>Amount: {formatCurrency(selectedTx.amount)}</p>
            <p>
              Date:{" "}
              {selectedTx.created_at
                ? new Date(selectedTx.created_at).toLocaleString("th-TH")
                : "-"}
            </p>

            <button
              onClick={() => setSelectedTx(null)}
              className="mt-4 w-full rounded bg-black py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}