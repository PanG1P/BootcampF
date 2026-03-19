import { apiFetch } from "./api";
import type { ApiResponse } from "@/types/auth";
import type { Shop } from "@/types/shop";

export async function getShopBySlug(slug: string) {
  const res = await apiFetch<ApiResponse<Shop>>(`/api/shop/${slug}`, {
    method: "GET",
    cache: "no-store",
  });

  return res.data;
}