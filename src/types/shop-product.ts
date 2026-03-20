export type ShopProduct = {
  id: number;
  shop_id: number;
  product_id: number;
  product_name?: string;
  selling_price: number;
  quantity?: number;
};

export type ShopProductPayload = {
  shop_id: number;
  product_id: number;
  selling_price: number;
};