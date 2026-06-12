import Link from "next/link";
import { BadgeCheck, Download, FileDown } from "lucide-react";
import { CibilGauge } from "@/components/cibil/CibilGauge";

const summaryRows = [
  ["Payment History", "100%"],
  ["Credit Card Utilization", "18%"],
  ["Credit Enquiries", "1"],
  ["Credit Mix", "2"],
  ["Credit Age", "2 yr 6 m"],
];

export function CibilReportHero() {
  return (
    <section className="px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[0.9fr_1fr]">
        <div>
          <h1 className="text-[24px] font-medium text-[#111827]">
            You are on FREE Credit Score Plan
          </h1>
          <div className="mt-5 flex gap-4">
            <span className="rounded bg-[#13a653] px-6 py-2 text-[13px] font-black text-white">
              CIBIL
            </span>
            <span className="rounded border border-[#d7dfe8] px-6 py-2 text-[13px] font-black text-[#667085]">
              EXPERIAN
            </span>
          </div>
          <p className="mt-5 text-[14px] font-medium text-[#111827]">
            Hey Puneet! Your Credit Score as of 01 Jun 26
          </p>
          <div className="mt-7 text-center">
            <p className="text-[14px] font-medium text-[#111827]">
              Your Current Score
            </p>
            <CibilGauge />
            <Link
              href="/cibil-score/report"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#13a653] px-12 text-[14px] font-black text-white no-underline"
            >
              Download Full Report
            </Link>
            <p className="mt-5 text-[12px] font-semibold text-[#667085]">
              Next refresh available in 30 days.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-[24px] font-black text-[#111827]">
            Quick Report Summary
          </h2>
          <div className="mt-5 divide-y divide-[#e5eaf0] border-t border-[#111827]">
            {summaryRows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-5">
                <p className="flex items-center gap-3 text-[14px] font-black text-[#111827]">
                  <BadgeCheck className="h-5 w-5 text-[#005ca8]" />
                  {label}
                </p>
                <p className="text-[14px] font-black text-[#111827]">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between rounded bg-[#d9f8e6] p-5">
            <div>
              <p className="text-[15px] font-black text-[#13a653]">
                Credit Report Generated
              </p>
              <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                Detailed report is ready for download.
              </p>
            </div>
            <Download className="h-10 w-10 text-[#13a653]" />
          </div>
          <div className="mt-8 text-right">
            <Link
              href="/cibil-score/report"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#13a653] px-8 text-[13px] font-black text-white no-underline"
            >
              <FileDown className="h-4 w-4" />
              View Full Report
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
