"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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

export function InsuranceEligibilityDocuments() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#d2e7fa] px-6 py-14 antialiased text-[#111827] md:px-12 lg:px-16">
      <div className="mx-auto grid max-w-9xl gap-8 md:grid-cols-2 items-stretch">
        
        {/* LEFT CARD: ELIGIBILITY CRITERIA */}
        <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 leading-none">
              Eligibility Criteria
            </h2>
            
            {/* Structured row layout mimicking the split key-value alignment */}
            <div className="mt-8 space-y-3">
              {eligibilityCriteria.map((item) => (
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

        {/* RIGHT CARD: REQUIRED DOCUMENTS ACCORDION MATRIX */}
        <div className="bg-white rounded-lg p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 leading-none mb-4">
              Required Documents
            </h2>
            
            <div className="divide-y divide-gray-100 mt-4">
              {requiredDocumentsFaq.map((item, index) => {
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

      </div>
    </section>
  );
}