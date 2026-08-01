export type AttributionQueryParams = Record<string, string | string[]>;

export type WebsiteAttribution = {
  source: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  landingPage: string;
  referrer?: string;
  gclid?: string;
  fbclid?: string;
  dsaReferralCode?: string;
  queryParams?: AttributionQueryParams;
  lastTouchPage?: string;
  lastTouchQueryParams?: AttributionQueryParams;
  lastTouchAt?: string;
  capturedAt: string;
};

const STORAGE_KEY = "fintaraa_first_touch_attribution";
const SENSITIVE_QUERY_KEYS = new Set([
  "token",
  "access_token",
  "refresh_token",
  "otp",
  "code",
  "password",
  "mobile",
  "phone",
  "email",
  "pan",
  "aadhaar",
]);

const trimmed = (value: string | null | undefined, max = 300) =>
  String(value || "").trim().slice(0, max);

export const websiteQueryParams = (
  params: URLSearchParams,
): AttributionQueryParams => {
  const result: AttributionQueryParams = {};
  Array.from(new Set(params.keys()))
    .slice(0, 60)
    .forEach((key) => {
      const normalizedKey = trimmed(key, 100);
      if (
        !normalizedKey ||
        SENSITIVE_QUERY_KEYS.has(normalizedKey.toLowerCase())
      ) {
        return;
      }
      const values = params
        .getAll(key)
        .map((value) => trimmed(value, 500))
        .filter(Boolean)
        .slice(0, 10);
      if (!values.length) return;
      result[normalizedKey] = values.length === 1 ? values[0] : values;
    });
  return result;
};

const queryParamsFromPage = (page: string) => {
  try {
    return websiteQueryParams(new URL(page, "https://fintaraa.invalid").searchParams);
  } catch {
    return {};
  }
};

const dsaCodeFromParams = (params: URLSearchParams) => {
  const value = trimmed(
    params.get("dsa") || params.get("dsaCode") || params.get("dsaReferralCode"),
    40,
  ).toUpperCase();
  return /^[A-Z0-9_-]{4,40}$/.test(value) ? value : undefined;
};

const inferSource = (params: URLSearchParams, referrer: string) => {
  const explicit = trimmed(
    params.get("utm_source") ||
      params.get("source") ||
      params.get("lead_source"),
    120,
  ).toLowerCase();
  if (explicit) return explicit;
  if (params.get("gclid")) return "google_ads";
  if (params.get("fbclid")) return "meta_ads";
  if (dsaCodeFromParams(params)) return "dsa_referral";
  if (params.get("ref") || params.get("referralCode")) return "referral";

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();
    if (
      hostname.includes("google.") ||
      hostname.includes("bing.") ||
      hostname.includes("yahoo.")
    ) {
      return "seo";
    }
    if (hostname.includes("wa.me") || hostname.includes("whatsapp.")) {
      return "whatsapp";
    }
    if (hostname) return "referral";
  } catch {
    // Direct visits have no usable referrer.
  }
  return "direct";
};

export const captureWebsiteAttribution = (): WebsiteAttribution => {
  if (typeof window === "undefined") {
    return {
      source: "direct",
      landingPage: "/",
      capturedAt: new Date(0).toISOString(),
    };
  }

  const params = new URLSearchParams(window.location.search);
  const currentQueryParams = websiteQueryParams(params);
  const currentPage = `${window.location.pathname}${window.location.search}`.slice(
    0,
    1000,
  );
  const incomingDsaCode = dsaCodeFromParams(params);
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing) as WebsiteAttribution;
      const hydratedQueryParams =
        parsed.queryParams || queryParamsFromPage(parsed.landingPage);
      const hasCurrentQuery = Object.keys(currentQueryParams).length > 0;
      const next: WebsiteAttribution = {
        ...parsed,
        queryParams: hydratedQueryParams,
        ...(hasCurrentQuery
          ? {
              lastTouchPage: currentPage,
              lastTouchQueryParams: currentQueryParams,
              lastTouchAt: new Date().toISOString(),
            }
          : {}),
      };
      if (incomingDsaCode && !parsed.dsaReferralCode) {
        Object.assign(next, {
          source: parsed.source === "direct" ? "dsa_referral" : parsed.source,
          dsaReferralCode: incomingDsaCode,
        });
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  const referrer = trimmed(document.referrer, 1000);
  const attribution: WebsiteAttribution = {
    source: inferSource(params, referrer),
    medium: trimmed(params.get("utm_medium"), 120) || undefined,
    campaign: trimmed(params.get("utm_campaign"), 160) || undefined,
    term: trimmed(params.get("utm_term"), 160) || undefined,
    content: trimmed(params.get("utm_content"), 160) || undefined,
    landingPage: currentPage,
    referrer: referrer || undefined,
    gclid: trimmed(params.get("gclid"), 240) || undefined,
    fbclid: trimmed(params.get("fbclid"), 240) || undefined,
    dsaReferralCode: incomingDsaCode,
    queryParams: currentQueryParams,
    capturedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
};

export const getWebsiteAttribution = () => captureWebsiteAttribution();

export const attributionRegistrationSource = (
  attribution = getWebsiteAttribution(),
) => {
  const source = attribution.source.toLowerCase();
  if (source === "referral" || source === "dsa_referral") return "referral";
  if (source.includes("whatsapp") || source === "wa") return "whatsapp";
  if (
    source.includes("ads") ||
    source.includes("paid") ||
    Boolean(attribution.gclid || attribution.fbclid)
  ) {
    return "paid";
  }
  if (source === "seo" || source === "organic" || source === "direct") {
    return "organic";
  }
  return "website";
};
