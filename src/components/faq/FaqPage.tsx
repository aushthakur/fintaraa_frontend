"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  ChevronDown,
  CircleHelp,
  CreditCard,
  FileCheck2,
  HandCoins,
  ShieldCheck,
} from "lucide-react";

type FaqItem = { question: string; answer: string };
type FaqCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: FaqItem[];
};

const faqCategories: FaqCategory[] = [
  {
    id: "general",
    label: "General",
    icon: CircleHelp,
    items: [
      {
        question: "What is Fintaraa?",
        answer:
          "Fintaraa is a financial-services marketplace and assistance platform where users can explore loans, credit cards, insurance and selected business services from available partners.",
      },
      {
        question: "Is Fintaraa a bank or lender?",
        answer:
          "No. Fintaraa helps users discover and apply for products, while approval, pricing, disbursal and servicing decisions remain with the relevant bank, NBFC, insurer or service partner.",
      },
      {
        question: "Do I need an account to browse the website?",
        answer:
          "No. Most products, guides and public service pages can be viewed without signing in. An account may be required for saved applications or personalised account features.",
      },
      {
        question: "How can I contact Fintaraa?",
        answer:
          "Use the Contact Us or Support page, call the published customer-care number, or email customercare@fintaraa.com.",
      },
    ],
  },
  {
    id: "loans",
    label: "Loans",
    icon: HandCoins,
    items: [
      {
        question: "How is loan eligibility decided?",
        answer:
          "The lender evaluates factors such as income, employment or business profile, repayment obligations, credit history, age, location and its current product policy.",
      },
      {
        question: "Which documents are generally required?",
        answer:
          "Common requirements include identity, address, income and bank records. The exact checklist changes by loan type, applicant profile and lender.",
      },
      {
        question: "Does submitting an application guarantee approval?",
        answer:
          "No. An application or eligibility result is not a sanction. The lender completes verification and underwriting before making the final decision.",
      },
      {
        question: "How can I compare the total cost of a loan?",
        answer:
          "Compare the interest rate, processing and other charges, repayment period, EMI, foreclosure terms and the lender's key fact statement or sanction terms.",
      },
    ],
  },
  {
    id: "credit-cards",
    label: "Credit Cards",
    icon: CreditCard,
    items: [
      {
        question: "How do I choose a credit card?",
        answer:
          "Match the card's annual fee, reward structure, eligible spends, lounge or travel benefits and other charges with how you actually plan to use it.",
      },
      {
        question: "Who decides my credit limit?",
        answer:
          "The issuing bank decides approval and limit after reviewing its internal policy, income, existing obligations and credit profile.",
      },
      {
        question: "Will I receive every advertised benefit?",
        answer:
          "Benefits can have merchant, spend, date, channel and redemption conditions. Review the issuer's current terms before applying or transacting.",
      },
      {
        question: "Can I track my card application through Fintaraa?",
        answer:
          "Use the Application Status page where tracking is available. Some issuer-led stages may also require checking the bank's official status channel.",
      },
    ],
  },
  {
    id: "insurance",
    label: "Insurance",
    icon: ShieldCheck,
    items: [
      {
        question: "What should I compare before buying insurance?",
        answer:
          "Review coverage, exclusions, waiting periods, deductibles, sub-limits, premium, claim process and the complete policy wording—not premium alone.",
      },
      {
        question: "Who issues and services the policy?",
        answer:
          "The selected insurer issues the policy and remains responsible for underwriting and claims. Fintaraa or its partners may assist during the journey.",
      },
      {
        question: "Is every claim automatically approved?",
        answer:
          "No. The insurer assesses each claim against policy coverage, disclosures, evidence, exclusions and applicable terms.",
      },
      {
        question: "Where should I check final policy details?",
        answer:
          "Use the insurer-issued policy schedule, policy wording and official communication as the final record of coverage and conditions.",
      },
    ],
  },
  {
    id: "applications",
    label: "Applications & Support",
    icon: FileCheck2,
    items: [
      {
        question: "How can I track a submitted application?",
        answer:
          "Open Application Status and enter the requested mobile number or application reference. Service pages may also provide their own query-ID tracker.",
      },
      {
        question: "What should I do if my status has not changed?",
        answer:
          "Confirm that the correct mobile number or reference was used, then contact Support with the application ID and any pending-document details.",
      },
      {
        question: "How do I report a complaint?",
        answer:
          "Raise it through Support or the Grievance Redressal page and include your registered details, reference ID and relevant evidence. Never share an OTP or full card credentials.",
      },
      {
        question: "How can I request account deletion?",
        answer:
          "Use the Delete Account page. Some records may still be retained where legal, regulatory, audit, fraud-prevention or dispute requirements apply.",
      },
    ],
  },
  {
    id: "business-services",
    label: "Business Services",
    icon: Building2,
    items: [
      {
        question: "Which business services are available?",
        answer:
          "Public service pages currently cover GST, ITR, company formation, MSME/Udyam, annual and tax compliance, and project-report assistance.",
      },
      {
        question: "Is login required to request these services?",
        answer:
          "No. You can submit the public inquiry form directly and use the generated mobile number or query ID to track the request.",
      },
      {
        question: "Does Fintaraa replace a government portal?",
        answer:
          "No. Fintaraa provides optional assistance. Registrations and filings remain subject to the relevant official portal, authority and applicable rules.",
      },
      {
        question: "Are government fees included in an assistance quote?",
        answer:
          "Check the written scope carefully. Professional assistance, government fees, stamp duty, certification and third-party charges should be identified separately where applicable.",
      },
    ],
  },
];

export function FaqPage() {
  const [activeId, setActiveId] = useState(faqCategories[0].id);
  const activeCategory =
    faqCategories.find((category) => category.id === activeId) ||
    faqCategories[0];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    ),
  };

  return (
    <main className="bg-white px-4 py-10 md:px-6 md:py-12 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <section className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#075cde]">
            Help Center
          </p>
          <h1 className="mt-3 text-[34px] font-extrabold tracking-[-0.03em] text-[#102c45] sm:text-[42px] md:text-[48px]">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] font-medium leading-7 text-[#657b8e] md:text-[15px]">
            Select a category to find clear answers about Fintaraa products and
            services.
          </p>
        </div>

        <div
          className="mt-8 flex items-center gap-2 overflow-x-auto border-b border-[#dfe8ef] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="FAQ categories"
        >
          {faqCategories.map((category) => {
            const Icon = category.icon;
            const selected = category.id === activeCategory.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(category.id)}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[12px] font-extrabold transition ${
                  selected
                    ? "bg-[#075cde] text-white"
                    : "border border-[#d7e3ec] bg-white text-[#52687c] hover:border-[#9dbbd1] hover:text-[#075cde]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="mt-7" key={activeCategory.id} role="tabpanel">
          <h2 className="text-[20px] font-extrabold text-[#17354d] md:text-[23px]">
            {activeCategory.label}
          </h2>
          <div className="mt-3 divide-y divide-[#e1e9ef] border-y border-[#e1e9ef]">
            {activeCategory.items.map((item, index) => (
              <details key={item.question} className="group" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[14px] font-extrabold leading-6 text-[#172f45] marker:content-none sm:text-[15px]">
                  {item.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef6fc] text-[#075cde] transition group-open:rotate-180">
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </summary>
                <p className="max-w-4xl pb-5 pr-10 text-[13px] font-medium leading-7 text-[#657b8e] sm:text-[14px]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
