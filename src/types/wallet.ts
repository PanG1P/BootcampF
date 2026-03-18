export interface Wallet {
  id: number;
  user_id: number;
  balance: string;
}

export interface WalletLog {
  id: number;
  user_id: number;
  order_id: number;
  amount: string;
  created_at: string;
}