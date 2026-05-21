import type { Metadata } from "next";
import { ContactUsPage } from "@/components/contact/ContactUsPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Fintaraa for loan, credit card, insurance, document verification, partner follow-up, support, business, and grievance-related assistance.",
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title: "Contact Us | Fintaraa",
    description:
      "Get support for Fintaraa loans, credit cards, insurance, documents, applications, and partner follow-ups.",
    url: "/contact-us",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactUsPage />;
}
