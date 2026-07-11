import { Fetch, Post, request } from "@/hooks/apiUtils";

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

export type BureauScoreHistoryRecord = {
  _id?: string;
  bureau?: "cibil" | "experian";
  bureauScore?: number;
  cibilScore?: number;
  experianScore?: number;
  fetchedAt?: string;
  createdAt?: string;
  lookupSource?: "customer_lookup" | "self_lookup" | "pdf_lookup";
};

export type BureauScoreHistoryResponse = {
  result: BureauScoreHistoryRecord[];
  pagination?: {
    currentPage?: number;
    itemsPerPage?: number;
    totalItems?: number;
    totalPages?: number;
  };
};

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }
  return response as T;
};

export const fetchUserCibil = async (
  forceRefresh = false,
  options?: { silent?: boolean },
) => {
  if (options?.silent) {
    const response = await request<
      ApiEnvelope<UserCibilResponse> | UserCibilResponse
    >({
      method: "POST",
      url: "cibil/user",
      data: { forceRefresh },
      timeout: 30000,
    });
    return unwrap(response.data);
  }

  const response = await Post<ApiEnvelope<UserCibilResponse> | UserCibilResponse>(
    "cibil/user",
    { forceRefresh },
    30000,
    true,
  );
  return unwrap(response);
};

export const fetchUserCibilPdf = async (options?: { silent?: boolean }) => {
  if (options?.silent) {
    const response = await request<
      ApiEnvelope<UserCibilPdfResponse> | UserCibilPdfResponse
    >({
      method: "POST",
      url: "cibil/user/pdf",
      data: {},
      timeout: 30000,
    });
    return unwrap(response.data);
  }

  const response = await Post<ApiEnvelope<UserCibilPdfResponse> | UserCibilPdfResponse>(
    "cibil/user/pdf",
    {},
    30000,
    true,
  );
  return unwrap(response);
};

export const fetchUserCibilHistory = async (params?: {
  from?: string;
  to?: string;
  limit?: number;
}) => {
  const response = await Fetch<
    ApiEnvelope<BureauScoreHistoryResponse> | BureauScoreHistoryResponse
  >(
    "cibil/history",
    {
      limit: params?.limit || 50,
      ...(params?.from ? { from: params.from } : {}),
      ...(params?.to ? { to: params.to } : {}),
    },
    15000,
    true,
    false,
  );
  return unwrap(response);
};
