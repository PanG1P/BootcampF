export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  status: string | null;
  message: string;
  userId?: number | null;
  shopId?: number | null;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  shop_name: string;
  address: string;
}

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}