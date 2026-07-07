import { buildApiUrl } from "./apiUrl";

export type CompanyBankCategoryMatch = {
  _id: string;
  companyName: string;
  bankName: string;
  categories: string[];
  primaryCategory?: string;
};

type ApiResponse<T> = {
  data?: T;
};

type SearchResponse = {
  total: number;
  results: CompanyBankCategoryMatch[];
};

export async function searchCompanyBankCategories(params: {
  q: string;
  bankName?: string;
  limit?: number;
}): Promise<CompanyBankCategoryMatch[]> {
  if (!params.q || params.q.trim().length < 2) return [];

  const apiUrl = buildApiUrl("/company-bank-categories/public/search");
  if (!apiUrl) return [];

  const url = new URL(apiUrl);
  url.searchParams.set("q", params.q.trim());
  url.searchParams.set("limit", String(params.limit || 8));
  if (params.bankName) url.searchParams.set("bankName", params.bankName);

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    if (!response.ok) return [];
    const json = (await response.json()) as ApiResponse<SearchResponse>;
    return json.data?.results || [];
  } catch {
    return [];
  }
}
