import type { Metadata } from "next";
import { getPageSeoMetadata } from "@/services/seoMetadata";
import PartnersByProductPage from "@/components/partners-by-product/PartnersByProductPage";

const fallbackMetadata: Metadata = {
  title: "Our Partner by Product",
  description:
    "Explore Fintaraa partner institutions by product category with curated bank and NBFC options.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/partners-by-product", fallbackMetadata);
}

export default function Page() {
  return <PartnersByProductPage />;
}
