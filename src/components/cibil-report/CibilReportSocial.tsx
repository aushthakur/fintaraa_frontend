"use client";

import { ChevronDown } from "lucide-react";
import { FaqAccordion } from "@/components/common/FaqAccordion";

const searchLinks = [
  "Business Loan", "Home Loan", "Car Loan", "Wedding Loan", "Loan for Doctor",
  "Loan Against Property", "Loan for CA,s", "Business Loan", "Business Loan", "Business Loan",
  "Business Loan In Delhi", "Car Loan In Delhi", "Business Loan", "Business Loan", "Business Loan",
  "Business Loan", "Business Loan", "Business Loan", "Business Loan", "Business Loan",
  "Business Loan", "Home Loan", "Car Loan", "Wedding Loan Delhi", "Loan for Doctor Delhi",
  "Loan Against Property Delhi", "Loan for CA, s In Delhi", "Business Loan", "Business Loan", "Business Loan",
  "Business Loan", "Business Loan", "Business Loan", "Business Loan", "Business Loan",
  "Business Loan", "Business Loan", "Business Loan", "Business Loan", "Business Loan"
];

export function CibilReportSocial() {
  return (
    <>
      <FaqAccordion
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about our personal loans"
      />

      {/* FOOTER: SEO SEARCH LINKS BANNER */}
      <section className="w-full bg-white antialiased">
        {/* Deep blue menu anchor header row */}
        <div className="w-full bg-[#004B93] py-4.5 flex items-center justify-center gap-3 text-white select-none">
          <h3 className="text-lg font-bold tracking-tight">Most Search Links</h3>
          <ChevronDown className="h-5 w-5 text-white" strokeWidth={3} />
        </div>

        {/* Dynamic wrapping inline flex tracking grid links block */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-xs font-bold text-gray-900 text-center">
            {searchLinks.map((link, idx) => (
              <span
                key={idx}
                className="cursor-pointer hover:text-[#004B93] transition-colors whitespace-nowrap"
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}