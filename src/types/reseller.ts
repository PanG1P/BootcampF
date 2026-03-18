export interface Reseller {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  address: string | null;
  createdAt: string;
}