import { apiFetch, getAuthHeaders } from "./api";
import type {
  Order,
  OrderItem,
  OrderItemPayload,
  OrderPayload,
} from "@/types/order";

export async function getOrders(token: string) {
  return apiFetch<Order[]>("/orders", {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}

export async function createOrder(payload: OrderPayload, token: string) {
  return apiFetch<Order>("/orders", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function getOrderById(id: number, token: string) {
  return apiFetch<Order>(`/orders/${id}`, {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}

export async function getOrdersByShopId(shopId: number, token: string) {
  return apiFetch<Order[]>(`/orders/shop/${shopId}`, {
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
  return apiFetch<Order>(
    `/orders/${id}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PUT",
      headers: getAuthHeaders(token),
    }
  );
}

export async function deleteOrder(id: number, token: string) {
  return apiFetch<string>(`/orders/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
}

export async function getOrderItems(orderId: number, token: string) {
  return apiFetch<OrderItem[]>(`/order-items/order/${orderId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}

export async function createOrderItem(
  payload: OrderItemPayload,
  token: string
) {
  return apiFetch<OrderItem>("/order-items", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}