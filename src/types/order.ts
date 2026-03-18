export interface Order {
  id: number;
  order_number: string | null;
  shop_id: number;
  total_amount: string;
  reseller_profit: string | null;
  status: string;
  created_at: string;
}