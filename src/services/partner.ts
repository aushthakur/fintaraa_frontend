import { Fetch, Patch, Post, Put } from "@/hooks/apiUtils";
import {
  clearAuthSession,
  getAuthToken,
  getAuthType,
  setAuthSession,
} from "@/hooks/authStorage";
import { emitAuthChanged } from "@/lib/authEvents";

type ApiEnvelope<T> = T & {
  data?: T;
  message?: string;
  success?: boolean;
};

export type PartnerProfile = Record<string, unknown> & {
  _id?: string;
  id?: string;
  agencyId?: string;
  name?: string;
  email?: string;
  mobile?: string;
  role?: "agency" | "agency_member" | string;
  parentAgency?: string | Record<string, unknown>;
  avatar?: string;
  profilePictureUrl?: string;
  rmName?: string;
  rmMobile?: string;
  agentProfileCompleted?: boolean;
  requiresKycCompletion?: boolean;
  bankDetails?: Record<string, unknown>;
  kycProfile?: {
    personalDetails?: Record<string, unknown>;
    addressDetails?: Record<string, unknown>;
    employmentDetails?: Record<string, unknown>;
    financialDetails?: Record<string, unknown>;
    bankDetails?: Record<string, unknown>;
    documents?: Array<Record<string, unknown>>;
    verification?: {
      status?: string;
    };
  };
  profileCompletion?: {
    completedFields?: number;
    totalFields?: number;
    completionPercent?: number;
    missingFields?: string[];
    isComplete?: boolean;
  };
};

export type PartnerLeadSummary = {
  summary?: {
    totalLeads?: number;
    activePipelineCount?: number;
    potentialValue?: number;
    disbursedCases?: number;
    disbursedValue?: number;
    totalCommission?: number;
    earnedCommission?: number;
    paidCommission?: number;
    pendingCommission?: number;
  };
  stageCounts?: {
    preLogin?: number;
    login?: number;
    sanction?: number;
    disbursed?: number;
  };
  loanTypeBreakdown?: Array<Record<string, unknown>>;
};

export type PartnerLeadEvent = {
  id?: string;
  _id?: string;
  loanId?: string;
  customerName?: string;
  mobile?: string;
  loanType?: string;
  status?: string;
  loanAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  assignedAgentName?: string;
  assignedLanderName?: string;
  commissionStatus?: string;
  commissionAmount?: number;
  disbursedAmount?: number;
  productType?: "loan" | "insurance" | string;
  policyDetails?: Record<string, unknown>;
};

export type PartnerClickSummary = {
  byAction?: Array<{ _id?: string; count?: number }>;
  byFormType?: Array<{ _id?: string; count?: number }>;
  recentIncomplete?: Array<Record<string, unknown>>;
};

export type PartnerUploadedDocument = {
  url: string;
  name?: string;
  mimetype?: string;
  size?: number;
};

export type PartnerVaultDocument = {
  docType: string;
  fileUrl: string;
  referenceId?: string;
  issuedOn?: string;
  uploadedAt?: string;
};

export type PartnerDocumentRequest = {
  _id: string;
  requestedDocuments: string[];
  uploadedDocuments?: Array<{
    documentKey: string;
    fileUrl: string;
    uploadedAt?: string;
  }>;
  message?: string;
  status: "pending" | "uploaded" | "cancelled";
  createdAt?: string;
  fulfilledAt?: string;
  loanQuery?: {
    _id?: string;
    loanId?: string;
    loanType?: string;
    status?: string;
  };
};

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object") {
    const payload = response as Record<string, unknown>;
    if (payload.data && typeof payload.data === "object") {
      return payload.data as T;
    }
  }
  return response as T;
};

const normalizePhone = (input: string) => input.replace(/\D/g, "");

const storePartnerProfile = (profile?: PartnerProfile | null) => {
  if (typeof window === "undefined" || !profile) return;
  localStorage.setItem("agencyUser", JSON.stringify(profile));
  emitAuthChanged();
};

