import { FaqAccordion } from "@/components/common/FaqAccordion";
import type { LoanSeoFaq } from "@/services/loanSeoPages";

export function LoanFAQSection({
  lookupPathname = "/products/[loanType]",
  faqs,
  title,
  embedded = false,
}: {
  lookupPathname?: string;
  faqs?: LoanSeoFaq[];
  title?: string;
  embedded?: boolean;
}) {
  if (faqs?.length) {
    const content = (
      <div className="divide-y divide-slate-200">
        {faqs.map((faq, index) => (
          <details
            key={`${faq.question}-${index}`}
            className="group py-5 transition-colors"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base sm:text-lg font-normal text-slate-900 marker:content-none transition-colors group-hover:text-[#5b21b6]">
              <span>{faq.question}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-[#5b21b6] text-base font-normal transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="mt-3 pr-12">
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    );

    if (embedded) return content;

    return (
      <section
        id="faqs"
        style={{
          scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
        }}
        className="w-full max-w-7xl mx-auto px-4 py-16 antialiased text-slate-900 md:px-6 lg:px-8 border-b border-slate-100 font-normal"
      >
        <div className="max-w-3xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-slate-900">
            {title || "Frequently Asked Questions"}
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
            Clear answers to common questions about personal loan eligibility, interest rates, documentation, and disbursement timelines.
          </p>
        </div>
        <div>{content}</div>
      </section>
    );
  }

  return (
    <section
      id="faqs"
      style={{
        scrollMarginTop: "calc(var(--site-header-height, 8.25rem) + 4.5rem)",
      }}
      className="w-full max-w-7xl mx-auto px-4 py-16 antialiased text-slate-900 md:px-6 lg:px-8 border-b border-slate-100"
    >
      <FaqAccordion lookupPathname={lookupPathname} />
    </section>
  );
}
