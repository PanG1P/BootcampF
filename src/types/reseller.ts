export interface Reseller {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  shopName?: string;
}