export const getCachedPartnerProfile = (): PartnerProfile | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("agencyUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PartnerProfile;
  } catch {
    return null;
  }
};

export const isPartnerLoggedIn = () =>
  typeof window !== "undefined" &&
  getAuthType() === "agency" &&
  Boolean(getAuthToken());

export const logoutPartner = () => {
  clearAuthSession();
};

export const sendPartnerOtp = (
  payload:
    | string
    | {
        mobile: string;
        name?: string;
        email?: string;
        parentAgencyId?: string;
      },
) => {
  const body =
    typeof payload === "string"
      ? { mobile: normalizePhone(payload) }
      : { ...payload, mobile: normalizePhone(payload.mobile) };

  return Post<ApiEnvelope<unknown>>("agency/send-otp", body, 15000);
};

export const verifyPartnerOtp = async (mobile: string, otp: string) => {
  const response = await Post<
    ApiEnvelope<{
      token?: string;
      agency?: PartnerProfile;
      isNewAccount?: boolean;
      message?: string;
    }>
  >("agency/verify-otp", { mobile: normalizePhone(mobile), otp }, 15000);

  const payload = unwrap<{
    token?: string;
    agency?: PartnerProfile;
    isNewAccount?: boolean;
    message?: string;
  }>(response);

  if (typeof window !== "undefined") {
    if (payload?.token) {
      setAuthSession("agency", payload.token);
    }
    if (payload?.agency) {
      storePartnerProfile(payload.agency);
    }
    localStorage.setItem("verified_partner_phone", normalizePhone(mobile));
    localStorage.setItem(
      "verified_partner_phone_at",
      new Date().toISOString(),
    );
  }

  const message = String(payload?.message || "").toLowerCase();
  return {
    ...payload,
    isNewAccount:
      payload?.isNewAccount ||
      message.includes("account activated") ||
      message.includes("finish creating your account"),
  };
};

export const fetchPartnerProfile = async () => {
  const response = await Fetch<ApiEnvelope<PartnerProfile> | PartnerProfile>(
    "agency/current",
    undefined,
    15000,
    true,
    false,
  );
  const profile = unwrap<PartnerProfile>(response);
  storePartnerProfile(profile);
  return profile;
};

export const sendPartnerMobileChangeOtp = (mobile: string) =>
  Post<ApiEnvelope<unknown>>(
    "dsa/mobile-change/send-otp",
    { mobile: normalizePhone(mobile) },
    15000,
    true,
  );

export const verifyPartnerMobileChangeOtp = async (
  mobile: string,
  otp: string,
) => {
  const response = await Post<ApiEnvelope<PartnerProfile> | PartnerProfile>(
    "dsa/mobile-change/verify-otp",
    { mobile: normalizePhone(mobile), otp: otp.replace(/\D/g, "") },
    15000,
    true,
  );
  return unwrap<PartnerProfile>(response);
};

export const updatePartnerKycProfile = async (
  payload: Record<string, unknown>,
) => {
  const response = await Put<ApiEnvelope<PartnerProfile> | PartnerProfile>(
    "agency/kyc-profile",
    payload,
    15000,
  );
  const profile = unwrap<PartnerProfile>(response);
  storePartnerProfile(profile);
  return profile;
};

export const uploadPartnerBankDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("document", file);

  const response = await Post<
    ApiEnvelope<PartnerUploadedDocument> | PartnerUploadedDocument
  >("agency/upload-bank-document", formData, 30000);

  return unwrap<PartnerUploadedDocument>(response);
};

export const fetchPartnerLeadSummary = async () => {
  const response = await Fetch<ApiEnvelope<PartnerLeadSummary>>(
    "agency/leads/summary",
    undefined,
    15000,
    true,
    false,
  );
  return unwrap<PartnerLeadSummary>(response);
};

