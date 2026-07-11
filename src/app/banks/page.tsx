import type { Metadata } from "next";
import { BankDirectorySection } from "@/components/banks/BankDirectorySection";
import { getPageSeoMetadata } from "@/services/seoMetadata";

const fallbackMetadata: Metadata = {
  title: "Banks and Lending Partners",
  description:
    "Browse Fintaraa bank partners with logos, indicative interest ranges, loan products, and credit-card pages.",
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageSeoMetadata("/banks", fallbackMetadata);
}

export default function BanksPage() {
  return (
    <main className="bg-white">
      <BankDirectorySection />
    </main>
  );
}
