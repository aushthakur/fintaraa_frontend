import type { Metadata } from "next";
import PartnersByProductPage from "@/components/partners-by-product/PartnersByProductPage";

export const metadata: Metadata = {
  title: "Our Partner by Product",
  description:
    "Explore Fintaraa partner institutions by product category with curated bank and NBFC options.",
};

export default function Page() {
  return <PartnersByProductPage />;
}
