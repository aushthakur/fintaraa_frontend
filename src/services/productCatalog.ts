import { Fetch } from "@/hooks/apiUtils";

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

export type PublicProductPage = {
  _id?: string;
  loanType?: string;
  loanTypeSlug?: string;
  insuranceType?: string;
  insuranceTypeSlug?: string;
  title?: string;
  subtitle?: string;
  canonicalPath?: string;
  priority?: number;
  updatedAt?: string;
};

const unwrapList = (payload: unknown): PublicProductPage[] => {
  const response = payload as ApiEnvelope<unknown>;
  const data = "data" in response ? response.data : payload;
  if (Array.isArray(data)) return data as PublicProductPage[];
  if (data && typeof data === "object" && Array.isArray((data as any).result)) {
    return (data as any).result as PublicProductPage[];
  }
  return [];
};

export const fetchPublicProductPages = async () => {
  const [loans, insurance] = await Promise.all([
    Fetch<ApiEnvelope<PublicProductPage[]>>(
      "loan-pages/public",
      { limit: 250 },
      15000,
      true,
      false,
    )
      .then(unwrapList)
      .catch(() => []),
    Fetch<ApiEnvelope<PublicProductPage[]>>(
      "insurance-pages/public",
      { limit: 250 },
      15000,
      true,
      false,
    )
      .then(unwrapList)
      .catch(() => []),
  ]);
  return { loans, insurance };
};
