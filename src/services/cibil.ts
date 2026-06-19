import { Post } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

export type UserCibilResponse = {
  cached?: boolean;
  cibilScore?: number;
  lastFetchedAt?: string;
  lastConsentAt?: string;
  refreshAvailableInDays?: number;
  report?: unknown;
  payload?: unknown;
  message?: string;
};

export type UserCibilPdfResponse = {
  cached?: boolean;
  report?: unknown;
  payload?: unknown;
  environment?: string;
  refreshAvailableInDays?: number;
  lastFetchedAt?: string;
  message?: string;
};

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }
  return response as T;
};

export const fetchUserCibil = async (forceRefresh = false) => {
  const response = await Post<ApiEnvelope<UserCibilResponse> | UserCibilResponse>(
    "cibil/user",
    { forceRefresh },
    30000,
    true,
  );
  return unwrap(response);
};

export const fetchUserCibilPdf = async () => {
  const response = await Post<ApiEnvelope<UserCibilPdfResponse> | UserCibilPdfResponse>(
    "cibil/user/pdf",
    {},
    30000,
    true,
  );
  return unwrap(response);
};
