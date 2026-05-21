import { emitAuthChanged } from "@/lib/authEvents";

export type AuthType = "admin" | "employee";

export const getAuthType = (): AuthType | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("authType");
  if (stored === "admin" || stored === "employee") return stored;
  return null;
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const authType = getAuthType();
  if (authType === "employee") return localStorage.getItem("employeeToken");
  if (authType === "admin") return localStorage.getItem("adminToken");
  return (
    localStorage.getItem("adminToken") ||
    localStorage.getItem("employeeToken") ||
    localStorage.getItem("token")
  );
};

export const setAuthSession = (type: AuthType, token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("authType", type);
  if (type === "admin") {
    localStorage.setItem("adminToken", token);
    localStorage.removeItem("employeeToken");
  } else {
    localStorage.setItem("employeeToken", token);
    localStorage.removeItem("adminToken");
  }
  emitAuthChanged();
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  localStorage.clear();
  emitAuthChanged();
};
