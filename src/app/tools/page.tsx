import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { FinancialToolsPage } from "@/components/tools/FinancialToolsPage";

const fallbackMetadata: Metadata = {
  title: "Financial Tools",
  description:
    "Use Fintaraa tools for CIBIL score, product discovery, application tracking, and credit card comparison.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/tools", fallbackMetadata);
}

export default function ToolsPage() {
  return <FinancialToolsPage />;
}
