// "use client";

// import { Suspense, useMemo, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { createOrder, createOrderItem } from "@/services/order.service";

// function CheckoutContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const productId = Number(searchParams.get("id") || 0);
//   const productName = searchParams.get("name") || "Product";
//   const productPrice = Number(searchParams.get("price") || 0);
//   const shopId = Number(searchParams.get("shopId") || 0);

//   const [quantity, setQuantity] = useState(1);

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [info, setInfo] = useState("");

//   const shipping = 50;

//   const subtotal = useMemo(() => {
//     return productPrice * quantity;
//   }, [productPrice, quantity]);

//   const total = useMemo(() => {
//     return subtotal + shipping;
//   }, [subtotal]);

//   const formatCurrency = (value: number) => {
//     return new Intl.NumberFormat("th-TH", {
//       style: "currency",
//       currency: "THB",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     }).format(value);
//   };

//   const handleOrder = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       setInfo("");

//       const token = localStorage.getItem("token") || "";

//       if (!productId) {
//         throw new Error("ไม่พบ productId");
//       }

//       if (!shopId) {
//         throw new Error("ไม่พบ shopId กรุณากลับไปเลือกสินค้าจากหน้าร้านใหม่");
//       }

//       if (quantity <= 0) {
//         throw new Error("จำนวนสินค้าต้องมากกว่า 0");
//       }

//       if (!name.trim()) {
//         throw new Error("กรุณากรอกชื่อผู้รับ");
//       }

//       if (!phone.trim()) {
//         throw new Error("กรุณากรอกเบอร์โทร");
//       }

//       if (!address.trim()) {
//         throw new Error("กรุณากรอกที่อยู่จัดส่ง");
//       }

//       if (!token) {
//         throw new Error("ไม่พบ token กรุณาเข้าสู่ระบบใหม่");
//       }

//       setInfo("กำลังสร้างคำสั่งซื้อ...");

//       const createdOrder = await createOrder(
//         {
//           shop_id: shopId,
//           total_amount: total,
//           reseller_profit: 0,
//           status: "PENDING",
//         },
//         token
//       );

//       setInfo("กำลังบันทึกรายการสินค้า...");

//       await createOrderItem(
//         {
//           order_id: createdOrder.id,
//           product_id: productId,
//           cost_price: productPrice,
//           selling_price: productPrice,
//           quantity,
//         },
//         token
//       );

//       setInfo("สร้างคำสั่งซื้อสำเร็จ");

//       router.push(`/track-order?orderId=${createdOrder.id}`);
//     } catch (err) {
//       const message =
//         err instanceof Error ? err.message : "ไม่สามารถสร้างคำสั่งซื้อได้";
//       setError(message);
//       console.error("Checkout error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!productId || !productPrice) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-10">
//         <div className="mx-auto max-w-5xl rounded-xl border border-red-200 bg-red-50 p-6">
//           <h1 className="text-2xl font-bold text-red-700">
//             ข้อมูลสินค้าไม่ถูกต้อง
//           </h1>
//           <p className="mt-2 text-red-600">
//             กรุณากลับไปเลือกสินค้าจากหน้าร้านอีกครั้ง
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-10">
//       <div className="mx-auto max-w-5xl">
//         <h1 className="mb-8 text-4xl font-bold text-black">Checkout</h1>

//         {error && (
//           <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
//             {error}
//           </div>
//         )}

//         {info && (
//           <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-700">
//             {info}
//           </div>
//         )}

//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//           <div className="rounded-xl bg-white p-6 shadow-md">
//             <h2 className="mb-4 text-xl font-semibold text-black">
//               Shipping Information
//             </h2>

//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 className="w-full rounded-lg border p-3 text-black"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />

//               <input
//                 type="text"
//                 placeholder="Phone Number"
//                 className="w-full rounded-lg border p-3 text-black"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//               />

//               <textarea
//                 placeholder="Shipping Address"
//                 className="w-full rounded-lg border p-3 text-black"
//                 rows={4}
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//               />

//               <div>
//                 <label className="mb-2 block font-medium text-black">
//                   Quantity
//                 </label>
//                 <input
//                   type="number"
//                   min={1}
//                   value={quantity}
//                   onChange={(e) => setQuantity(Number(e.target.value) || 1)}
//                   className="w-32 rounded-lg border p-3 text-black"
//                 />
//               </div>
//             </div>

//             <div className="mt-6">
//               <h3 className="mb-2 font-semibold text-black">Payment Method</h3>

//               <div className="rounded-lg border bg-gray-50 p-4 font-medium text-black">
//                 💳 Online Payment
//               </div>
//             </div>

//             <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
//               ตอนนี้ backend ยังไม่ได้รับข้อมูลชื่อผู้รับ, เบอร์โทร และที่อยู่จัดส่ง
//               ฟอร์มนี้จึงใช้ตรวจสอบข้อมูลฝั่ง frontend ก่อนชั่วคราว
//             </div>
//           </div>

//           <div className="rounded-xl bg-white p-6 shadow-md">
//             <h2 className="mb-4 text-xl font-semibold text-black">
//               Order Summary
//             </h2>

//             <div className="mb-4 rounded-lg bg-gray-50 p-4">
//               <p className="font-semibold text-black">{productName}</p>
//               <p className="mt-1 text-sm text-gray-500">Product ID: {productId}</p>
//               <p className="mt-1 text-sm text-gray-500">Shop ID: {shopId || "-"}</p>
//             </div>

//             <div className="mb-2 flex justify-between text-black">
//               <span>Price</span>
//               <span>{formatCurrency(productPrice)}</span>
//             </div>

//             <div className="mb-2 flex justify-between text-black">
//               <span>Quantity</span>
//               <span>{quantity}</span>
//             </div>

//             <div className="mb-2 flex justify-between text-black">
//               <span>Subtotal</span>
//               <span>{formatCurrency(subtotal)}</span>
//             </div>

//             <div className="mb-2 flex justify-between text-black">
//               <span>Shipping</span>
//               <span>{formatCurrency(shipping)}</span>
//             </div>

//             <hr className="my-4" />

//             <div className="flex justify-between text-lg font-bold text-black">
//               <span>Total</span>
//               <span>{formatCurrency(total)}</span>
//             </div>

//             <button
//               onClick={handleOrder}
//               disabled={loading}
//               className="mt-6 w-full rounded-lg bg-black py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {loading ? "Processing..." : "Pay Now"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Page() {
//   return (
//     <Suspense fallback={<div className="p-10">Loading...</div>}>
//       <CheckoutContent />
//     </Suspense>
//   );
// }