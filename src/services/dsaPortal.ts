import { Fetch, Post, Put } from "@/hooks/apiUtils";

export type DsaOnboardingStatus = "pending" | "approved" | "rejected" | string;
export type DsaPayoutMethod = "upi" | "bank_transfer";

export type DsaPortalPayoutProfile = {
  _id?: string;
  method?: DsaPayoutMethod;
  maskedDestination?: string;
  accountHolder?: string;
  bankName?: string;
  ifsc?: string;
  updatedAt?: string;
};

export type DsaPortalProfile = {
  _id?: string;
  agencyId?: string;
  referralCode?: string;
  name?: string;
  businessName?: string;
  email?: string;
  mobile?: string;
  role?: string;
  status?: string;
  onboardingStatus?: DsaOnboardingStatus;
  rejectionReason?: string;
  reviewNotes?: string;
  profileCompletion?: number;
  hasPayoutProfile?: boolean;
  payoutProfile?: DsaPortalPayoutProfile | null;
};

export type DsaPortalDashboard = {
  kpis: {
    totalApplications: number;
    activeApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    disbursedApplications: number;
    totalDisbursedAmount: number;
    projectedCommission: number;
    earnedCommission: number;
    paidCommission: number;
    pendingCommission: number;
    availablePayout: number;
    approvalRate: number;
    conversionRate: number;
  };
  payoutBalances: {
    earnedAmount: number;
    paidAmount: number;
    pendingRequestedAmount: number;
    availableToRequest: number;
    minimumPayoutAmount: number;
    canRequestPayout: boolean;
  };
  payoutStats: {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    paidRequests: number;
    failedRequests: number;
  };
};

export type DsaPortalCommission = {
  _id?: string;
  id?: string;
  applicationId?: string;
  customerName?: string;
  loanType?: string;
  productType?: string;
  disbursedAmount?: number;
  commissionAmount?: number;
  paidAmount?: number;
  status?: string;
  earningStatus?: string;
  paymentReference?: string;
  disbursedAt?: string;
  paidAt?: string;
  createdAt?: string;
};

