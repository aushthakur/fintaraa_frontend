import { emitAuthChanged } from "@/lib/authEvents";

export type AuthType = "admin" | "employee" | "user" | "agency";

export const getAuthType = (): AuthType | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("authType");
  if (
    stored === "admin" ||
    stored === "employee" ||
    stored === "user" ||
    stored === "agency"
  ) {
    return stored;
  }
  return null;
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const authType = getAuthType();
  if (authType === "user") return localStorage.getItem("token");
  if (authType === "agency") return localStorage.getItem("agencyToken");
  if (authType === "employee") return localStorage.getItem("employeeToken");
  if (authType === "admin") return localStorage.getItem("adminToken");
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("agencyToken") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("employeeToken")
  );
};

export const isUserLoggedIn = (): boolean =>
  typeof window !== "undefined" &&
  getAuthType() === "user" &&
  Boolean(getAuthToken());

export const setAuthSession = (type: AuthType, token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("authType", type);
  if (type === "user") {
    localStorage.setItem("token", token);
    localStorage.removeItem("agencyToken");
    localStorage.removeItem("agencyUser");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("employeeToken");
  } else if (type === "admin") {
    localStorage.setItem("adminToken", token);
    localStorage.removeItem("token");
    localStorage.removeItem("agencyToken");
    localStorage.removeItem("agencyUser");
    localStorage.removeItem("employeeToken");
  } else if (type === "agency") {
    localStorage.setItem("agencyToken", token);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("employeeToken");
  } else {
    localStorage.setItem("employeeToken", token);
    localStorage.removeItem("token");
    localStorage.removeItem("agencyToken");
    localStorage.removeItem("agencyUser");
    localStorage.removeItem("adminToken");
  }
  emitAuthChanged();
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  localStorage.clear();
  emitAuthChanged();
};
