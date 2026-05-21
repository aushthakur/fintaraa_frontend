import type { Metadata } from "next";
import { ProductsPage } from "@/components/products/ProductsPage";

export const metadata: Metadata = {
  title: "Products | Fintaraa",
  description:
    "Explore Fintaraa loans, credit cards, insurance plans, and additional financial services with search and assisted applications.",
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Fintaraa Products",
    description:
      "Search and compare loans, credit cards, insurance plans, and financial services on Fintaraa.",
    url: "/products",
    type: "website",
  },
};

export default function Page() {
  return <ProductsPage />;
}
