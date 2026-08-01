import { Fetch, Post } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

export type ServiceRequestType =
  | "gst_registration"
  | "itr_filing"
  | "company_registration"
  | "annual_compliance"
  | "roc_filing"
  | "tax_compliance"
  | "msme_registration"
  | "project_report"
  | "franchise_partner"
  | "dsa_partner";

export type ServiceWorkflowItem = {
  stage: string;
  status: "pending" | "active" | "completed" | "blocked";
  remarks?: string;
  updatedBy?: string;
  updatedAt?: string;
};

export type ServiceFollowUpItem = {
  scheduledAt?: string;
  note?: string;
  status: "pending" | "completed" | "cancelled";
  assignedExecutive?: string;
  updatedBy?: string;
  updatedAt?: string;
};

export type ServiceRequestRecord = {
  _id: string;
  queryId: string;
  serviceType: ServiceRequestType;
  user?: string | { _id?: string; name?: string; fullName?: string; mobile?: string };
  name?: string;
  mobile?: string;
  email?: string;
  businessName?: string;
  monthlyLoanAmount?: string;
  businessType?: string;
  gstRequirement?: string;
  state?: string;
  employmentType?: string;
  annualIncome?: string;
  source?: string;
  platform?: string;
  whatsappConsent?: boolean;
  communicationConsent?: Record<string, unknown>;
  status: string;
  currentStage: string;
  currentStageIndex: number;
  assignedExecutive?: string;
  followUpAt?: string;
  followUpNote?: string;
  followUpStatus?: "pending" | "completed" | "cancelled";
  followUpHistory?: ServiceFollowUpItem[];
  timeline: ServiceWorkflowItem[];
  updatedAt?: string;
  createdAt?: string;
};

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }
  return response as T;
};

export const createServiceRequest = async (
  payload: Record<string, unknown> & { serviceType: ServiceRequestType },
) => {
  const response = await Post<ApiEnvelope<ServiceRequestRecord>>(
    "service-requests",
    payload,
    15000,
    true,
  );
  return unwrap(response);
};

export const fetchServiceRequestByQueryId = async (queryId: string) => {
  const response = await Fetch<ApiEnvelope<ServiceRequestRecord>>(
    `service-requests/query/${encodeURIComponent(queryId)}`,
    undefined,
    15000,
    true,
    false,
  );
  return unwrap(response);
};

export const fetchServiceRequestHistory = async (params: {
  serviceType: ServiceRequestType;
  mobile?: string;
  queryId?: string;
}) => {
  const response = await Fetch<ApiEnvelope<ServiceRequestRecord[]>>(
    "service-requests/public",
    {
      serviceType: params.serviceType,
      ...(params.mobile ? { mobile: params.mobile } : {}),
      ...(params.queryId ? { queryId: params.queryId } : {}),
    },
    15000,
    true,
    false,
  );
  return unwrap(response) || [];
};
