import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
};

const products: Product[] = [
  { id: "C001", name: "Oversize T-Shirt", price: 390, stock: 80, image: "https://via.placeholder.com/400" },
  { id: "C002", name: "Hoodie Streetwear", price: 890, stock: 40, image: "https://via.placeholder.com/400" },
  { id: "C003", name: "Cargo Pants", price: 990, stock: 35, image: "https://via.placeholder.com/400" },
  { id: "C004", name: "Denim Jacket", price: 1290, stock: 25, image: "https://via.placeholder.com/400" },
  { id: "C005", name: "Basic Shirt", price: 450, stock: 70, image: "https://via.placeholder.com/400" },
  { id: "C006", name: "Sport Shorts", price: 320, stock: 60, image: "https://via.placeholder.com/400" },
  { id: "C007", name: "Black Hoodie", price: 850, stock: 30, image: "https://via.placeholder.com/400" },
  { id: "C008", name: "Street Cap", price: 250, stock: 90, image: "https://via.placeholder.com/400" },
];

export default function ShopPage() {
  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-8 text-slate-800">
        🛍️ Shop Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {products.map((product) => (
          <Link
            key={product.id}
            href={`/checkout?id=${product.id}&name=${product.name}&price=${product.price}`}
            className="group"
          >

            <div className="relative bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">

              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-4">
                <h2 className="font-semibold text-slate-800">
                  {product.name}
                </h2>

                <p className="text-green-600 font-bold mt-1">
                  ฿{product.price}
                </p>

                <p className="text-sm text-gray-500">
                  Stock: {product.stock}
                </p>
              </div>

              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <span className="text-white font-semibold text-lg">
                  View Product
                </span>
              </div>

            </div>

          </Link>
        ))}

      </div>

    </div>
  );
}