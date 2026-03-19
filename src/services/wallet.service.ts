import { apiFetch, getAuthHeaders } from "./api";
import type { Wallet, WalletLog, WalletPayload } from "@/types/wallet";

export async function getWalletByUserId(userId: number, token: string) {
  return apiFetch<Wallet>(`/wallet/user/${userId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}

export async function createWallet(payload: WalletPayload, token: string) {
  return apiFetch<Wallet>("/wallet", {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function depositWallet(
  userId: number,
  payload: WalletPayload,
  token: string
) {
  return apiFetch<Wallet>(`/wallet/user/${userId}/deposit`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function withdrawWallet(
  userId: number,
  payload: WalletPayload,
  token: string
) {
  return apiFetch<Wallet>(`/wallet/user/${userId}/withdraw`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function getWalletLogs(userId: number, token: string) {
  return apiFetch<WalletLog[]>(`/wallet-logs/user/${userId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
    cache: "no-store",
  });
}