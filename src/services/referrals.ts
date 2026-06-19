import { Fetch, Post } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

export type ReferralSummary = {
  referralCode?: string;
  totalReferrals?: number;
  successfulReferrals?: number;
  pendingReferrals?: number;
  totalEarnings?: number;
  visitCount?: number;
  points?: number;
  amount?: number;
  pendingCount?: number;
  rewardedCount?: number;
};

export type ReferralHistoryItem = {
  id: string;
  status: string;
  points?: number;
  rewardAmount?: number;
  conversionStatus?: string;
  createdAt?: string;
  referredUser?: {
    name?: string;
    mobile?: string;
  };
};

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }
  return response as T;
};

export const fetchReferralSummary = async () => {
  const response = await Fetch<ApiEnvelope<ReferralSummary>>(
    "referrals/summary",
    undefined,
    15000,
    true,
    false,
  );
  return unwrap(response);
};

export const fetchReferralHistory = async () => {
  const response = await Fetch<ApiEnvelope<ReferralHistoryItem[]>>(
    "referrals/history",
    undefined,
    15000,
    true,
    false,
  );
  return unwrap(response) || [];
};

export const trackReferralVisit = (payload: Record<string, unknown>) =>
  Post<ApiEnvelope<unknown>>("referrals/track-visit", payload, 10000, true);