export type DsaPortalPayout = {
  _id?: string;
  id?: string;
  amount?: number;
  method?: DsaPayoutMethod;
  destinationMasked?: string;
  status?: string;
  paymentReference?: string;
  notes?: string;
  failureReason?: string;
  approvedAt?: string;
  processedAt?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DsaPortalReferral = {
  referralCode?: string;
  shareUrl?: string;
  whatsappUrl?: string;
  smsText?: string;
};

export type DsaPortalLeaderboardEntry = {
  _id?: string;
  rank?: number;
  agencyId?: string;
  referralCode?: string;
  name?: string;
  businessName?: string;
  applications?: number;
  approved?: number;
  disbursed?: number;
  disbursedApplications?: number;
  approvalRate?: number;
  revenue?: number;
  totalCommission?: number;
  totalDisbursed?: number;
  disbursedAmount?: number;
  isCurrentDsa?: boolean;
  isCurrentAgency?: boolean;
};

export type DsaPortalTrainingItem = {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  type?: string;
  trainingType?: string;
  url?: string;
  documentUrl?: string;
  videoUrl?: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  loanTypes?: string[];
  publishedAt?: string;
  createdAt?: string;
};

export type DsaPortalPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DsaPortalList<T> = {
  items: T[];
  pagination: DsaPortalPagination;
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const unwrapData = <T>(response: unknown): T => {
  let current = response;
  for (let depth = 0; depth < 3; depth += 1) {
    const record = asRecord(current);
    if (!("data" in record) || record.data === undefined || record.data === null) {
      break;
    }
    current = record.data;
  }
  return current as T;
};

const numberValue = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizePagination = (value: unknown): DsaPortalPagination => {
  const record = asRecord(value);
  return {
    page: Math.max(1, numberValue(record.page || record.currentPage || 1)),
    limit: Math.max(1, numberValue(record.limit || record.itemsPerPage || 20)),
    total: Math.max(0, numberValue(record.total || record.totalItems)),
    totalPages: Math.max(1, numberValue(record.totalPages || 1)),
  };
};

const normalizeList = <T>(response: unknown): DsaPortalList<T> => {
  const payload = asRecord(unwrapData<unknown>(response));
  const items = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.result)
      ? payload.result
      : [];
  return {
    items: items as T[],
    pagination: normalizePagination(payload.pagination),
  };
};

const normalizeDashboard = (response: unknown): DsaPortalDashboard => {
  const payload = asRecord(unwrapData<unknown>(response));
  const kpis = asRecord(payload.kpis || payload.metrics);
  const balances = asRecord(payload.payoutBalances);
  const stats = asRecord(payload.payoutStats);
  return {
    kpis: {
      totalApplications: numberValue(kpis.totalApplications),
      activeApplications: numberValue(kpis.activeApplications),
      approvedApplications: numberValue(kpis.approvedApplications),
      rejectedApplications: numberValue(kpis.rejectedApplications),
      disbursedApplications: numberValue(kpis.disbursedApplications),
      totalDisbursedAmount: numberValue(
        kpis.totalDisbursedAmount || kpis.totalDisbursed,
      ),
      projectedCommission: numberValue(kpis.projectedCommission),
      earnedCommission: numberValue(kpis.earnedCommission),
      paidCommission: numberValue(kpis.paidCommission),
      pendingCommission: numberValue(kpis.pendingCommission),
      availablePayout: numberValue(kpis.availablePayout),
      approvalRate: numberValue(kpis.approvalRate),
      conversionRate: numberValue(kpis.conversionRate),
    },
    payoutBalances: {
      earnedAmount: numberValue(balances.earnedAmount),
      paidAmount: numberValue(balances.paidAmount),
      pendingRequestedAmount: numberValue(balances.pendingRequestedAmount),
      availableToRequest: numberValue(balances.availableToRequest),
      minimumPayoutAmount: numberValue(balances.minimumPayoutAmount) || 0.01,
      canRequestPayout:
        typeof balances.canRequestPayout === "boolean"
          ? balances.canRequestPayout
          : numberValue(balances.availableToRequest) > 0 &&
            numberValue(balances.pendingRequestedAmount) === 0,
    },
    payoutStats: {
      totalRequests: numberValue(stats.totalRequests),
      pendingRequests: numberValue(stats.pendingRequests),
      approvedRequests: numberValue(stats.approvedRequests),
      paidRequests: numberValue(stats.paidRequests),
      failedRequests: numberValue(stats.failedRequests),
    },
  };
};

const quietFetch = (path: string, params?: Record<string, unknown>) =>
  Fetch<unknown>(path, params, 15000, true, false);

export const fetchDsaPortalProfile = async () =>
  unwrapData<DsaPortalProfile>(await quietFetch("dsa/me"));

export const fetchDsaPortalDashboard = async () =>
  normalizeDashboard(await quietFetch("dsa/dashboard"));

export const fetchDsaPortalCommissions = async (
  params: Record<string, unknown> = {},
) => normalizeList<DsaPortalCommission>(await quietFetch("dsa/commissions", params));

export const fetchDsaPortalPayouts = async (
  params: Record<string, unknown> = {},
) => normalizeList<DsaPortalPayout>(await quietFetch("dsa/payouts", params));

export const fetchDsaPortalPayoutProfile = async () =>
  unwrapData<DsaPortalPayoutProfile | null>(await quietFetch("dsa/payout-profile"));

export const updateDsaPortalPayoutProfile = async (payload: {
  method: DsaPayoutMethod;
  upiId?: string;
  accountNumber?: string;
  ifsc?: string;
  accountHolder?: string;
  bankName?: string;
}) =>
  unwrapData<DsaPortalPayoutProfile>(
    await Put<unknown>("dsa/payout-profile", payload, 15000, true),
  );

export const createDsaPortalPayout = async (payload: {
  amount: number;
  method: DsaPayoutMethod;
  notes?: string;
}) =>
  unwrapData<DsaPortalPayout>(
    await Post<unknown>("dsa/payouts", payload, 15000, true),
  );

export const fetchDsaPortalReferral = async () =>
  unwrapData<DsaPortalReferral>(await quietFetch("dsa/referral-link"));

export const fetchDsaPortalLeaderboard = async (
  period: "month" | "quarter" | "all" = "month",
) => {
  const payload = asRecord(
    unwrapData<unknown>(
      await quietFetch("dsa/leaderboard", { period, limit: 50 }),
    ),
  );
  return {
    period: String(payload.period || period),
    items: (Array.isArray(payload.items) ? payload.items : []) as DsaPortalLeaderboardEntry[],
  };
};

export const fetchDsaPortalTraining = async (
  params: Record<string, unknown> = {},
) => normalizeList<DsaPortalTrainingItem>(await quietFetch("dsa/training", params));
