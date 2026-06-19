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

export function LoanBankComparison({ page }: { page: LoanSeoPageData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safely displays a set number of initial rows or all rows based on state toggle
  const visibleRows = isExpanded ? bankRows : bankRows.slice(0, 5);

  return (
    <section className="w-full max-w-9xl mx-auto bg-white px-4 py-12 antialiased text-[#111827] md:px-6">
      
      {/* SECTION TITLE & DESCRIPTION BLOCK */}
      <div className="mb-6">
        <h2 className="text-[28px] font-bold tracking-tight text-gray-900 leading-none">
          Compare Top Banks & NBFCs
        </h2>
        <p className="mt-2 text-sm font-medium text-gray-400">
          Compare interest rates, fees and offers from top lenders
        </p>
      </div>

      {/* RESPONSIVE SCROLL-WRAPPER TABLE DOCK */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full min-w-210 border-collapse bg-white text-left text-sm">
          <thead className="bg-[#f4f5f6] text-gray-700 select-none">
            <tr>
              <th className="px-6 py-4 font-bold tracking-tight w-[24%]">Lender</th>
              <th className="px-6 py-4 font-bold tracking-tight w-[20%]">Interest Rate (p.a)</th>
              <th className="px-6 py-4 font-bold tracking-tight w-[18%]">Processing Fee</th>
              <th className="px-6 py-4 font-bold tracking-tight w-[16%]">Max Amount</th>
              <th className="px-6 py-4 font-bold tracking-tight w-[14%]">Max Tenure</th>
              <th className="px-6 py-4 font-bold tracking-tight text-center w-[12%]">Action</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100">
            {visibleRows.map((row) => {
              const bankSlug = slugifyProduct(row.name);
              const bankDetailHref = `/banks/${bankSlug}/${page.loanTypeSlug}`;
              const applyHref = getApplyHref({
                category: "loan",
                productSlug: page.loanTypeSlug,
                bankSlug,
                referrer: bankDetailHref,
              });

              return (
                <tr
                  key={row.name}
                  className="transition-colors hover:bg-gray-50/40"
                >
                {/* 1. LENDER LOGO & STAR RATINGS */}
                <td className="px-6 py-4.5">
                  <div className="flex items-center gap-4">
                    <Link
                      href={bankDetailHref}
                      className="block shrink-0 focus:outline-none"
                    >
                      <BankLogoImage
                        src={row.logo}
                        alt={row.name}
                        className="h-8 w-28"
                        imageClassName="object-left"
                      />
                    </Link>
                    <div className="flex items-center gap-0.5 text-xs font-bold text-gray-400 select-none">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="pt-0.5">{row.rating || "4.5"}</span>
                    </div>
                  </div>
                </td>

                {/* 2. SPECIFIC FINANCIAL INFO DETAILS COLUMNS */}
                <td className="px-6 py-4.5 font-medium text-gray-900">
                  {row.rate || "11.49% - 21.00%"}
                </td>
                <td className="px-6 py-4.5 font-medium text-gray-900">
                  {row.fee || "Up to 2.5%"}
                </td>
                <td className="px-6 py-4.5 font-medium text-gray-900">
                  {row.amount || "₹ 40 Lakh"}
                </td>
                <td className="px-6 py-4.5 font-medium text-gray-900">
                  {row.tenure || "60 Months"}
                </td>

                {/* 3. CAPSULE CTA SUBMIT LINK */}
                <td className="px-6 py-4.5 text-center">
                  <AuthRedirectLink
                    href={applyHref}
                    productSlug={page.loanTypeSlug}
                    className="inline-flex h-9 items-center justify-center rounded-full whitespace-nowrap  bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-5 text-xs font-bold text-white transition-colors hover:bg-[#009948] no-underline shadow-sm active:scale-[0.98]"
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
      {bankRows.length > 5 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-sm font-bold text-[#00529b] hover:text-[#00407a] transition-colors group select-none"
          >
            <span>{isExpanded ? "View Less Lenders" : "View more Lenders"}</span>
            <ChevronDown 
              className={`h-4 w-4 text-[#00529b] transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`} 
              strokeWidth={2.5}
            />
          </button>
        </div>
      )}

    </section>
  );
}
