import type { Metadata } from "next";
import { DsaPage } from "@/components/dsa/DsaPage";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Become a Fintaraa DSA Partner",
  description:
    "Become a Fintaraa DSA partner and earn commissions by referring loan, credit card and insurance customers through a guided partner program.",
  alternates: { canonical: "/become-dsa" },
  openGraph: {
    title: "Become a Fintaraa DSA Partner",
    description:
      "Register as a Fintaraa partner, submit customer leads and earn commissions with training, tracking and partner support.",
    url: "/become-dsa",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/become-dsa", fallbackMetadata);
}

export default function Page() {
  return <DsaPage />;
}
