import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoanDetailPage } from "@/components/products/loan-detail/LoanDetailPage";
import { InsuranceDetailPage } from "@/components/products/insurance-detail/InsuranceDetailPage";
import {
  buildLoanPath,
  isInsuranceProduct,
  isLoanProduct,
  parseLoanLocation,
  slugifyProduct,
} from "@/lib/productRouting";
import { getLoanSeoPage } from "@/services/loanSeoPages";
import { getInsuranceSeoPage } from "@/services/insuranceSeoPages";

type PageProps = {
  params: Promise<{
    loanType: string;
    location?: string[];
  }>;
};

export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { loanType, location: locationSegments = [] } = await params;
  const productSlug = slugifyProduct(loanType);
  if (!isLoanProduct(productSlug) && !isInsuranceProduct(productSlug)) return {};

  const location = parseLoanLocation(locationSegments);
  const page = isInsuranceProduct(productSlug)
    ? await getInsuranceSeoPage(productSlug, location)
    : await getLoanSeoPage(productSlug, location);
  const canonical = page.canonicalPath || buildLoanPath(productSlug, location);

  return {
    title: page.seoTitle || `${page.title} | Fintaraa`,
    description:
      page.seoDescription ||
      page.heroDescription ||
      "Compare eligibility, documents, fees, cover, and assisted application options with Fintaraa.",
    alternates: { canonical },
    robots: page.isIndexable === false ? { index: false, follow: true } : {},
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.heroDescription || page.subtitle,
      url: canonical,
      type: "website",
    },
  };
}

export default async function ProductLoanPage({ params }: PageProps) {
  const { loanType, location: locationSegments = [] } = await params;
  const productSlug = slugifyProduct(loanType);
  if (!isLoanProduct(productSlug) && !isInsuranceProduct(productSlug)) notFound();

  const location = parseLoanLocation(locationSegments);
  if (isInsuranceProduct(productSlug)) {
    const page = await getInsuranceSeoPage(productSlug, location);
    return <InsuranceDetailPage page={page} />;
  }

  const page = await getLoanSeoPage(productSlug, location);
  return <LoanDetailPage page={page} />;
}
