import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { FranchisePage } from "@/components/franchise/FranchisePage";

const fallbackMetadata: Metadata = {
  title: "Fintaraa Franchise | Partner With Fintaraa",
  description:
    "Open your own Fintaraa franchise and build a financial services business with bank, NBFC, loan, credit card and insurance partner support.",
  alternates: { canonical: "/franchise" },
  openGraph: {
    title: "Open Your Own Fintaraa Franchise",
    description:
      "Partner with Fintaraa to refer loans, credit cards and insurance products with guided onboarding and support.",
    url: "/franchise",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/franchise", fallbackMetadata);
}

export default function Page() {
  return <FranchisePage />;
}
