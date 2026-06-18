import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { ContactUsPage } from "@/components/contact/ContactUsPage";

const fallbackMetadata: Metadata = {
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

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/contact-us", fallbackMetadata);
}

export default function ContactPage() {
  return <ContactUsPage />;
}
