import { Fetch } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

export type PageFaqItem = {
  question: string;
  answer: string;
  isActive?: boolean;
  priorityOrder?: number;
};

export type PageFaqRecord = {
  _id: string;
  pathname: string;
  pathAliases?: string[];
  title: string;
  subtitle?: string;
  items: PageFaqItem[];
  schemaEnabled?: boolean;
  schemaJson?: Record<string, unknown>;
  status: "draft" | "active" | "archived";
  updatedAt?: string;
};

const unwrap = <T>(response: ApiEnvelope<T> | T): T => {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiEnvelope<T>).data as T;
  }
  return response as T;
};

export const fetchPageFaq = async (pathname: string) => {
  const response = await Fetch<ApiEnvelope<PageFaqRecord | null>>(
    "page-faqs/resolve",
    { pathname },
    15000,
    true,
    false,
  );
  return unwrap(response);
};
