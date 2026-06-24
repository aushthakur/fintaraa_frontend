import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Landmark, ShieldCheck } from "lucide-react";
import { TrustedPartnerBanksSection } from "@/components/partners/TrustedPartnerBanksSection";
import { trustedPartners } from "@/data/trustedPartners";

export const metadata: Metadata = {
  title: "All Partner Banks & NBFCs | Fintaraa",
  description:
    "Browse all Fintaraa partner banks and NBFCs for loans, insurance, credit cards, and credit bureau assisted journeys.",
};

export default function AllPartnersPage() {
  const bankCount = trustedPartners.filter(
    (partner) => partner.type === "Bank",
  ).length;
  const nbfcCount = trustedPartners.filter(
    (partner) => partner.type === "NBFC",
  ).length;

  return (
    <main className="bg-white">
      <section className="bg-[#f5fbff] px-4 py-14 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <Link
            href="/partners"
            className="inline-flex items-center gap-2 text-[13px] font-extrabold text-[#005ca8] no-underline hover:text-[#003f77]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to partners
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#005ca8]">
                Fintaraa partner network
              </p>
              <h1 className="mt-3 max-w-4xl text-[42px] font-black leading-tight tracking-tight text-[#07162d] md:text-[64px]">
                All partner banks and NBFCs
              </h1>
              <p className="mt-5 max-w-4xl text-[16px] font-semibold leading-8 text-[#475467] md:text-[18px]">
                Explore every listed partner by product category. Select any
                logo to open that bank or NBFC page with loan, credit-card, and
                location-wise support where available.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#dce9f7] bg-white p-4 shadow-[0_10px_28px_rgba(16,24,40,0.04)]">
                <Landmark className="h-5 w-5 text-[#005ca8]" />
                <p className="mt-4 text-[28px] font-black text-[#07162d]">
                  {bankCount}
                </p>
                <p className="mt-1 text-[12px] font-extrabold uppercase tracking-wide text-[#667085]">
                  Banks
                </p>
              </div>
              <div className="rounded-2xl border border-[#dce9f7] bg-white p-4 shadow-[0_10px_28px_rgba(16,24,40,0.04)]">
                <ShieldCheck className="h-5 w-5 text-[#13a653]" />
                <p className="mt-4 text-[28px] font-black text-[#07162d]">
                  {nbfcCount}
                </p>
                <p className="mt-1 text-[12px] font-extrabold uppercase tracking-wide text-[#667085]">
                  NBFCs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustedPartnerBanksSection
        mode="grid"
        defaultShowAll
        showViewAllAction={false}
        title="All Trusted Partner Banks & NBFCs"
        description="Filter by product category or open any partner directly from the logo grid."
        className="pt-10"
      />
    </main>
  );
}
