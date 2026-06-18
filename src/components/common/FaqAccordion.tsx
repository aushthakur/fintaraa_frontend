"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

const defaultFaqData = {
  title: "Frequently Asked Questions",
  subtitle: "Everything you need to know about our services",
  items: [
    {
      question: "How long does it take for the loan to be disbursed?",
      answer: "Our automated systems verify details quickly. Typically, loan amounts are approved and disbursed directly into your bank account within a few business hours.",
    },
    {
      question: "Is there a penalty for prepaying the loan?",
      answer: "Prepayment terms depend entirely on the specific product tier selected. Many instances offer completely penalty-free early repayments.",
    },
    {
      question: "Can I apply for a second loan while the first is active?",
      answer: "Yes, you can hold multiple active accounts concurrently provided your monthly debt-to-income margin meets regular lending compliance limits.",
    },
    {
      question: "What is the minimum and maximum loan amount?",
      answer: "Flexible limits scale seamlessly depending on individual documentation records and current calculated repayment credit metrics.",
    },
    {
      question: "Do I need to provide any collateral or security?",
      answer: "No collateral or security assets are required as these profiles remain categorized under signature unsecured lending brackets.",
    },
    {
      question: "Will checking my eligibility affect my CIBIL score?",
      answer: "Checking preliminary parameters via our portal registers an immediate soft pull inquiry indicator which never alters or reduces your point totals.",
    },
    {
      question: "Can I change my EMI date after the loan is disbursed?",
      answer: "Yes, adjustment requests can be requested post-disbursement through support channels prior to upcoming billing cycles.",
    },
    {
      question: "What happens if I miss an EMI payment?",
      answer: "Missing payment dates records default flags onto your profile. Ensure prompt balances to prevent late penalties and potential credit downgrades.",
    },
  ],
};

type FaqAccordionProps = {
  title?: string;
  subtitle?: string;
  items?: FaqItem[];
};

export function FaqAccordion({
  title = defaultFaqData.title,
  subtitle = defaultFaqData.subtitle,
  items = defaultFaqData.items,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* FAQ ACCORDION SECTION */}
      <section className="w-full max-w-9xl mx-auto bg-white px-4 py-16 antialiased text-[#111827] md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* Clean Rounded-Box Stack Layout */}
        <div className="space-y-3.5">
          {items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left px-6 py-4.5 group select-none"
                >
                  <span className="text-sm font-bold tracking-tight text-gray-800 group-hover:text-gray-900 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    strokeWidth={2.5}
                  />
                </button>

                {/* Animated Dropdown Smooth Reveal Container */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 border-t border-gray-50/50" : "max-h-0"
                  } overflow-hidden`}
                >
                  <div className="px-6 py-4 text-xs font-medium text-gray-400 leading-relaxed bg-gray-50/30">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
