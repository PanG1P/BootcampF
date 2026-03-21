import { apiFetch } from "./api";
import type { ApiResponse } from "@/types/auth";
import type { Shop } from "@/types/shop";

// 💡 แก้ไขให้ดึงข้อมูลจาก Path ที่ถูกต้อง (ลองเติม s หรือไม่เติมตาม Backend)
export async function getShopBySlug(id: string | number) { // รับมาชื่อ id
  const res = await apiFetch<ApiResponse<Shop>>(`/api/shop/id/${id}`, { // 💡 ต้องใช้ ${id} ให้ตรงกัน
    method: "GET",
    cache: "no-store",
  });

  return res.data;
}