export const slugifyProduct = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const loanProductSlugs = new Set(
  loanProductCatalog.map((product) => product.slug),
);

export const isLoanProduct = (titleOrSlug: string) =>
  loanProductSlugs.has(slugifyProduct(titleOrSlug));

export const insuranceProductSlugs = new Set(
  insuranceProductCatalog.map((product) => product.slug),
);

export const isInsuranceProduct = (titleOrSlug: string) =>
  insuranceProductSlugs.has(slugifyProduct(titleOrSlug));

export const productHref = (title: string) => {
  const slug = slugifyProduct(title);
  if (slug === "itr-filing") return "/itr-filing";
  if (
    slug === "gst-registration" ||
    slug === "gst-registration-and-return-filing"
  )
    return "/gst-registration";
  if (slug === "company-registration") return "/company-registration";
  if (slug === "roc-filing") return "/company-registration";
  if (slug === "msme-registration") return "/msme-registration";
  if (slug === "annual-compliance") return "/annual-compliance";
  if (slug === "project-report") return "/project-report";
  if (slug === "tax-compliance" || slug === "tax-compliances")
    return "/tax-compliance";
  if (slug === "refer-and-earn" || slug === "refer-earn")
    return "/refer-and-earn";
  if (slug === "offers" || slug === "offers-and-rewards") return "/offers";
  if (slug === "application-status" || slug === "my-application-status")
    return "/application-status";
  if (slug === "about-us" || slug === "about") return "/about-us";
  if (slug === "careers" || slug === "career") return "/careers";
  if (slug === "franchise") return "/franchise";
  if (slug === "become-dsa") return "/become-dsa";
  if (slug === "contact-us") return "/contact-us";
  if (slug === "support") return "/support";
  if (
    slug === "blog" ||
    slug === "blogs" ||
    slug === "blog-and-articles" ||
    slug === "articles"
  )
    return "/blog";
  if (
    slug === "press-release" ||
    slug === "media-and-press-release" ||
    slug === "press"
  )
    return "/press-release";
  if (slug === "site-map" || slug === "sitemap") return "/sitemap.xml";
  if (slug === "feedback") return "/feedback";
  if (slug === "subscribe") return "/contact-us";
  if (slug === "awards-and-recognitions") return "/about-us";
  if (slug === "faq" || slug === "faqs" || slug === "faq-s")
    return "/faqs";
  if (
    slug === "cibil-score" ||
    slug === "cibil-score-check" ||
    slug === "credit-score"
  )
    return "/cibil-score";
  if (slug === "credit-card" || slug === "credit-cards") return "/credit-cards";
  if (slug === "all-others-credit-cards") return "/credit-cards";
  if (slug === "view-all-cards") return "/credit-cards";
  if (slug === "view-all-loans" || slug === "view-all-insurance")
    return "/products";
  if (
    isLoanProduct(slug) ||
    isInsuranceProduct(slug) ||
    slug.endsWith("-loan") ||
    slug.endsWith("-insurance")
  ) {
    return `/products/${slug}`;
  }
  return `/login?product=${slug}`;
};

export type ParsedLoanLocation = {
  country: string;
  state: string;
  city: string;
  pincode: string;
  area: string;
};

export const humanizeSlug = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const parseLoanLocation = (
  segments: string[] = [],
): ParsedLoanLocation => {
  const clean = segments.map(decodeURIComponent).map(humanizeSlug);
  const hasCountry = clean.length >= 5;
  return {
    country: hasCountry ? clean[0] || "India" : "India",
    state: hasCountry ? clean[1] || "" : clean[0] || "",
    city: hasCountry ? clean[2] || "" : clean[1] || "",
    pincode: hasCountry ? clean[3] || "" : clean[2] || "",
    area: hasCountry ? clean.slice(4).join(" ") : clean.slice(3).join(" "),
  };
};

export const buildLoanPath = (
  loanTypeSlug: string,
  location?: Partial<ParsedLoanLocation>,
) => {
  const parts = [
    "/products",
    slugifyProduct(loanTypeSlug),
    location?.state && slugifyProduct(location.state),
    location?.city && slugifyProduct(location.city),
    location?.pincode && slugifyProduct(location.pincode),
    location?.area && slugifyProduct(location.area),
  ].filter(Boolean);
  return parts.join("/");
};
import {
  insuranceProductCatalog,
  loanProductCatalog,
} from "@/data/productCatalog";
