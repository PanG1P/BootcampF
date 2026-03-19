import { apiFetch, getAuthHeaders } from "./api";
import type { ShopProduct, ShopProductPayload } from "@/types/shop-product";

// public endpoint สำหรับหน้าร้านลูกค้า
export async function getPublicShopProducts(shopId: number) {
  return apiFetch<ShopProduct[]>(`/api/shop-products/shop/${shopId}`, {
    method: "GET",
    cache: "no-store",
  });
}

// protected endpoint สำหรับหน้า reseller หลังบ้าน
export async function getShopProducts(shopId: number, token: string) {
  return apiFetch<ShopProduct[]>(`/reseller/shop-product/shop/${shopId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}

export async function createShopProduct(
  payload: ShopProductPayload,
  token: string
) {
  return apiFetch<ShopProduct>("/reseller/shop-product", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function updateShopProduct(
  id: number,
  payload: ShopProductPayload,
  token: string
) {
  return apiFetch<ShopProduct>(`/reseller/shop-product/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function deleteShopProduct(id: number, token: string) {
  return apiFetch<string>(`/reseller/shop-product/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
}