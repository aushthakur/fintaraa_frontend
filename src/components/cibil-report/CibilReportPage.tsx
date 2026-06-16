import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { CibilEligibleOffers } from "./CibilEligibleOffers";
import { CibilMonitoringTips } from "./CibilMonitoringTips";
import { CibilReportCompare } from "./CibilReportCompare";
import { CibilReportHero } from "./CibilReportHero";
import { CibilReportSocial } from "./CibilReportSocial";

export function CibilReportPage() {
  return (
    <main className="bg-white">
      <CibilReportHero />
      <CibilReportCompare />
      <CibilEligibleOffers />
      <section className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl rounded border border-[#c7def3] bg-[#e8f4ff] px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[12px] font-semibold text-[#005ca8]">
            You will receive alerts when your credit report changes.
          </p>
          <a className="rounded-full border border-[#13a653] px-6 py-2 text-[12px] font-black text-[#13a653] whitespace-nowrap self-start sm:self-center">
            Need help? Contact Support
          </a>
        </div>
      </section>
      <CibilMonitoringTips />
      <CibilReportSocial />
      <AppDownloadBanner />
    </main>
  );
}
