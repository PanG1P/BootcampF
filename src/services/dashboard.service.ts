import { apiFetch, getAuthHeaders } from "./api";
import type { DashboardSummary } from "@/types/dashboard";

export async function getDashboardSummary(shopId: number, token: string) {
  return apiFetch<DashboardSummary>(`/dashboard/shop/${shopId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}