import { apiFetch, getAuthHeaders } from "./api";
import type {
  ApiResponse,
  LoginResponse,
  RegisterFormData,
} from "@/types/auth";

type LoginPayload = {
  email: string;
  password: string;
};

export async function adminLogin(payload: LoginPayload) {
  return apiFetch<LoginResponse>("/api/auth/login/admin", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function resellerLogin(payload: LoginPayload) {
  return apiFetch<LoginResponse>("/api/auth/login/reseller", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function registerReseller(payload: RegisterFormData) {
  return apiFetch<ApiResponse>("/api/auth/register", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}