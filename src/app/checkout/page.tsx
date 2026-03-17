"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productName = searchParams.get("name");
  const productPrice = Number(searchParams.get("price") || 0);

  const shipping = 50;
  const total = productPrice + shipping;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleOrder = () => {
    router.push(`/track-order?name=${productName}&total=${total}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-black">
          Checkout
        </h1>

        <div className="grid grid-cols-2 gap-8">

          {/* Shipping */}
          <div className="bg-white p-6 rounded-xl shadow-md">

            <h2 className="text-xl font-semibold mb-4 text-black">
              Shipping Information
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full border p-3 rounded-lg text-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border p-3 rounded-lg text-black"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <textarea
                placeholder="Shipping Address"
                className="w-full border p-3 rounded-lg text-black"
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-black mb-2">
                Payment Method
              </h3>

              <div className="border p-4 rounded-lg bg-gray-50 font-medium">
                💳 Online Payment
              </div>
            </div>

          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-md">

            <h2 className="text-xl font-semibold mb-4 text-black">
              Order Summary
            </h2>

            <div className="flex justify-between text-black mb-2">
              <span>{productName}</span>
              <span>฿{productPrice}</span>
            </div>

            <div className="flex justify-between text-black mb-2">
              <span>Shipping</span>
              <span>฿{shipping}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-lg text-black">
              <span>Total</span>
              <span>฿{total}</span>
            </div>

            <button
              onClick={handleOrder}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Pay Now
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}