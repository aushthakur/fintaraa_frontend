const rawBaseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").trim();

export const apiRootUrl = rawBaseUrl
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    return `/backend-api${normalizedPath}`;
  }
  if (!apiRootUrl) return "";
  return `${apiRootUrl}/api${normalizedPath}`;
};
