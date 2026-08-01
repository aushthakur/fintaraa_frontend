import { getAuthToken } from "@/hooks/authStorage";
import { getWebsiteAttribution } from "@/services/attribution";

export type ApplicationJourneyAction =
  | "start"
  | "continue"
  | "submitted"
  | "abandoned";

const journeyKey = (flowKey: string, productSlug: string) =>
  `fintaraa_application_journey:${flowKey}:${productSlug}`;

export const getApplicationJourneyId = (
  flowKey: string,
  productSlug: string,
) => {
  const key = journeyKey(flowKey, productSlug);
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;
  const value =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem(key, value);
  return value;
};

export const completeApplicationJourney = (
  flowKey: string,
  productSlug: string,
) => {
  window.sessionStorage.removeItem(journeyKey(flowKey, productSlug));
};

export const trackApplicationJourney = ({
  action,
  category,
  flowKey,
  productName,
  productSlug,
  journeyId,
  stepIndex,
  totalSteps,
  resumeUrl,
  whatsappConsent,
}: {
  action: ApplicationJourneyAction;
  category: "loan" | "insurance";
  flowKey: string;
  productName: string;
  productSlug: string;
  journeyId: string;
  stepIndex: number;
  totalSteps: number;
  resumeUrl: string;
  whatsappConsent: boolean;
}) => {
  const token = getAuthToken();
  if (!token) return Promise.resolve();
  const attribution = getWebsiteAttribution();
  return fetch("/backend-api/form-submit-clicks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Source-Platform": "website",
      "X-Client-Platform": "website",
    },
    body: JSON.stringify({
      formType: category,
      action,
      stepIndex,
      totalSteps,
      meta: {
        source: "website",
        platform: "website",
        acquisitionSource: attribution.source,
        attribution,
        formSource: "website_application_flow",
        flowKey,
        productName,
        productSlug,
        journeyId,
        resumeUrl,
        whatsappConsent,
      },
    }),
    keepalive: true,
    credentials: "same-origin",
  }).then(() => undefined);
};
