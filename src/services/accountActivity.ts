import { Fetch, Post } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

type ApiListPayload<T> =
  | T[]
  | {
      result?: T[];
      totalResults?: number;
      totalPages?: number;
      page?: number;
      limit?: number;
    };

type PersonRef = string | {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  mobile?: string;
};

type ActorRef = {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  mobile?: string;
};

export type AccountChatMessage = {
  _id?: string;
  id?: string;
  text?: string;
  status?: string;
  sender?: ActorRef;
  receiver?: ActorRef;
  senderModel?: string;
  receiverModel?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AccountLoanQuery = {
  _id: string;
  loanId?: string;
  loanType?: string;
  status?: string;
  loanAmount?: number | string;
  disbursedAmount?: number | string;
  disbursedDate?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  bankName?: string;
  assignedAgent?: PersonRef;
  assignedAgents?: PersonRef[];
  assignedLander?: PersonRef;
  updatedByName?: string;
  city?: string;
  state?: string;
  employmentType?: string;
  monthlyIncome?: number | string;
  workExperience?: number | string;
  approved?: boolean;
  policyDetails?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type AccountInsuranceQuery = {
  _id: string;
  insuranceId?: string;
  queryId?: string;
  typeOfInsurance?: string;
  status?: string;
  annualIncome?: number | string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  assignedAgent?: PersonRef;
  assignedLander?: PersonRef;
  city?: string;
  state?: string;
  policyDetails?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type AccountCreditCardApplication = {
  _id: string;
  offerId: string;
  applicationId: string;
  title?: string;
  lenderName?: string;
  productType?: string;
  productCategory?: "card";
  status?: string;
  appliedAt?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }
  return response as T;
};

const normalizeList = <T>(payload: unknown): T[] => {
  const data = unwrap(payload as ApiEnvelope<ApiListPayload<T>>);
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.result)) {
    return data.result;
  }
  return [];
};

const commonParams = {
  status: "all",
  pagination: false,
  limit: 100,
};

export const fetchAccountLoanApplications = async () => {
  const response = await Fetch<ApiEnvelope<ApiListPayload<AccountLoanQuery>>>(
    "loanquery",
    commonParams,
    15000,
    true,
    false,
  );
  return normalizeList<AccountLoanQuery>(response);
};

export const fetchAccountInsuranceApplications = async () => {
  const response = await Fetch<ApiEnvelope<ApiListPayload<AccountInsuranceQuery>>>(
    "insurancequery",
    commonParams,
    15000,
    true,
    false,
  );
  return normalizeList<AccountInsuranceQuery>(response);
};

export const fetchPublicLoanApplication = async (params: {
  applicationId: string;
  mobile: string;
}) => {
  const response = await Fetch<
    ApiEnvelope<AccountLoanQuery | null>
  >(
    "loanquery/public/track",
    params,
    15000,
    true,
    false,
  );
  return unwrap(response);
};

export const fetchPublicInsuranceApplication = async (params: {
  applicationId: string;
  mobile: string;
}) => {
  const response = await Fetch<
    ApiEnvelope<AccountInsuranceQuery | null>
  >(
    "insurancequery/public/track",
    params,
    15000,
    true,
    false,
  );
  return unwrap(response);
};

export const fetchAccountCreditCardApplications = async () => {
  const response = await Fetch<
    ApiEnvelope<AccountCreditCardApplication[]>
  >(
    "offers/applications/me",
    { productCategory: "card" },
    15000,
    true,
    false,
  );
  return normalizeList<AccountCreditCardApplication>(response);
};

export const fetchAccountApplicationMessages = async (
  kind: "loan" | "insurance",
  id: string,
) => {
  const response = await Fetch<ApiEnvelope<AccountChatMessage[]>>(
    `${kind === "loan" ? "loanquery" : "insurancequery"}/${encodeURIComponent(id)}/chat/messages`,
    undefined,
    15000,
    true,
    false,
  );
  return unwrap(response) || [];
};

export const sendAccountApplicationMessage = async (
  kind: "loan" | "insurance",
  id: string,
  text: string,
) => {
  const response = await Post<ApiEnvelope<AccountChatMessage>>(
    `${kind === "loan" ? "loanquery" : "insurancequery"}/${encodeURIComponent(id)}/chat/messages`,
    { text },
    15000,
    true,
  );
  return unwrap(response);
};
