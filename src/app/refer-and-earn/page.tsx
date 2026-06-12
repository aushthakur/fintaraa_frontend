import type { Metadata } from "next";
import { ReferPage } from "@/components/services/refer/ReferPage";

export const metadata: Metadata = {
  title: "Refer and Earn | Fintaraa",
  description:
    "Refer friends to Fintaraa and track referral rewards, registrations, approvals and payout status.",
  alternates: { canonical: "/refer-and-earn" },
};

export default function Page() {
  return <ReferPage />;
}
