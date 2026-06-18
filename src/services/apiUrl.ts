const rawBaseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "").trim();

export const apiRootUrl = rawBaseUrl
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

export const buildApiUrl = (path: string) => {
  if (!apiRootUrl) return "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${apiRootUrl}/api${normalizedPath}`;
};
