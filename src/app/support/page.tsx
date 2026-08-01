import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { SupportPage } from "@/components/support/SupportPage";
import { CustomerAuthGuard } from "@/components/auth/CustomerAuthGuard";

const fallbackMetadata: Metadata = {
  title: "Support & Service Desk",
  description:
    "Raise Fintaraa support tickets, track open requests, and continue chat-style follow-ups for applications, documents, payments, insurance, cards, and account help.",
  alternates: { canonical: "/support" },
  openGraph: {
    title: "Support & Service Desk | Fintaraa",
    description:
      "Create tickets, view support status, and chat with Fintaraa support for applications, documents, payments, and account help.",
    url: "/support",
    type: "website",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/support", fallbackMetadata);
}

export default function SupportRoute() {
  return (
    <CustomerAuthGuard redirectTo="/support">
      <SupportPage />
    </CustomerAuthGuard>
  );
}
