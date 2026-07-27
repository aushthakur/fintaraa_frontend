"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { InsuranceSeoTab } from "@/services/insuranceSeoPages";

const eligibilityCriteria = [
  { label: "Entry Age (Adults)", value: "18 to 65 Years old  (can vary by plan )" },
  { label: "Entry Age (Child)", value: "90 Days to 25" },
  { label: "Work Experience", value: "Min 1 year total , 6 months in current firm" },
  { label: "Credit Score", value: "CIBIL Score of 750 or above preferred" },
  { label: "Residency", value: "Must be a legal Citizen / permanent resident" },
];

const requiredDocumentsFaq = [
  {
    question: "How to Improve CIBIL Score",
    answer: "Pay all EMIs on time, maintain low credit card utilization ratios (under 30%), correct errors on your credit report promptly, and avoid submitting multiple loan inquiries sequentially.",
  },
  {
    question: "Top 10 ways to Boost Your Credit Score",
    answer: "1. Timely repayments. 2. Limit new inquiries. 3. Diversify credit mix. 4. Maintain old accounts. 5. Monitor co-signed loans. 6. Dispute reporting errors. 7. Avoid over-utilization.",
  },
  {
    question: "How often should I check",
    answer: "It is recommended to check your credit score at least once every month to catch any reporting inconsistencies early and ensure your tracking milestones are up to date.",
  },
  {
    question: "What is a good CIBIL Score",
    answer: "A CIBIL score between 750 and 900 is considered excellent. This gives lenders high confidence and makes you eligible for fast tracking approvals and optimal interest rates.",
  },
];

export function InsuranceEligibilityDocuments({
  tab,
  mode = "all",
  embedded = false,
}: {
  tab?: InsuranceSeoTab;
  mode?: "all" | "eligibility" | "documents";
  embedded?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const criteria = tab?.bullets?.length
    ? tab.bullets.map((item, index) => ({
        label: `Criteria ${index + 1}`,
        value: item,
      }))
    : eligibilityCriteria;
  const documents = tab?.bullets?.length
    ? tab.bullets.map((item, index) => ({
        question: `Document ${index + 1}`,
        answer: item,
      }))
    : tab?.faqs?.length
      ? tab.faqs
      : requiredDocumentsFaq;
  const showEligibility = mode === "all" || mode === "eligibility";
  const showDocuments = mode === "all" || mode === "documents";

  return (
    <section
      id={mode === "documents" ? "insurance-documents" : undefined}
      style={{
        scrollMarginTop:
          "calc(var(--site-header-height, 8.25rem) + 5.5rem)",
      }}
      className={`antialiased text-[#111827] ${
        embedded
          ? ""
          : "bg-[#d2e7fa] px-6 py-14 md:px-12 lg:px-16"
      }`}
    >
      <div className={`mx-auto grid max-w-9xl gap-8 items-stretch ${mode === "all" ? "md:grid-cols-2" : ""}`}>
        
        {/* LEFT CARD: ELIGIBILITY CRITERIA */}
        {showEligibility ? (
        <div className="flex flex-col justify-between rounded-2xl border border-[#dfe8ef] bg-white p-5 sm:p-6">
          <div>
            {!embedded ? (
              <>
                <h2 className="text-2xl font-bold leading-none tracking-tight text-gray-900">
                  {mode === "eligibility" && tab?.title
                    ? tab.title
                    : "Eligibility Criteria"}
                </h2>
                {mode === "eligibility" && tab?.description ? (
                  <p className="mt-3 text-[13px] font-semibold leading-6 text-gray-500">
                    {tab.description}
                  </p>
                ) : null}
              </>
            ) : null}
            
            {/* Structured row layout mimicking the split key-value alignment */}
            <div className={`${embedded ? "" : "mt-8"} space-y-3`}>
              {criteria.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#f4f8fc] rounded-lg px-5 py-4 text-xs font-semibold text-gray-700"
                >
                  <span className="font-bold text-gray-900 min-w-37.5 shrink-0">
                    {item.label}
                  </span>
                  <span className="text-gray-500 leading-normal sm:text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        ) : null}

        {/* RIGHT CARD: REQUIRED DOCUMENTS ACCORDION MATRIX */}
        {showDocuments ? (
        <div className="flex flex-col justify-between rounded-2xl border border-[#dfe8ef] bg-white p-5 sm:p-6">
          <div>
            {!embedded ? (
              <>
                <h2 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900">
                  {mode === "documents" && tab?.title
                    ? tab.title
                    : "Required Documents"}
                </h2>
                {mode === "documents" && tab?.description ? (
                  <p className="mb-4 text-[13px] font-semibold leading-6 text-gray-500">
                    {tab.description}
                  </p>
                ) : null}
              </>
            ) : null}
            
            <div className="divide-y divide-gray-100 mt-4">
              {documents.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="py-2 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left py-3.5 select-none group"
                    >
                      <span className="text-[14px] font-bold text-[#00529b] transition-colors group-hover:text-[#00407a]">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-[#00529b] shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        strokeWidth={2.5}
                      />
                    </button>

                    {/* Smooth dynamic dropdown container */}
                    <div
                      className={`transition-all duration-200 ease-in-out ${
                        isOpen ? "max-h-32 pb-4 pt-1" : "max-h-0"
                      } overflow-hidden`}
                    >
                      <p className="text-xs font-medium text-gray-400 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        ) : null}

      </div>
    </section>
  );
}
