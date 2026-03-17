"use client";

import { useState } from "react";

type Transaction = {
  id: string;
  type: "Sale" | "Withdraw";
  amount: number;
  date: string;
};

export default function WalletPage() {

  const [balance, setBalance] = useState(12450);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "TX001", type: "Sale", amount: 890, date: "2026-03-15" },
    { id: "TX002", type: "Sale", amount: 390, date: "2026-03-14" },
    { id: "TX003", type: "Withdraw", amount: -2000, date: "2026-03-13" },
  ]);

  // 🔥 withdraw modal
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const handleWithdraw = () => {
    if (withdrawAmount <= 0) return alert("กรอกจำนวนเงินให้ถูกต้อง");
    if (withdrawAmount > balance) return alert("เงินไม่พอ");

    const newTx: Transaction = {
      id: "TX" + (transactions.length + 1).toString().padStart(3, "0"),
      type: "Withdraw",
      amount: -withdrawAmount,
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions([newTx, ...transactions]);
    setBalance(balance - withdrawAmount);

    setWithdrawAmount(0);
    setShowWithdraw(false);
  };

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-black">
        My Wallet
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border rounded-xl p-6 shadow">
          <p className="text-sm text-gray-600">Current Balance</p>
          <h2 className="text-3xl font-bold text-green-600">
            ฿{balance.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow">
          <p className="text-sm text-gray-600">Total Sales</p>
          <h2 className="text-3xl font-bold text-blue-600">
            ฿1,280
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow flex items-center justify-center">
          <button
            onClick={() => setShowWithdraw(true)}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Withdraw Money
          </button>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow">

        <div className="p-4 border-b">
          <h2 className="font-semibold">Transaction History</h2>
        </div>

        <table className="w-full text-left">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="border-t hover:bg-gray-50 cursor-pointer"
              >
                <td className="p-3">{tx.id}</td>
                <td className="p-3">{tx.type}</td>
                <td className={`p-3 font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {tx.amount > 0 ? "+" : "-"}฿{Math.abs(tx.amount)}
                </td>
                <td className="p-3">{tx.date}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* 🔥 Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-80">

            <h2 className="text-lg font-bold mb-4">
              Withdraw Money
            </h2>

            <input
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={handleWithdraw}
                className="flex-1 bg-black text-white py-2 rounded"
              >
                Confirm
              </button>

              <button
                onClick={() => setShowWithdraw(false)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                Cancel
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-80">
            <h2 className="font-bold mb-3">Transaction Detail</h2>

            <p>ID: {selectedTx.id}</p>
            <p>Type: {selectedTx.type}</p>
            <p>Amount: {selectedTx.amount}</p>
            <p>Date: {selectedTx.date}</p>

            <button
              onClick={() => setSelectedTx(null)}
              className="mt-4 w-full bg-black text-white py-2 rounded"
            >
              Close
            </button>
          </div>

        </div>
      )}

    </div>
  );
}