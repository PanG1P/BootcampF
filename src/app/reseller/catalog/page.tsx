import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
};

const products: Product[] = [
  { id: "C001", name: "Oversize T-Shirt", price: 390, stock: 80, image: "https://via.placeholder.com/300" },
  { id: "C002", name: "Hoodie Streetwear", price: 890, stock: 40, image: "https://via.placeholder.com/300" },
  { id: "C003", name: "Cargo Pants", price: 990, stock: 35, image: "https://via.placeholder.com/300" },
  { id: "C004", name: "Denim Jacket", price: 1290, stock: 25, image: "https://via.placeholder.com/300" },
  { id: "C005", name: "Basic Shirt", price: 450, stock: 70, image: "https://via.placeholder.com/300" },
  { id: "C006", name: "Sport Shorts", price: 320, stock: 60, image: "https://via.placeholder.com/300" },
  { id: "C007", name: "Black Hoodie", price: 850, stock: 30, image: "https://via.placeholder.com/300" },
  { id: "C008", name: "Street Cap", price: 250, stock: 90, image: "https://via.placeholder.com/300" },
];

export default function CatalogPage() {
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Clothing Catalog</h1>

      <div className="grid grid-cols-4 gap-6">

        {products.map((product) => (

          <div
            key={product.id}
            className="relative group border rounded-xl p-4 shadow-sm bg-white"
          >

            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />

            <h2 className="font-semibold mt-3">{product.name}</h2>

            <p className="text-green-600 font-bold">
              ฿{product.price}
            </p>

            <p className="text-sm text-gray-500">
              Stock left: {product.stock}
            </p>

            {/* Hover Popup */}
            <div className="absolute inset-0 bg-black/80 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition rounded-xl">

              <p className="text-lg font-bold">
                {product.name}
              </p>

              <p className="mt-1">
                Price: ฿{product.price}
              </p>

              <p className="mt-1">
                Stock left: {product.stock}
              </p>

              <Link href={`/shop/${product.id}`}>
                <button className="mt-3 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                  Order Now
                </button>
              </Link>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}