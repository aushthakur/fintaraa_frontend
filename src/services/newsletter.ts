import { request } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  success?: boolean;
};

export type NewsletterSubscriptionPayload = {
  email: string;
  pagePath?: string;
  formSource?: string;
};

export const subscribeToNewsletter = async (
  payload: NewsletterSubscriptionPayload,
) => {
  const response = await request<ApiEnvelope<unknown>>({
    method: "POST",
    url: "newsletter/subscribe",
    data: {
      email: payload.email,
      pagePath: payload.pagePath,
      formSource: payload.formSource || "website_newsletter",
      source: "website",
      platform: "website",
    },
    timeout: 10000,
  });

  return {
    success: response.data?.success !== false,
    message:
      response.data?.message ||
      "Thanks for subscribing. We will send helpful finance updates to your inbox.",
  };
};
