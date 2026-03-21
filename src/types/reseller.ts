export interface Reseller {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: "pending" | "approved" | "rejected" | "suspended";
  address: string | null;
  createdAt: string;
}