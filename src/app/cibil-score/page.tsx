import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import { CibilScorePage } from "@/components/cibil/CibilScorePage";

const fallbackMetadata: Metadata = {
  title: "Free CIBIL Score & Report",
  description:
    "Check your free credit score and CIBIL report with Fintaraa.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/cibil-score", fallbackMetadata);
}

export default function Page() {
  return <CibilScorePage />;
}
