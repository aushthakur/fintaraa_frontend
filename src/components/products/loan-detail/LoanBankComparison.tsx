"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Star } from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { bankRows } from "./LoanDetailConstants";
import { slugifyProduct } from "@/lib/productRouting";
import type { LoanSeoPageData } from "@/services/loanSeoPages";
import type { BankProductLender } from "@/services/bankSeoPages";

export function LoanBankComparison({
  page,
  lenders,
  showAll = false,
  title = "Compare Fintaraa Partner Lenders",
  description = "Review indicative rates, fees and terms from participating partners",
}: {
  page: LoanSeoPageData;
  lenders?: BankProductLender[];
  showAll?: boolean;
  title?: string;
  description?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rows = lenders?.length
    ? lenders.map((lender) => ({
        name: lender.bankName,
        bankSlug: lender.bankSlug,
        logo: lender.logoUrl,
        rate: lender.interestRate,
        fee: lender.processingFee,
        amount: lender.loanAmount,
        tenure: lender.tenure,
        href: lender.canonicalPath,
      }))
    : bankRows;

  const visibleRows = showAll || isExpanded ? rows : rows.slice(0, 5);

  return (
    <section
      id="bank-comparison"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="w-full max-w-7xl mx-auto bg-white px-4 py-16 antialiased text-slate-900 md:px-6 lg:px-8 border-b border-slate-100"
    >
      
      {/* SECTION TITLE & DESCRIPTION BLOCK */}
      <div className="max-w-3xl mb-12">
        <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      {/* RESPONSIVE SCROLL-WRAPPER TABLE DOCK */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse bg-white text-left text-sm font-normal">
          <thead className="bg-slate-50/70 text-slate-600 text-xs font-normal uppercase tracking-wider border-b-2 border-slate-200 select-none">
            <tr>
              <th className="px-6 py-4 w-[24%] font-normal">Lender</th>
              <th className="px-6 py-4 w-[20%] font-normal">Interest Rate (p.a)</th>
              <th className="px-6 py-4 w-[18%] font-normal">Processing Fee</th>
              <th className="px-6 py-4 w-[16%] font-normal">Max Amount</th>
              <th className="px-6 py-4 w-[12%] font-normal">Max Tenure</th>
              <th className="px-6 py-4 text-center w-[10%] font-normal">Action</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100 font-normal">
            {visibleRows.map((row) => {
              const bankSlug =
                "bankSlug" in row && row.bankSlug
                  ? row.bankSlug
                  : slugifyProduct(row.name);
              const bankDetailHref =
                "href" in row && row.href
                  ? row.href
                  : `/banks/${bankSlug}/${page.loanTypeSlug}`;
              const applyHref = getApplyHref({
                category: "loan",
                productSlug: page.loanTypeSlug,
                bankSlug,
                referrer: bankDetailHref,
              });

              return (
                <tr
                  key={row.name}
                  className="transition-colors hover:bg-purple-50/25"
                >
                {/* 1. LENDER LOGO */}
                <td className="px-6 py-4.5">
                  <div className="flex items-center gap-3.5">
                    <Link
                      href={bankDetailHref}
                      className="block shrink-0 focus:outline-none transition-transform hover:scale-105"
                    >
                      <BankLogoImage
                        src={row.logo || "/assets/banks/indian.png"}
                        alt={row.name}
                        className="h-8 w-28"
                        imageClassName="object-left object-contain"
                      />
                    </Link>
                  </div>
                </td>

                {/* 2. SPECIFIC FINANCIAL INFO DETAILS COLUMNS */}
                <td className="px-6 py-4.5 font-normal text-[#5b21b6] text-[15px]">
                  {row.rate || "11.49% - 21.00%"}
                </td>
                <td className="px-6 py-4.5 font-normal text-slate-700">
                  {row.fee || "Up to 2.5%"}
                </td>
                <td className="px-6 py-4.5 font-normal text-slate-900">
                  {row.amount || "₹ 40 Lakh"}
                </td>
                <td className="px-6 py-4.5 font-normal text-slate-700">
                  {row.tenure || "60 Months"}
                </td>

                {/* 3. CAPSULE CTA SUBMIT LINK */}
                <td className="px-6 py-4.5 text-center">
                  <AuthRedirectLink
                    href={applyHref}
                    productSlug={page.loanTypeSlug}
                    className="inline-flex h-9 items-center justify-center rounded-xl whitespace-nowrap bg-[#5b21b6] px-4 text-xs font-normal text-white transition-all hover:bg-[#4c1d95] active:scale-[0.98] no-underline shadow-xs hover:shadow-md"
                  >
                    Apply Now
                  </AuthRedirectLink>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER: EXPAND MORE LENDERS TOGGLE ACTION */}
      {!showAll && rows.length > 5 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/70 px-6 py-2.5 text-xs font-normal text-[#5b21b6] transition-all hover:bg-purple-100 hover:border-purple-300 shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <span>{isExpanded ? "View fewer lenders" : `View all ${rows.length} partner lenders`}</span>
            <ChevronDown 
              className={`h-4 w-4 text-[#5b21b6] transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`} 
              strokeWidth={2}
            />
          </button>
        </div>
      )}

    </section>
  );
}
