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

  const getCurrentUserId = () => Number(localStorage.getItem("userId") || "0");

  useEffect(() => {
    let isMounted = true;
    async function loadWalletData() {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token") || "";
        const userId = getCurrentUserId();

        if (!token) throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
        if (!userId || Number.isNaN(userId)) throw new Error("ไม่พบ userId กรุณา login ใหม่");

        const [walletData, walletLogs] = await Promise.all([
          getWalletByUserId(userId, token),
          getWalletLogs(userId, token),
        ]);

        if (!isMounted) return;
        setWallet(walletData);
        setTransactions(Array.isArray(walletLogs) ? walletLogs : []);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูล wallet ได้");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadWalletData();
    return () => { isMounted = false; };
  }, []);

  const formatCurrency = (value?: number | string | null) => {
    const amount = Number(value ?? 0);
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(Number.isNaN(amount) ? 0 : amount);
  };

  if (loading) return <div className="p-6 text-center text-slate-500">กำลังโหลดข้อมูลกระเป๋าเงิน...</div>;

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-bold text-red-700">เกิดข้อผิดพลาด</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* --- 1. Header Section --- */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Wallet</h1>
          <p className="text-sm text-slate-500">จัดการรายได้และตรวจสอบประวัติการทำรายการ</p>
        </div>
        <div className="flex gap-3">
          {/* ปุ่มฝากเงินทรงกลม */}
          <button title="ฝากเงิน" className="p-3 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </button>
          {/* ปุ่มถอนเงินทรงกลม */}
          <button title="ถอนเงิน" className="p-3 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-red-500 hover:text-red-500 transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </button>
        </div>
      </header>

      {/* --- 2. Stats Cards Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:border-green-300 transition-all">
          <div className="p-4 bg-green-50 rounded-2xl text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Balance</p>
            <p className="text-3xl font-black text-green-600">{formatCurrency(wallet?.balance)}</p>
          </div>
        </div>

        {/* Profit Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:border-blue-300 transition-all">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.71-1.26m0 0L19.5 3m2.25 2.25-2.25 2.25" /></svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Profit History</p>
            <p className="text-3xl font-black text-blue-600">{formatCurrency(totalIncome)}</p>
          </div>
        </div>
      </div>

      {/* --- 3. Transaction Table --- */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Profit History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4 text-center">ID</th>
                <th className="px-4 py-4">Order ID</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4 text-center">Amount</th>
                <th className="px-4 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <tr key={tx.id} onClick={() => setSelectedTx(tx)} className="group cursor-pointer hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-center text-slate-400 font-medium">{String(index + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{tx.order_id ?? "-"}</td>
                    <td className="px-4 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">Profit</span>
                    </td>
                    <td className="px-4 py-4 text-center font-black text-green-600">+{formatCurrency(tx.amount)}</td>
                    <td className="px-4 py-4 text-slate-500">
                      {tx.created_at ? new Date(tx.created_at).toLocaleString("th-TH", { dateStyle: 'medium', timeStyle: 'short' }) : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-400">ยังไม่มีประวัติรายได้</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 4. Transaction Modal --- */}
      {selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Transaction Detail</h2>
              <div className="space-y-3 py-4 border-y border-slate-100 text-left text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Order ID:</span> <span className="font-bold">{selectedTx.order_id ?? "-"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Type:</span> <span className="font-bold text-green-600">Profit</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Amount:</span> <span className="font-bold text-xl text-slate-800">{formatCurrency(selectedTx.amount)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Date:</span> <span className="text-slate-600">{selectedTx.created_at ? new Date(selectedTx.created_at).toLocaleString("th-TH") : "-"}</span></div>
              </div>
              <button onClick={() => setSelectedTx(null)} className="w-full mt-6 rounded-2xl bg-slate-900 py-4 font-bold text-white hover:bg-slate-800 transition-all">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}