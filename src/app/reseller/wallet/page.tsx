"use client";

import { useState } from "react";

type Transaction = {
  id: string;
  type: "Sale" | "Withdraw";
  amount: number;
  date: string;
};

export default function WalletPage() {

  const [balance] = useState(12450);

  const transactions: Transaction[] = [
    { id: "TX001", type: "Sale", amount: 890, date: "2026-03-15" },
    { id: "TX002", type: "Sale", amount: 390, date: "2026-03-14" },
    { id: "TX003", type: "Withdraw", amount: -2000, date: "2026-03-13" },
  ];

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold text-black">
        My Wallet
      </h1>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md">
          <p className="text-gray-700 text-sm font-medium">
            Current Balance
          </p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            ฿{balance.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md">
          <p className="text-gray-700 text-sm font-medium">
            Total Sales
          </p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            ฿1,280
          </h2>
        </div>

        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md flex items-center justify-center">
          <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800">
            Withdraw Money
          </button>
        </div>

      </div>

      {/* Transaction Table */}

      <div className="bg-white border border-gray-300 rounded-xl shadow-md">

        <div className="p-4 border-b border-gray-300">
          <h2 className="font-semibold text-lg text-black">
            Transaction History
          </h2>
        </div>

        <table className="w-full text-left">

          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-gray-900 font-semibold">
                ID
              </th>
              <th className="px-4 py-3 text-gray-900 font-semibold">
                Type
              </th>
              <th className="px-4 py-3 text-gray-900 font-semibold">
                Amount
              </th>
              <th className="px-4 py-3 text-gray-900 font-semibold">
                Date
              </th>
            </tr>
          </thead>

          <tbody>

            {transactions.map((tx) => (

              <tr key={tx.id} className="border-t border-gray-300 hover:bg-gray-50">

                <td className="px-4 py-3 text-gray-900 font-medium">
                  {tx.id}
                </td>

                <td className="px-4 py-3 text-gray-900">
                  {tx.type}
                </td>

                <td
                  className={`px-4 py-3 font-semibold ${
                    tx.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.amount > 0 ? "+" : "-"}฿{Math.abs(tx.amount)}
                </td>

                <td className="px-4 py-3 text-gray-900">
                  {tx.date}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}