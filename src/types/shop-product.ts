export type ProductInfo = {
  id?: number;
  name?: string;
  stock?: number | null;
  image?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
};

export type ShopProduct = {
  id: number;
  shop_id: number;
  product_id: number;
  product_name?: string;
  selling_price: number;
  quantity?: number;
  image?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  product?: ProductInfo;
};

export type ShopProductPayload = {
  shop_id: number;
  product_id: number;
  selling_price: number;
};