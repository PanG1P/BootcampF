export interface Wallet {
  id: number;
  user_id: number;
  balance: string; // backend ส่งเป็น string (decimal)
}

export interface WalletPayload {
  user_id?: number;
  balance: number | string;
}

export interface WalletLog {
  id: number;
  user_id: number;
  order_id: number | null; // บาง transaction ไม่มี order
  amount: string;
  created_at: string;
}