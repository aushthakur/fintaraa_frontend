"use client";

import { Briefcase, Building2 } from "lucide-react";
import type { LoanSeoPageData } from "@/services/loanSeoPages";
import { getProductContentConfig } from "@/data/productSpecificContent";

export function LoanDocumentsRequired({
  page,
  embedded = false,
}: {
  page: LoanSeoPageData;
  embedded?: boolean;
}) {
  const config = getProductContentConfig(page.loanTypeSlug, page.loanType);
  const { column1, column2 } = config.documents;

  return (
    <section
      id="documents"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="w-full max-w-7xl mx-auto px-4 py-16 antialiased text-slate-900 md:px-6 lg:px-8 border-b border-slate-100"
    >
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
          Documents Required for <span className="text-[#5b21b6]">{page.loanType || config.title}</span>
        </h2>
        <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
          Enjoy 100% paperless approval through DigiLocker e-KYC and RBI-regulated Account Aggregators. Upload digital soft copies or verify instantly with Aadhaar OTP without branch visits.
        </p>
      </div>

      {/* Main Checklist: Column 1 vs Column 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Column 1 */}
        <div>
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-[#5b21b6]">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-normal text-slate-900">{column1.categoryTitle}</h3>
              <p className="text-xs text-slate-500 font-normal">{column1.categorySubtitle}</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {column1.items.map((item, idx) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#5b21b6] text-xs font-normal mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-normal text-slate-900">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-normal text-slate-900">{column2.categoryTitle}</h3>
              <p className="text-xs text-slate-500 font-normal">{column2.categorySubtitle}</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {column2.items.map((item, idx) => (
              <div key={item.title} className="flex items-start gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-normal mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-normal text-slate-900">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
