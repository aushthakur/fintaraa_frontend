import type { Metadata } from "next";
import { PartnerProfilePage } from "@/components/partner/PartnerProfilePage";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { noIndexRobots } from "@/services/seoConfig";

const fallbackMetadata: Metadata = {
  title: "Partner Profile",
  description:
    "Manage your Fintaraa partner profile, KYC details, bank details, and lead activity.",
  robots: noIndexRobots,
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/partner/profile", fallbackMetadata);
}

export default function PartnerProfileRoute() {
  return <PartnerProfilePage />;
}

