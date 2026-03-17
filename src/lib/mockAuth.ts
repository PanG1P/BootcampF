export type UserRole = "admin" | "reseller";
export type ResellerStatus = "approved" | "pending" | "rejected";

export type MockUser = {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  status?: ResellerStatus;
};

export const mockUsers: MockUser[] = [
  {
    id: 1,
    email: "admin@example.com",
    password: "12345678",
    role: "admin",
    name: "System Admin",
  },
  {
    id: 2,
    email: "approved@example.com",
    password: "12345678",
    role: "reseller",
    name: "Approved Reseller",
    status: "approved",
  },
  {
    id: 3,
    email: "pending@example.com",
    password: "12345678",
    role: "reseller",
    name: "Pending Reseller",
    status: "pending",
  },
  {
    id: 4,
    email: "rejected@example.com",
    password: "12345678",
    role: "reseller",
    name: "Rejected Reseller",
    status: "rejected",
  },
];

export function loginMock(email: string, password: string) {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    };
  }

  if (user.role === "admin") {
    return {
      success: true,
      user,
      redirectTo: "/admin/dashboard",
    };
  }

  if (user.role === "reseller") {
    if (user.status === "approved") {
      return {
        success: true,
        user,
        redirectTo: "/reseller/dashboard",
      };
    }

    if (user.status === "pending") {
      return {
        success: false,
        message: "บัญชีรออนุมัติ กรุณารอการติดต่อ",
      };
    }

    if (user.status === "rejected") {
      return {
        success: false,
        message: "บัญชีนี้ไม่ได้รับการอนุมัติ",
      };
    }
  }

  return {
    success: false,
    message: "เกิดข้อผิดพลาด",
  };
}