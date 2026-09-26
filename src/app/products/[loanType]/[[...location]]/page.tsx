import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoanDetailPage } from "@/components/products/loan-detail/LoanDetailPage";
import { InsuranceDetailPage } from "@/components/products/insurance-detail/InsuranceDetailPage";
import {
  buildLoanPath,
  isLoanProduct,
  slugifyProduct,
  parseLoanLocation,
  isInsuranceProduct,
} from "@/lib/productRouting";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getLoanSeoLocationPages,
  getLoanSeoPage,
} from "@/services/loanSeoPages";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { absoluteUrl, siteName } from "@/services/seoConfig";
import {
  getInsuranceSeoLocationPages,
  getInsuranceSeoPage,
} from "@/services/insuranceSeoPages";
import { getBankProductLenders } from "@/services/bankSeoPages";
import { InstantLoanMarketplacePage } from "@/components/products/instant-loan/InstantLoanMarketplacePage";
import { EducationLoanPage } from "@/components/products/education-loan/EducationLoanPage";
import { RenovationLoanPage } from "@/components/products/renovation-loan/RenovationLoanPage";
import { WeddingLoanPage } from "@/components/products/wedding-loan/WeddingLoanPage";
import { MedicalLoanPage } from "@/components/products/medical-loan/MedicalLoanPage";
import { HomeLoanPage } from "@/components/products/home-loan/HomeLoanPage";
import { BalanceTransferLoanPage } from "@/components/products/balance-transfer-loan/BalanceTransferLoanPage";
import { LoanAgainstPropertyPage } from "@/components/products/loan-against-property/LoanAgainstPropertyPage";
import { ConstructionLoanPage } from "@/components/products/construction-loan/ConstructionLoanPage";

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
  if (!isLoanProduct(productSlug) && !isInsuranceProduct(productSlug))
    return {};

  const location = parseLoanLocation(locationSegments);
  const page = isInsuranceProduct(productSlug)
    ? await getInsuranceSeoPage(productSlug, location)
    : await getLoanSeoPage(productSlug, location);
  const canonical = page.canonicalPath || buildLoanPath(productSlug, location);

  return getPageSeoMetadata(canonical, {
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
  });
}

export default async function ProductLoanPage({ params }: PageProps) {
  const { loanType, location: locationSegments = [] } = await params;
  const productSlug = slugifyProduct(loanType);
  if (!isLoanProduct(productSlug) && !isInsuranceProduct(productSlug))
    notFound();

  const location = parseLoanLocation(locationSegments);
  if (isInsuranceProduct(productSlug)) {
    const [page, locationPages] = await Promise.all([
      getInsuranceSeoPage(productSlug, location),
      getInsuranceSeoLocationPages(productSlug),
    ]);
    const canonical =
      page.canonicalPath || buildLoanPath(productSlug, location);
    return (
      <>
        <JsonLd
          id="product-page-schema"
          data={[
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: absoluteUrl("/"),
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Products",
                  item: absoluteUrl("/products"),
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: page.title,
                  item: absoluteUrl(canonical),
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "Service",
              name: page.title,
              description:
                page.seoDescription || page.heroDescription || page.subtitle,
              provider: {
                "@type": "Organization",
                name: siteName,
                url: absoluteUrl("/"),
              },
              areaServed: "IN",
              serviceType: page.insuranceType,
              url: absoluteUrl(canonical),
            },
          ]}
        />
        <InsuranceDetailPage page={page} locationPages={locationPages} />
      </>
    );
  }

  const [page, locationPages, bankLenders] = await Promise.all([
    getLoanSeoPage(productSlug, location),
    getLoanSeoLocationPages(productSlug),
    productSlug === "instant-loan" ||
    productSlug === "education-loan" ||
    productSlug === "renovation-loan" ||
    productSlug === "wedding-loan" ||
    productSlug === "marriage-loan" ||
    productSlug === "medical-loan" ||
    productSlug === "healthcare-loan" ||
    productSlug === "home-loan" ||
    productSlug === "housing-loan" ||
    productSlug === "balance-transfer-top-up-loan" ||
    productSlug === "balance-transfer-loan" ||
    productSlug === "loan-against-property" ||
    productSlug === "lap" ||
    productSlug === "construction-loan"
      ? getBankProductLenders(productSlug)
      : Promise.resolve([]),
  ]);
  const canonical = page.canonicalPath || buildLoanPath(productSlug, location);
  return (
    <>
      <JsonLd
        id="product-page-schema"
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: absoluteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Products",
                item: absoluteUrl("/products"),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: page.title,
                item: absoluteUrl(canonical),
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: page.title,
            description:
              page.seoDescription || page.heroDescription || page.subtitle,
            provider: {
              "@type": "Organization",
              name: siteName,
              url: absoluteUrl("/"),
            },
            areaServed: "IN",
            serviceType: page.loanType,
            url: absoluteUrl(canonical),
          },
        ]}
      />
      {productSlug === "instant-loan" ? (
        <InstantLoanMarketplacePage
          page={page}
          lenders={bankLenders}
          locationPages={locationPages}
        />
      ) : productSlug === "education-loan" ? (
        <EducationLoanPage
          page={page}
          lenders={bankLenders}
          locationPages={locationPages}
        />
      ) : productSlug === "renovation-loan" ? (
        <RenovationLoanPage
          page={page}
          lenders={bankLenders}
          locationPages={locationPages}
        />
      ) : productSlug === "wedding-loan" || productSlug === "marriage-loan" ? (
        <WeddingLoanPage
          page={page}
          lenders={bankLenders}
          locationPages={locationPages}
        />
      ) : productSlug === "medical-loan" || productSlug === "healthcare-loan" ? (
        <MedicalLoanPage
          page={page}
          lenders={bankLenders}
          locationPages={locationPages}
        />
      ) : productSlug === "home-loan" || productSlug === "housing-loan" ? (
        <HomeLoanPage
          page={page}
          lenders={bankLenders}
          locationPages={locationPages}
        />
      ) : productSlug === "balance-transfer-top-up-loan" ||
        productSlug === "balance-transfer-loan" ||
        productSlug === "top-up-loan" ? (
        <BalanceTransferLoanPage
          page={page}
          lenders={bankLenders}
          locationPages={locationPages}
        />
      ) : productSlug === "loan-against-property" || productSlug === "lap" ? (
        <LoanAgainstPropertyPage
          page={page}
          lenders={bankLenders}
          locationPages={locationPages}
        />
      ) : productSlug === "construction-loan" ? (
        <ConstructionLoanPage
          page={page}
          lenders={bankLenders}
          locationPages={locationPages}
        />
      ) : (
        <LoanDetailPage
          page={page}
          locationPages={locationPages}
          bankLenders={bankLenders}
        />
      )}
    </>
  );
}
