import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { ReferPage } from "@/components/services/refer/ReferPage";

const fallbackMetadata: Metadata = {
  title: "Refer and Earn | Fintaraa",
  description:
    "Refer friends to Fintaraa and track referral rewards, registrations, approvals and payout status.",
  alternates: { canonical: "/refer-and-earn" },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/refer-and-earn", fallbackMetadata);
}

export default function Page() {
  return <ReferPage />;
}
