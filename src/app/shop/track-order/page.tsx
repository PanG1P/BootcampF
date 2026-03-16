"use client";

import { useState } from "react";

export default function TrackOrderPage() {

  const orders = [
    {
      id: "ORD001",
      product: "Oversize T-Shirt",
      status: "Preparing"
    },
    {
      id: "ORD002",
      product: "Hoodie Black",
      status: "Shipping"
    },
    {
      id: "ORD003",
      product: "Cap Limited",
      status: "Delivered"
    }
  ];

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const getStep = (status: string) => {
    if (status === "Preparing") return 1;
    if (status === "Shipping") return 2;
    if (status === "Delivered") return 3;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-black mb-10 text-center">
          Track Your Order
        </h1>

        {/* Order List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

          <h2 className="text-xl font-semibold text-black mb-4">
            Your Orders
          </h2>

          <div className="space-y-4">

            {orders.map((order) => (

              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="flex justify-between items-center border p-4 rounded-xl cursor-pointer hover:bg-gray-50 hover:shadow transition"
              >

                <div>
                  <p className="font-semibold text-black">
                    {order.product}
                  </p>

                  <p className="text-sm text-gray-500">
                    Order ID: {order.id}
                  </p>
                </div>

                <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
                  View
                </button>

              </div>

            ))}

          </div>

        </div>

        {/* Order Status */}
        {selectedOrder && (

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-semibold text-black mb-6">
              Order Status
            </h2>

            <div className="mb-8">

              <p className="text-black">
                Product: <span className="font-semibold">{selectedOrder.product}</span>
              </p>

              <p className="text-gray-600">
                Order ID: {selectedOrder.id}
              </p>

            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between">

              {["Preparing", "Shipping", "Delivered"].map((step, index) => {

                const active = getStep(selectedOrder.status) >= index + 1;

                return (
                  <div key={step} className="flex flex-col items-center flex-1">

                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold
                      ${active ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      {index + 1}
                    </div>

                    <p
                      className={`mt-2 text-sm font-medium
                      ${active ? "text-green-600" : "text-gray-400"}`}
                    >
                      {step}
                    </p>

                    {index !== 2 && (
                      <div className={`h-1 w-full mt-3
                      ${active ? "bg-green-500" : "bg-gray-300"}`}></div>
                    )}

                  </div>
                );

              })}

            </div>

          </div>

        )}

      </div>

    </div>
  );
}