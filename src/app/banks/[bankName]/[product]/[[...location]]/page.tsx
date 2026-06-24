import type { Metadata } from "next";
import { BankDetailPage } from "@/components/banks/BankDetailPage";
import { parseLoanLocation, slugifyProduct } from "@/lib/productRouting";
import {
  buildBankPath,
  getBankSeoLocationPages,
  getBankSeoPage,
} from "@/services/bankSeoPages";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteName } from "@/services/seoConfig";

type PageProps = {
  params: Promise<{
    bankName: string;
    product: string;
    location?: string[];
  }>;
};

export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const {
    bankName,
    product,
    location: locationSegments = [],
  } = await params;
  const bankSlug = slugifyProduct(bankName);
  const productSlug = slugifyProduct(product);
  const location = parseLoanLocation(locationSegments);
  const page = await getBankSeoPage(bankSlug, productSlug, location);
  const canonical = page.canonicalPath || buildBankPath(bankSlug, productSlug, location);

  return getPageSeoMetadata(canonical, {
    title: page.seoTitle || `${page.title} | Fintaraa`,
    description:
      page.seoDescription ||
      page.subtitle ||
      "Compare bank product rates, eligibility, documents, and assisted application options with Fintaraa.",
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

export default async function BankSeoRoute({ params }: PageProps) {
  const {
    bankName,
    product,
    location: locationSegments = [],
  } = await params;
  const bankSlug = slugifyProduct(bankName);
  const productSlug = slugifyProduct(product);
  const location = parseLoanLocation(locationSegments);
  const [page, locationPages] = await Promise.all([
    getBankSeoPage(bankSlug, productSlug, location),
    getBankSeoLocationPages(bankSlug, productSlug),
  ]);

  const canonical =
    page.canonicalPath || buildBankPath(bankSlug, productSlug, location);

  return (
    <>
      <JsonLd
        id="bank-page-schema"
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
                item: absoluteUrl("/partners"),
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
            description: page.seoDescription || page.subtitle,
            provider: {
              "@type": "Organization",
              name: siteName,
              url: absoluteUrl("/"),
            },
            areaServed: "IN",
            serviceType: page.productName,
            url: absoluteUrl(canonical),
          },
        ]}
      />
      <BankDetailPage page={page} locationPages={locationPages} />
    </>
  );
}
