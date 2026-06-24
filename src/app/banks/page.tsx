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
      <section className="bg-[#f5fbff] px-4 py-14 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#005ca8]">
            Fintaraa banks
          </p>
          <h1 className="mt-3 max-w-5xl text-[42px] font-black leading-tight tracking-tight text-[#07162d] md:text-[64px]">
            Bank-wise loans and credit cards
          </h1>
          <p className="mt-5 max-w-4xl text-[17px] font-semibold leading-8 text-[#475467]">
            Compare bank pages by loan type, credit-card type, state, city,
            pincode, and area with guided application support.
          </p>
        </div>
      </section>
      <BankDirectorySection />
    </main>
  );
}
