"use client";

import {
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FileSpreadsheet,
} from "lucide-react";
import type { LoanSeoPageData } from "@/services/loanSeoPages";

export function LoanFeesChargesSection({
  page,
}: {
  page: LoanSeoPageData;
}) {
  const feeItems = [
    {
      feeName: "Processing Fee",
      charge: "0.50% to 2.50% of loan amount (+ GST)",
      frequency: "One-time deduction from disbursal",
      details:
        "Covers loan underwriting, credit verification, and legal appraisal. Special campaigns offer flat ₹999 or complete waivers for Category A corporate employees.",
    },
    {
      feeName: "Foreclosure / Pre-closure Charges",
      charge: "0% (NIL) on floating rate loans",
      frequency: "At the time of full loan closure",
      details:
        "As per RBI directives, no foreclosure penalty is applicable on floating-rate individual loans. For fixed-rate loans, zero charges after 12 EMIs (or 2% to 4% if closed earlier).",
    },
    {
      feeName: "Part-Payment Charges",
      charge: "0% (NIL) up to 25% per financial year",
      frequency: "When paying surplus lump sum",
      details:
        "Make part-payments anytime through net banking to directly decrease your principal and save tens of thousands in future interest.",
    },
    {
      feeName: "Stamp Duty & State Statutory Charges",
      charge: "₹100 to ₹500 (At actuals)",
      frequency: "One-time during agreement execution",
      details:
        "Statutory state government duty for electronic loan agreement e-Stamping as per state-specific stamp acts.",
    },
    {
      feeName: "Overdue EMI Penal Charges",
      charge: "1.5% to 2.0% per month on unpaid EMI",
      frequency: "Per month on overdue amount only",
      details:
        "Compliant with RBI Fair Lending Practice circulars. Penal charges are levied only on the delayed installment, never capitalized or compounded on principal.",
    },
    {
      feeName: "NACH / e-Mandate Bounce Fee",
      charge: "₹400 to ₹500 per failed attempt",
      frequency: "Per transaction bounce",
      details:
        "Charged by the clearing bank if your bank account lacks sufficient balance on the auto-debit presentation date.",
    },
    {
      feeName: "NOC / Amortization Schedule Copy",
      charge: "₹0 (100% Free digital download)",
      frequency: "Anytime on demand",
      details:
        "Download your updated repayment schedule, interest certificate, and final No Objection Certificate (NOC) instantly online.",
    },
    {
      feeName: "Loan Cancellation / Re-booking Fee",
      charge: "₹1,000 to ₹2,500 (+ GST)",
      frequency: "If cancelled post sanction",
      details:
        "Applicable only if a borrower chooses to cancel the loan agreement after sanction and generation of disbursement documents.",
    },
  ];

  return (
    <section
      id="fees-and-charges"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="w-full max-w-7xl mx-auto px-4 py-16 antialiased text-slate-900 md:px-6 lg:px-8 border-b border-slate-100"
    >
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
          Fees &amp; Charges for <span className="text-[#5b21b6]">{page.loanType || "Personal Loan"}</span>
        </h2>
        <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
          At Fintaraa, transparency is our core promise. We ensure you receive a standardized Key Fact Statement (KFS) detailing every rupee charged, with zero hidden costs or undisclosed upfront deductions.
        </p>
      </div>

      {/* Borderless, Editorial Fee Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[720px] text-left border-collapse font-normal">
          <thead>
            <tr className="border-b-2 border-slate-200 text-xs font-normal uppercase tracking-wider text-slate-500">
              <th className="py-4 pr-6 w-[25%] font-normal">Fee Category</th>
              <th className="py-4 pr-6 w-[25%] text-[#5b21b6] font-normal">Standard Applicable Rate</th>
              <th className="py-4 pr-6 w-[20%] font-normal">Frequency</th>
              <th className="py-4 w-[30%] font-normal">Details &amp; Regulatory Terms</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-normal">
            {feeItems.map((item) => (
              <tr key={item.feeName} className="hover:bg-purple-50/20 transition-colors">
                <td className="py-5 pr-6 font-normal text-slate-900">
                  {item.feeName}
                </td>
                <td className="py-5 pr-6 font-normal text-[#5b21b6]">
                  {item.charge}
                </td>
                <td className="py-5 pr-6 font-normal text-slate-500 text-xs sm:text-sm">
                  {item.frequency}
                </td>
                <td className="py-5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RBI Regulatory Compliance Note & KFS (Key Fact Statement) */}
      <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 font-normal">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#5b21b6]">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-normal text-slate-900">
              Mandatory Key Fact Statement (KFS)
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Every loan sanctioned through Fintaraa includes an RBI-mandated Key Fact Statement. It outlines your Annual Percentage Rate (APR), total interest over tenure, net disbursed amount, and explicit fee schedule before you sign.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#5b21b6]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-normal text-slate-900">
              Fair Lending Practice Guarantee
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              No usurious rates, surprise insurance bundling, or compounding penalty fees. We partner only with RBI-regulated Scheduled Commercial Banks and NBFCs adhering strictly to ethical digital lending guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Tips to Save on Fees */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-y-3 gap-x-8 text-xs text-slate-500 font-normal">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Keep sufficient balance on EMI due date to avoid NACH bounce fees</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Ask your loan advisor for current zero-processing-fee corporate promotions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-purple-600 shrink-0" />
          <span>All fees are subject to 18% statutory GST as per Government of India rules</span>
        </div>
      </div>
    </section>
  );
}
