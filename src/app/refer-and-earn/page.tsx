import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { ReferPage } from "@/components/services/refer/ReferPage";
import { noIndexRobots } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "Refer and Earn | Fintaraa",
  description:
    "Refer friends to Fintaraa and track referral rewards, registrations, approvals and payout status.",
  alternates: { canonical: "/refer-and-earn" },
  robots: noIndexRobots,
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/refer-and-earn", fallbackMetadata);
}

export default function Page() {
  return <ReferPage />;
}
