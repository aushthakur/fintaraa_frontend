import type { Metadata } from "next";
import { CreditCardsExplorer } from "@/components/credit-cards/CreditCardsExplorer";
import { CreditCardDetailScreen } from "@/components/credit-cards/CreditCardDetailScreen";
import { humanizeSlug, slugifyProduct } from "@/lib/productRouting";
import { getPageSeoMetadata } from "@/services/seoMetadata";

type PageProps = {
  params: Promise<{
    bank: string;
    segments?: string[];
  }>;
};

export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { bank, segments = [] } = await params;
  const bankLabel = humanizeSlug(bank);
  const cardType = segments[0] ? humanizeSlug(segments[0]) : "";
  const isEligibility = segments.at(-1) === "eligibility";
  const isDetail = segments.length >= 2;
  const canonical = `/credit-cards/${slugifyProduct(bank)}${
    segments.length ? `/${segments.map(slugifyProduct).join("/")}` : ""
  }`;

  const title = isDetail
    ? `${bankLabel} ${cardType || "Credit Card"} ${
        isEligibility ? "Eligibility" : "Details"
      }`
    : `${bankLabel} ${cardType || "Credit Cards"}`;

  return getPageSeoMetadata(canonical, {
    title,
    description: `Compare ${title.toLowerCase()} on Fintaraa with fees, rewards, eligibility, benefits, and assisted application support.`,
    alternates: { canonical },
    openGraph: {
      title,
      description: `Compare ${title.toLowerCase()} on Fintaraa.`,
      url: canonical,
      type: "website",
    },
  });
}

export default async function CreditCardDynamicRoute({ params }: PageProps) {
  const { bank, segments = [] } = await params;
  const [cardTypeSlug = "", cardSegment = "", action = ""] = segments;

  if (cardSegment) {
    return (
      <CreditCardDetailScreen
        bankSlug={bank}
        cardTypeSlug={cardTypeSlug}
        cardSegment={cardSegment}
        mode={action === "eligibility" ? "eligibility" : "details"}
      />
    );
  }

  return (
    <CreditCardsExplorer
      initialBankSlug={bank}
      initialCardTypeSlug={cardTypeSlug}
    />
  );
}