export const fetchPartnerLeadEvents = async (
  params: {
    stage?: string;
    productType?: string;
    loanType?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {},
) => {
  const response = await Fetch<
    ApiEnvelope<{ result?: PartnerLeadEvent[] }> | { result?: PartnerLeadEvent[] }
  >(
    "agency/leads/events",
    { stage: "all", page: 1, limit: 5, ...params },
    15000,
    true,
    false,
  );
  return unwrap<{ result?: PartnerLeadEvent[] }>(response);
};

export const fetchPartnerClickSummary = async () => {
  const response = await Fetch<ApiEnvelope<PartnerClickSummary>>(
    "form-submit-clicks/my/summary",
    undefined,
    15000,
    true,
    false,
  );
  return unwrap<PartnerClickSummary>(response);
};

export const fetchPartnerDocumentRequests = async () => {
  const response = await Fetch<
    ApiEnvelope<PartnerDocumentRequest[]> | PartnerDocumentRequest[]
  >("document-requests/my", undefined, 15000, true, false);
  const requests = unwrap<PartnerDocumentRequest[]>(response);
  return Array.isArray(requests) ? requests : [];
};

export const uploadPartnerVaultDocument = async (
  file: File,
  documentKey: string,
) => {
  const formData = new FormData();
  formData.append("digiLockerFiles", file);
  formData.append("defaultDocType", documentKey);
  formData.append("name", documentKey.replace(/[._-]+/g, " "));
  const response = await Post<
    ApiEnvelope<{ documents?: PartnerVaultDocument[] }> | {
      documents?: PartnerVaultDocument[];
    }
  >("agency/digilocker-sync", formData, 30000);
  const payload = unwrap<{ documents?: PartnerVaultDocument[] }>(response);
  return Array.isArray(payload?.documents) ? payload.documents : [];
};

export const completePartnerDocumentRequest = async (
  requestId: string,
  payload: { documentKey: string; fileUrl: string },
) => {
  const response = await Patch<
    ApiEnvelope<PartnerDocumentRequest> | PartnerDocumentRequest
  >(
    `document-requests/${encodeURIComponent(requestId)}/uploaded`,
    payload,
    15000,
    true,
  );
  return unwrap<PartnerDocumentRequest>(response);
};

const hasValue = (value: unknown) =>
  value !== undefined && value !== null && String(value).trim() !== "";

export const isPartnerProfileComplete = (profile?: PartnerProfile | null) => {
  if (!profile) return false;
  if (profile.agentProfileCompleted === true) return true;
  if (profile.profileCompletion?.isComplete === true) return true;
  if (profile.kycProfile?.verification?.status === "verified") return true;

  const kyc = profile.kycProfile || {};
  const personal = kyc.personalDetails || {};
  const addressDetails = kyc.addressDetails || {};
  const currentAddress =
    ((addressDetails.currentAddress ||
      addressDetails.address ||
      addressDetails) as Record<string, unknown>) || {};
  const employment = kyc.employmentDetails || {};
  const bank = profile.bankDetails || kyc.bankDetails || {};
  const documents = Array.isArray(kyc.documents) ? kyc.documents : [];
  const docTypes = new Set(
    documents
      .map((doc) => String(doc.docType || "").toLowerCase())
      .filter(Boolean),
  );

  return [
    personal.fullName || profile.name,
    personal.panNumber,
    personal.aadhaarNumber,
    personal.mobile || profile.mobile,
    personal.email || profile.email,
    personal.address || currentAddress.street || currentAddress.address,
    personal.city || currentAddress.city,
    personal.state || currentAddress.state,
    personal.pinCode || personal.pincode || currentAddress.postalCode,
    employment.employerName,
    employment.companyAddress,
    employment.totalExperience,
    bank.accountHolderName,
    bank.bankName,
    bank.accountType,
    bank.accountNumber,
    bank.ifscCode,
    bank.cancelledChequeUrl || docTypes.has("cancelled_cheque"),
    docTypes.has("pan_card"),
    docTypes.has("aadhaar_card"),
  ].every(hasValue);
};
