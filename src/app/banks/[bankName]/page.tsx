import type { Metadata } from "next";
import { BankDetailPage } from "@/components/banks/BankDetailPage";
import { slugifyProduct } from "@/lib/productRouting";
import {
  buildBankOverviewPath,
  getBankOverviewPage,
} from "@/services/bankSeoPages";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteName } from "@/services/seoConfig";

type PageProps = {
  params: Promise<{
    bankName: string;
  }>;
};

export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { bankName } = await params;
  const bankSlug = slugifyProduct(bankName);
  const page = await getBankOverviewPage(bankSlug);
  const canonical = page.canonicalPath || buildBankOverviewPath(bankSlug);

  return getPageSeoMetadata(canonical, {
    title: page.seoTitle || `${page.bankName} | Fintaraa`,
    description:
      page.seoDescription ||
      page.subtitle ||
      "Compare bank products, eligibility, documents, and assisted application options with Fintaraa.",
    alternates: { canonical },
    robots: page.isIndexable === false ? { index: false, follow: true } : {},
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.subtitle,
      url: canonical,
      type: "website",
    },
  });
}

export default async function BankOverviewRoute({ params }: PageProps) {
  const { bankName } = await params;
  const bankSlug = slugifyProduct(bankName);
  const page = await getBankOverviewPage(bankSlug);
  const canonical = page.canonicalPath || buildBankOverviewPath(bankSlug);

  return (
    <>
      <JsonLd
        id="bank-overview-schema"
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
                name: "Banks",
                item: absoluteUrl("/banks"),
              },
              {
                "@type": "ListItem",
                position: 3,
                name: page.bankName,
                item: absoluteUrl(canonical),
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FinancialService",
            name: page.bankName,
            description: page.seoDescription || page.subtitle,
            provider: {
              "@type": "Organization",
              name: siteName,
              url: absoluteUrl("/"),
            },
            areaServed: "IN",
            url: absoluteUrl(canonical),
          },
        ]}
      />
      <BankDetailPage page={page} locationPages={[]} />
    </>
  );
}
