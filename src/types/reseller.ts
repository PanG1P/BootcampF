export interface Reseller {
  id: number;
  name: string;
  email: string;
  shopName: string;
  status: "Pending" | "Approved" | "Rejected";
}