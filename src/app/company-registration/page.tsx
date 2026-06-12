import type { Metadata } from "next";
import { CompanyPage } from "@/components/services/company/CompanyPage";

export const metadata: Metadata = {
  title: "Company Formation & Trademark Registration",
  description:
    "Register your company, LLP, OPC, or trademark with assisted legal support from Fintaraa.",
};

export default function Page() {
  return <CompanyPage />;
}
