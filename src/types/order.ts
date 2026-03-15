export interface Order {
  id: string;
  customer: string;
  total: number;
  status: "Pending" | "Paid" | "Shipped" | "Cancelled";
  date: string;
}