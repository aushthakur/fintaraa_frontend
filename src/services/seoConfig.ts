export const siteName = "Fintaraa";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://fintaraa.com"
).replace(/\/+$/, "");

export const defaultSeoDescription =
  "Fintaraa helps customers compare loans, credit cards, insurance, CIBIL support, registrations, and assisted financial services from trusted partners.";

export const defaultOgImage = "/opengraph-image";

export const absoluteUrl = (path = "/") => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
};

export const noIndexRobots = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
} as const;

export const indexRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
} as const;

export const coreSitemapRoutes = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/products", priority: 0.95, changeFrequency: "daily" },
  { path: "/credit-cards", priority: 0.9, changeFrequency: "daily" },
  { path: "/cibil-score", priority: 0.85, changeFrequency: "weekly" },
  { path: "/gst-registration", priority: 0.85, changeFrequency: "weekly" },
  { path: "/itr-filing", priority: 0.85, changeFrequency: "weekly" },
  { path: "/company-registration", priority: 0.8, changeFrequency: "weekly" },
  { path: "/offers", priority: 0.75, changeFrequency: "daily" },
  { path: "/blog", priority: 0.75, changeFrequency: "daily" },
  { path: "/partners", priority: 0.65, changeFrequency: "weekly" },
  { path: "/partners-by-product", priority: 0.65, changeFrequency: "weekly" },
  { path: "/franchise", priority: 0.65, changeFrequency: "weekly" },
  { path: "/become-dsa", priority: 0.65, changeFrequency: "weekly" },
  { path: "/careers", priority: 0.6, changeFrequency: "weekly" },
  { path: "/about-us", priority: 0.55, changeFrequency: "monthly" },
  { path: "/contact-us", priority: 0.55, changeFrequency: "monthly" },
  { path: "/support", priority: 0.5, changeFrequency: "weekly" },
  { path: "/tools", priority: 0.5, changeFrequency: "weekly" },
  { path: "/app", priority: 0.45, changeFrequency: "monthly" },
  { path: "/privacy-policy", priority: 0.35, changeFrequency: "yearly" },
  { path: "/terms-and-conditions", priority: 0.35, changeFrequency: "yearly" },
  { path: "/grievance", priority: 0.35, changeFrequency: "yearly" },
  { path: "/loan-disclosure", priority: 0.35, changeFrequency: "yearly" },
] as const;
