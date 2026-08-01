import { getAuthToken } from "@/hooks/authStorage";
import type { WebsiteAttribution } from "@/services/attribution";

export type PopupType =
  | "lead_capture"
  | "offer_announcement"
  | "event_announcement"
  | "survey";
export type PopupTriggerType =
  | "page_load"
  | "exit_intent"
  | "time_delay"
  | "scroll_percentage";
export type PopupFrequency =
  | "once_per_session"
  | "once_per_day"
  | "always";
export type PopupFieldType =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "rating";

export type PopupFormField = {
  _id?: string;
  name: string;
  label: string;
  type: PopupFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
};

export type PopupCampaign = {
  _id: string;
  name: string;
  popupType: PopupType;
  contentType: "image" | "html";
  heading?: string;
  description?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  imageAlt?: string;
  htmlContent?: string;
  ctaText?: string;
  ctaUrl?: string;
  triggerType: PopupTriggerType;
  delaySeconds: number;
  scrollPercentage: number;
  frequency: PopupFrequency;
  formFields: PopupFormField[];
  submitButtonText: string;
  successMessage: string;
  priority: number;
  dismissible: boolean;
};

type SubmissionPayload = {
  values: Record<string, string | number | boolean>;
  sourcePage: string;
  pageUrl: string;
  sessionId: string;
  visitorId: string;
  deviceType: "mobile" | "tablet" | "desktop";
  attribution: WebsiteAttribution;
};

const responseData = (payload: unknown) => {
  const envelope = payload as {
    data?: unknown;
    message?: string;
    error?: string;
  };
  return {
    data: envelope?.data,
    message: envelope?.message || envelope?.error || "",
  };
};

export async function fetchActivePopupCampaigns(
  pagePath: string,
): Promise<PopupCampaign[]> {
  try {
    const response = await fetch(
      `/backend-api/popups/public?path=${encodeURIComponent(pagePath)}`,
      {
        cache: "no-store",
        credentials: "same-origin",
      },
    );
    if (!response.ok) return [];
    const payload = responseData(await response.json());
    return Array.isArray(payload.data)
      ? (payload.data as PopupCampaign[])
      : [];
  } catch {
    return [];
  }
}

export async function submitPopupResponse(
  popupId: string,
  payload: SubmissionPayload,
) {
  const token = getAuthToken();
  const response = await fetch(
    `/backend-api/popups/${encodeURIComponent(popupId)}/submissions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      credentials: "same-origin",
    },
  );
  const result = responseData(await response.json().catch(() => ({})));
  if (!response.ok) {
    throw new Error(result.message || "Your response could not be submitted.");
  }
  return result.message;
}
