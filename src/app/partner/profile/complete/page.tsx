import type { Metadata } from "next";
import { PartnerCompleteProfilePage } from "@/components/partner/PartnerCompleteProfilePage";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { noIndexRobots } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "Complete Partner Profile",
  description:
    "Complete your Fintaraa partner agency, KYC, business, bank, and document details.",
  robots: noIndexRobots,
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/partner/profile/complete", fallbackMetadata);
}

export default function PartnerCompleteProfileRoute() {
  return <PartnerCompleteProfilePage />;
}

