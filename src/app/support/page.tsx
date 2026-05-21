import type { Metadata } from "next";
import { SupportPage } from "@/components/support/SupportPage";

export const metadata: Metadata = {
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

export default function SupportRoute() {
  return <SupportPage />;
}
