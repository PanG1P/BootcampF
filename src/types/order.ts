export interface Order {
  id: number;
  order_number: string | null;
  shop_id: number;
  total_amount: string;
  reseller_profit: string | null;
  status: string;
  created_at: string;
}

export interface OrderPayload {
  shop_id: number;
  total_amount: number | string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  cost_price: string;
  selling_price: string | null;
  quantity: number;
}

export interface OrderItemPayload {
  order_id: number;
  product_id: number;
  cost_price: number | string;
  selling_price?: number | string | null;
  quantity: number;
}

export interface OrderPayload {
  shop_id: number;
  total_amount: number | string;
  reseller_profit?: number | string | null;
  status?: string;
}