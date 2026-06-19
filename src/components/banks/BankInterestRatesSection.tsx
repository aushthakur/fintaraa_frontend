"use client";

import Link from "next/link";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import {
  Banknote,
  Building2,
  ArrowRight,
  CreditCard,
  BadgeIndianRupee,
} from "lucide-react";
import type { BankSeoPageData } from "@/services/bankSeoPages";

const productIcons = [BadgeIndianRupee, Banknote, Building2, CreditCard];

export function BankInterestRatesSection({ page }: { page: BankSeoPageData }) {
  const applyHref = getApplyHref({
    category: "loan",
    bankSlug: page.bankSlug,
    productSlug: page.productSlug || "loan",
    referrer:
      page.canonicalPath || `/banks/${page.bankSlug}/${page.productSlug}`,
  });
  const products = (page.products || [])
    .filter((product) => product.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const rates =
    page.interestRates && page.interestRates.length > 0
      ? [...page.interestRates].sort(
          (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
        )
      : Array(4).fill({
          loanAmount: "Up to ₹5 Lakh",
          interestRate: "10.50% onwards",
          processingFee: "Up to 2.50%",
          tenure: "12 - 60 Months",
        });

  return (
    <div className="bg-white space-y-12 py-10 font-sans antialiased">
      {/* SECTION 1: Product Grid Deck */}
      <section className="px-4 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-[22px] font-black text-[#000000] tracking-tight mb-6">
            Loans & Products Offered by {page.bankName || "HDFC Bank"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(products.length > 0
              ? products
              : [
                  {
                    title: "Personal Loan",
                    description:
                      "Loan up to ₹40 Lakh\nInterest from 10.50% p.a.",
                  },
                  {
                    title: "Home Loan",
                    description: "Loan up to ₹10 Cr\nInterest from 8.40% p.a.",
                  },
                  {
                    title: "Business Loan",
                    description: "Loan up to ₹1 Cr\nInterest from 11.25% p.a.",
                  },
                  {
                    title: "Credit Card",
                    description: "Lifetime Free Cards\nExclusive Rewards",
                  },
                ]
            ).map((product, index) => {
              const Icon = productIcons[index % productIcons.length];
              return (
                <article
                  key={product.title}
                  className="rounded-2xl border border-[#e3ebf3] bg-white p-5 flex flex-col justify-between shadow-[0_4px_12px_rgba(22,34,50,0.02)] hover:shadow-sm transition-shadow min-h-40"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf4fd] text-[#005ca8]">
                      <Icon className="h-6 w-6 stroke-[1.75]" />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#000000]">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-[12px] font-medium leading-normal text-[#93989f] whitespace-pre-line">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  {product.href ? (
                    <Link
                      href={product.href}
                      className="mt-4 inline-flex items-center justify-center gap-1 text-[12px] font-bold text-[#13a653] hover:underline self-center w-full pt-2 border-t border-[#f7fafc]"
                    >
                      <span>{product.ctaLabel || "Apply Now"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <AuthRedirectLink
                      href={applyHref}
                      productSlug={page.productSlug || "loan"}
                      className="mt-4 inline-flex items-center justify-center gap-1 text-[12px] font-bold text-[#13a653] hover:underline self-center w-full pt-2 border-t border-[#f7fafc]"
                    >
                      <span>{product.ctaLabel || "Apply Now"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </AuthRedirectLink>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: Master Grid Container */}
      <section className="px-4 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-2xl border border-[#e3ebf3] bg-white p-6 md:p-8 shadow-[0_4px_16px_rgba(22,34,50,0.02)] grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Left Block: Table Data Sheet */}
          <div className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#000000] tracking-tight">
              {page.bankName || "HDFC"} {page.productName || "Personal Loan"}{" "}
              Interest Rates
            </h2>
            <div className="overflow-x-auto rounded-xl border border-[#e3ebf3]">
              <table className="w-full min-w-140 border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#e3ebf3]">
                    {[
                      "Loan Amount",
                      "Interest Rate (p.a.)",
                      "Processing Fee",
                      "Loan Tenure",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3.5 font-bold text-[#2d3142] bg-[#fdfeff]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef2f6]">
                  {rates.map((rate, index) => (
                    <tr key={index} className="hover:bg-[#fafcfe]">
                      <td className="px-4 py-4 font-medium text-[#93989f]">
                        {rate.loanAmount}
                      </td>
                      <td className="px-4 py-4 font-medium text-[#93989f]">
                        {rate.interestRate}
                      </td>
                      <td className="px-4 py-4 font-medium text-[#93989f]">
                        {rate.processingFee}
                      </td>
                      <td className="px-4 py-4 font-medium text-[#93989f]">
                        {rate.tenure}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Block: Sidebar CTA Card Panel */}
          <aside className="rounded-2xl bg-[#eef5ff] p-5 flex flex-col justify-between border border-[#dce9f7]">
            <div className="space-y-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#000000] tracking-tight">
                  Ready to Apply?
                </h3>
                <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#7a869a]">
                  Get the best loan offer from {page.bankName || "HDFC Bank"} in
                  just a few minutes.
                </p>
              </div>

              {/* Checklist Lines Component */}
              <div className="space-y-3">
                {(page.applyBullets && page.applyBullets.length > 0
                  ? page.applyBullets
                  : ["Minimal Documentation", "Quick Disbursal"]
                ).map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-[13px] font-medium text-[#7a869a]"
                  >
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#005ca8] bg-white text-[#005ca8]">
                      <span className="text-[8px] font-bold">✓</span>
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <AuthRedirectLink
              href={applyHref}
              productSlug={page.productSlug || "loan"}
              className="mt-6 flex h-11 w-full items-center justify-center rounded-2xl bg-[#13a653] hover:bg-[#108e46] text-[14px] font-bold text-white no-underline transition-colors shadow-xs"
            >
              Apply Now
            </AuthRedirectLink>
          </aside>
        </div>
      </section>
    </div>
  );
}
