import { apiFetch, getAuthHeaders } from "./api";
import type { Order } from "@/types/order";

export async function getOrders(token: string) {
  return apiFetch<Order[]>("/orders", {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}

export async function getOrderById(id: number, token: string) {
  return apiFetch<Order>(`/orders/${id}`, {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}

export async function updateOrderStatus(
  id: number,
  status: string,
  token: string
) {
  return apiFetch<Order>(`/orders/${id}/status`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export async function deleteOrder(id: number, token: string) {
  return apiFetch<string>(`/orders/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
}