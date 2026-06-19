"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchPageFaq, type PageFaqRecord } from "@/services/pageFaqs";
import { BadgeHelp, CheckCircle2, ChevronDown, CircleHelp } from "lucide-react";

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
      answer:
        "Our automated systems verify details quickly. Typically, loan amounts are approved and disbursed directly into your bank account within a few business hours.",
    },
    {
      question: "Is there a penalty for prepaying the loan?",
      answer:
        "Prepayment terms depend entirely on the specific product tier selected. Many instances offer completely penalty-free early repayments.",
    },
    {
      question: "Can I apply for a second loan while the first is active?",
      answer:
        "Yes, you can hold multiple active accounts concurrently provided your monthly debt-to-income margin meets regular lending compliance limits.",
    },
    {
      question: "What is the minimum and maximum loan amount?",
      answer:
        "Flexible limits scale seamlessly depending on individual documentation records and current calculated repayment credit metrics.",
    },
    {
      question: "Do I need to provide any collateral or security?",
      answer:
        "No collateral or security assets are required as these profiles remain categorized under signature unsecured lending brackets.",
    },
    {
      question: "Will checking my eligibility affect my CIBIL score?",
      answer:
        "Checking preliminary parameters via our portal registers an immediate soft pull inquiry indicator which never alters or reduces your point totals.",
    },
    {
      question: "Can I change my EMI date after the loan is disbursed?",
      answer:
        "Yes, adjustment requests can be requested post-disbursement through support channels prior to upcoming billing cycles.",
    },
    {
      question: "What happens if I miss an EMI payment?",
      answer:
        "Missing payment dates records default flags onto your profile. Ensure prompt balances to prevent late penalties and potential credit downgrades.",
    },
  ],
};

type FaqAccordionProps = {
  title?: string;
  subtitle?: string;
  items?: FaqItem[];
  lookupPathname?: string;
  enableDynamic?: boolean;
};

export function FaqAccordion({
  title = defaultFaqData.title,
  subtitle = defaultFaqData.subtitle,
  items = defaultFaqData.items,
  lookupPathname,
  enableDynamic = true,
}: FaqAccordionProps) {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [pageFaq, setPageFaq] = useState<PageFaqRecord | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (!enableDynamic) return;
    let active = true;
    fetchPageFaq(lookupPathname || pathname || "/")
      .then((result) => {
        if (active) setPageFaq(result);
      })
      .catch(() => {
        if (active) setPageFaq(null);
      });
    return () => {
      active = false;
    };
  }, [enableDynamic, lookupPathname, pathname]);

  const resolvedItems = useMemo(
    () => (pageFaq?.items?.length ? pageFaq.items : items),
    [items, pageFaq],
  );
  const resolvedSchema = pageFaq?.schemaJson;

  return (
    <>
      {resolvedSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(resolvedSchema).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}
      <section className="mx-auto w-full max-w-5xl px-4 py-14 text-[#111827] antialiased md:px-6 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eef7ff] px-4 py-2 text-[12px] font-black uppercase tracking-[0.16em] text-[#005ca8]">
            <BadgeHelp className="h-4 w-4" strokeWidth={2.4} />
            Help Center
          </span>
          <h2 className="mt-5 text-[28px] font-black tracking-[-0.02em] text-[#111827] md:text-[36px]">
            {pageFaq?.title || title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] font-semibold leading-7 text-[#667085] md:text-base">
            {pageFaq?.subtitle || subtitle}
          </p>
        </div>

        <div className="mt-10 divide-y divide-[#e5edf6]">
          {resolvedItems.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={`${faq.question}-${index}`} className="group">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full select-none items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen
                          ? "bg-[#e8f8ef] text-[#13a653]"
                          : "bg-[#eef7ff] text-[#005ca8] group-hover:bg-[#dceeff]"
                      }`}
                    >
                      {isOpen ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <CircleHelp className="h-5 w-5" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-black leading-6 text-[#172033] transition-colors group-hover:text-[#005ca8] md:text-[16px]">
                        {faq.question}
                      </span>
                      <span className="mt-1 block text-[12px] font-bold uppercase tracking-[0.14em] text-[#98a2b3]">
                        Question {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f8fbff] text-[#005ca8] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={2.6} />
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="pb-5 pl-13 text-[14px] font-semibold leading-7 text-[#667085] md:text-[15px]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
