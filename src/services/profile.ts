import { Fetch, Put } from "@/hooks/apiUtils";

export type CurrentUser = Record<string, unknown> & {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  mobile?: string;
  customerId?: string;
  panCard?: string;
  aadhaarCard?: string;
  cibilScore?: number;
  cibilLastFetchedAt?: string;
  cibilReport?: Record<string, unknown>;
  cibilRequestPayload?: Record<string, unknown>;
  cibilPdfLastFetchedAt?: string;
  cibilPdfReport?: Record<string, unknown>;
  experianScore?: number;
  experianLastFetchedAt?: string;
  isKycVerified?: boolean;
  personalDetails?: Record<string, unknown>;
  employmentDetails?: Record<string, unknown>;
  bankDetails?: Record<string, unknown>;
  addressDetails?: Record<string, unknown>;
  kycProfile?: {
    personalDetails?: Record<string, unknown>;
    employmentDetails?: Record<string, unknown>;
    bankDetails?: Record<string, unknown>;
    addressDetails?: Record<string, unknown>;
    verification?: {
      status?: string;
    };
  };
};

export const fetchCurrentUser = async (): Promise<CurrentUser | null> => {
  const response = await Fetch<unknown>(
    "user/get-current",
    undefined,
    10000,
    true,
    false,
  );
  const payload = response as Record<string, unknown>;
  const data = payload?.data as Record<string, unknown> | undefined;
  const user = payload?.user as Record<string, unknown> | undefined;
  const current = data || user || payload;
  return current ? (current as CurrentUser) : null;
};

export const updateKycProfile = (payload: Record<string, unknown>) =>
  Put<unknown>("user/kyc-profile", payload, 15000);

export const updateUserProfilePhoto = async (
  payload: FormData,
): Promise<CurrentUser | null> => {
  const response = await Put<unknown>("user", payload, 20000, true);
  const result = response as Record<string, unknown>;
  const data = result?.data as Record<string, unknown> | undefined;
  const user = result?.user as Record<string, unknown> | undefined;
  const updated = data || user || result;
  return updated ? (updated as CurrentUser) : null;
};
