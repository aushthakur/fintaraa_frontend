import { Post, Put } from "@/hooks/apiUtils";
import { emitAuthChanged } from "@/lib/authEvents";

type ApiResponse<T> = T & { message?: string; success?: boolean };

export type AuthMode = "login" | "signup";

export type SignupPayload = {
  name: string;
  email?: string;
  mobile: string;
  panCard?: string;
  referralCode?: string;
  agreedToTerms?: boolean;
  privacyPolicyAccepted?: boolean;
};

export type VerifyOtpResponse = {
  token?: string;
  user?: Record<string, unknown>;
  accountExisted?: boolean;
  needsProfileCompletion?: boolean;
};

export type MobileToPanResponse = {
  data?: {
    client_id?: string;
    name?: string;
    mobile_no?: string;
    pan_number?: string;
  };
  status_code?: number;
  success?: boolean;
  message?: string;
};

export const sendOtp = (mobile: string) =>
  Post<ApiResponse<{ existed?: boolean }>>(
    "user/send-otp",
    { mobile },
    15000,
  );

export const verifyOtp = async (
  mobile: string,
  otp: string,
  email?: string,
  name?: string,
) => {
  const response = await Post<ApiResponse<VerifyOtpResponse>>(
    "user/verify-otp",
    { mobile, otp, email, name },
  );

  if (typeof window !== "undefined") {
    if (response?.token) localStorage.setItem("token", response.token);
    if (response?.user) localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("verified_phone", mobile);
    localStorage.setItem("verified_phone_at", new Date().toISOString());
    emitAuthChanged();
  }

  return response;
};

export const signup = (payload: SignupPayload) =>
  Post<ApiResponse<unknown>>("user", payload);

export const updateUserProfile = (payload: Record<string, unknown>) =>
  Put<ApiResponse<unknown>>("user", payload, 15000);

export const mobileToPan = (payload: { name: string; mobile_no: string }) => {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const upstream = base.replace(/\/?api\/?$/i, "").replace(/\/$/, "");
  return Post<MobileToPanResponse>(
    `${upstream}/api/v1/pan/mobile-to-pan`,
    payload,
    15000,
  );
};
