import type { Metadata } from "next";
import { DsaPage } from "@/components/dsa/DsaPage";

export const metadata: Metadata = {
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

export default function Page() {
  return <DsaPage />;
}
