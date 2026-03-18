export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  cost_price: string;
  min_price: string;
  stock: number;
  created_at?: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  image_url: string;
  cost_price: string;
  min_price: string;
  stock: number;
}