import { apiFetch, getAuthHeaders } from "./api";
import type { Product, ProductPayload } from "@/types/product";

export async function getProducts(token: string) {
  return apiFetch<Product[]>("/admin/product", {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}

export async function getProductById(id: number, token: string) {
  return apiFetch<Product>(`/admin/product/${id}`, {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}

export async function createProduct(payload: ProductPayload, token: string) {
  return apiFetch<Product>("/admin/product", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(
  id: number,
  payload: ProductPayload,
  token: string
) {
  return apiFetch<Product>(`/admin/product/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: number, token: string) {
  return apiFetch<string>(`/admin/product/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
}