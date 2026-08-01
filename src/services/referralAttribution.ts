export const REFERRAL_CODE_STORAGE_KEY = "fintaraa_referral_code";
export const REFERRAL_VISITOR_STORAGE_KEY = "fintaraa_referral_visitor_id";

export type PendingReferralAttribution = {
  referralCode: string;
  referralVisitorId: string;
};

export const normalizeReferralCode = (value?: string) =>
  String(value || "")
    .trim()
    .toUpperCase();

const browserStorage = (kind: "local" | "session") => {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

const removeReferralKeys = (storage: Storage | null) => {
  if (!storage) return;
  try {
    storage.removeItem(REFERRAL_CODE_STORAGE_KEY);
    storage.removeItem(REFERRAL_VISITOR_STORAGE_KEY);
  } catch {
    // Storage can be blocked by the browser. Attribution still works in-memory.
  }
};

const createVisitorId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * Referral signup intent is intentionally session-scoped. Persistent keys from
 * older releases are purged so a later person using the browser cannot inherit
 * an abandoned referral.
 */
export const prepareReferralLanding = (
  rawReferralCode: string | undefined,
  persistForSignup: boolean,
): PendingReferralAttribution | undefined => {
  const referralCode = normalizeReferralCode(rawReferralCode);
  if (!referralCode || typeof window === "undefined") return undefined;

  removeReferralKeys(browserStorage("local"));
  const session = browserStorage("session");

  if (!persistForSignup) {
    removeReferralKeys(session);
    return {
      referralCode,
      referralVisitorId: createVisitorId(),
    };
  }

  let storedCode = "";
  let storedVisitorId = "";
  try {
    storedCode = normalizeReferralCode(
      session?.getItem(REFERRAL_CODE_STORAGE_KEY) || undefined,
    );
    storedVisitorId = String(
      session?.getItem(REFERRAL_VISITOR_STORAGE_KEY) || "",
    ).trim();
  } catch {
    // Fall through to a fresh in-memory visitor id.
  }

  const referralVisitorId =
    storedCode === referralCode && storedVisitorId
      ? storedVisitorId
      : createVisitorId();

  try {
    session?.setItem(REFERRAL_CODE_STORAGE_KEY, referralCode);
    session?.setItem(REFERRAL_VISITOR_STORAGE_KEY, referralVisitorId);
  } catch {
    // The returned value keeps the active signup attributable without storage.
  }

  return { referralCode, referralVisitorId };
};

export const clearPendingReferralAttribution = () => {
  removeReferralKeys(browserStorage("session"));
  removeReferralKeys(browserStorage("local"));
};
