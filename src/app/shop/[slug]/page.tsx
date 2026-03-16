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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  const product = products.find((p) => p.id === slug);

  if (!product) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="p-10">

      <div className="grid grid-cols-2 gap-10">

        {/* รูปสินค้า */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl"
          />
        </div>

        {/* รายละเอียดสินค้า */}
        <div>

          <h1 className="text-3xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-2xl text-green-600 font-semibold mb-4">
            ฿{product.price}
          </p>

          <p className="text-gray-600 mb-6">
            Stock available: {product.stock}
          </p>

          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
            Buy Now
          </button>

        </div>

      </div>

    </div>
  );
}