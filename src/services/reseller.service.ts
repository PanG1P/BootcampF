import { apiFetch, getAuthHeaders } from "./api";
import type { ApiResponse } from "@/types/auth";
import type { Reseller } from "@/types/reseller";

export async function getResellers(token: string) {
  return apiFetch<ApiResponse<Reseller[]>>("/api/admin/resellers", {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}

export async function approveReseller(id: number, token: string) {
  return apiFetch<ApiResponse>(`/api/admin/resellers/${id}/approve`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
  });
}

export async function rejectReseller(id: number, token: string) {
  return apiFetch<ApiResponse>(`/api/admin/resellers/${id}/reject`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
  });
}