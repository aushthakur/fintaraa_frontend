"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { franchiseFaqs } from "./franchiseData";

export function FranchiseFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-4 py-14 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-[32px] font-black tracking-[-0.02em] text-[#2a2f36]">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-[13px] font-semibold text-[#667085]">
          Everything you need to know about our personal loans
        </p>

        <div className="mt-10 grid gap-3 text-left">
          {franchiseFaqs.map((question, index) => (
            <div
              key={question}
              className="rounded-xl border border-[#e4eaf2] bg-white shadow-[0_5px_15px_rgba(16,24,40,0.04)]"
            >
              <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[13px] font-black text-[#2a2f36]"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              >
                {question}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-4">
                  <p className="text-[12px] font-semibold leading-6 text-[#667085]">
                    Our franchise team will share the latest commercial terms,
                    onboarding requirements and operating process during the
                    consultation. Please fill the form above and we will get
                    back to you within 24 hours.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}