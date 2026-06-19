export const getSafeRedirectTarget = (
  value?: string | null,
  fallback = "/account/profile",
) => {
  const target = String(value || "").trim();
  if (!target) return fallback;
  if (!target.startsWith("/") || target.startsWith("//")) return fallback;
  if (target === "/login" || target.startsWith("/login?")) return fallback;
  return target;
};

export const buildLoginRedirectHref = ({
  redirectTo,
  referrer,
  product,
  fallback = "/account/profile",
}: {
  redirectTo?: string | null;
  referrer?: string | null;
  product?: string;
  fallback?: string;
}) => {
  const params = new URLSearchParams();
  params.set("referrer", getSafeRedirectTarget(redirectTo || referrer, fallback));
  if (product) params.set("product", product);
  return `/login?${params.toString()}`;
};
