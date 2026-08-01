import { Fetch, Post } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

export const MAX_REFERRAL_PAYOUT_AMOUNT = 100_000_000;

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
  paidCount?: number;
  rewardAmount?: number;
  minimumDisbursementAmount?: number;
  programActive?: boolean;
};

export type ReferralHistoryItem = {
  id: string;
  status: string;
  lifecycleStage?: "registered" | "applied" | "approved" | "reward_paid";
  payoutStatus?: "not_eligible" | "pending" | "paid" | "rejected";
  points?: number;
  rewardAmount?: number;
  conversionStatus?: string;
  createdAt?: string;
  registeredAt?: string;
  appliedAt?: string;
  approvedAt?: string;
  rewardCreditedAt?: string;
  paidAt?: string;
  disbursedAmount?: number;
  referredUser?: {
    name?: string;
    mobile?: string;
  };
};

export type ReferralWallet = {
  lifetimeCredited: number;
  reservedAmount: number;
  paidAmount: number;
  availableAmount: number;
  minimumPayoutAmount: number;
  canRequestPayout: boolean;
};

export type ReferralPayoutRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "paid";

export type ReferralPayoutRequest = {
  id: string;
  amount: number;
  status: ReferralPayoutRequestStatus;
  requestedAt?: string;
  createdAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  paidAt?: string;
  updatedAt?: string;
  payoutReference?: string;
  adminNote?: string;
  rejectionReason?: string;
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

const numberValue = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeWallet = (value: unknown): ReferralWallet => {
  const wallet = (value || {}) as Record<string, unknown>;
  return {
    lifetimeCredited: numberValue(
      wallet.lifetimeCredited ?? wallet.lifetimeEarnings,
    ),
    reservedAmount: numberValue(wallet.reservedAmount),
    paidAmount: numberValue(wallet.paidAmount),
    availableAmount: numberValue(
      wallet.availableAmount ?? wallet.availableBalance,
    ),
    minimumPayoutAmount: Math.max(
      500,
      numberValue(wallet.minimumPayoutAmount),
    ),
    canRequestPayout: wallet.canRequestPayout !== false,
  };
};

const normalizePayoutRequest = (value: unknown): ReferralPayoutRequest => {
  const request = (value || {}) as Record<string, unknown>;
  const status = String(request.status || "pending").toLowerCase();
  return {
    id: String(request.id || request._id || ""),
    amount: numberValue(request.amount),
    status: (["pending", "approved", "rejected", "paid"].includes(status)
      ? status
      : "pending") as ReferralPayoutRequestStatus,
    requestedAt: String(request.requestedAt || "") || undefined,
    createdAt: String(request.createdAt || "") || undefined,
    approvedAt: String(request.approvedAt || "") || undefined,
    rejectedAt: String(request.rejectedAt || "") || undefined,
    paidAt: String(request.paidAt || "") || undefined,
    updatedAt: String(request.updatedAt || "") || undefined,
    payoutReference:
      String(request.adminReference || request.payoutReference || "").trim() ||
      undefined,
    adminNote: String(request.adminNote || "").trim() || undefined,
    rejectionReason:
      String(request.rejectionReason || "").trim() || undefined,
  };
};

export const fetchReferralWallet = async () => {
  const response = await Fetch<ApiEnvelope<ReferralWallet>>(
    "referrals/wallet",
    undefined,
    15000,
    true,
    false,
  );
  const wallet = unwrap(response);
  if (!wallet || typeof wallet !== "object") {
    throw new Error("Referral wallet is unavailable.");
  }
  return normalizeWallet(wallet);
};

export const fetchReferralPayoutRequests = async () => {
  const response = await Fetch<
    ApiEnvelope<
      | ReferralPayoutRequest[]
      | {
          result?: ReferralPayoutRequest[];
          requests?: ReferralPayoutRequest[];
        }
    >
  >(
    "referrals/payout-requests",
    { page: 1, limit: 20 },
    15000,
    true,
    false,
  );
  const payload = unwrap(response);
  const requests = Array.isArray(payload)
    ? payload
    : payload?.result || payload?.requests || [];
  return requests.map(normalizePayoutRequest);
};

export const createReferralPayoutRequest = async (amount: number) => {
  const response = await Post<
    ApiEnvelope<
      | ReferralPayoutRequest
      | {
          request?: ReferralPayoutRequest;
          payoutRequest?: ReferralPayoutRequest;
          wallet?: ReferralWallet;
        }
    >
  >("referrals/payout-requests", { amount }, 15000, true);
  const payload = unwrap(response);
  const record = (payload || {}) as {
    request?: ReferralPayoutRequest;
    payoutRequest?: ReferralPayoutRequest;
    wallet?: ReferralWallet;
  };
  return {
    request: normalizePayoutRequest(
      record.request || record.payoutRequest || payload,
    ),
    wallet: record.wallet ? normalizeWallet(record.wallet) : undefined,
  };
};
