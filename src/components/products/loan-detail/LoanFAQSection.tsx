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
      <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        {faqs.map((faq, index) => (
          <details
            key={`${faq.question}-${index}`}
            className="group p-4 sm:p-5 transition-colors hover:bg-slate-50/40"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm sm:text-[15px] font-bold text-slate-900 marker:content-none transition-colors group-hover:text-[#5b21b6]">
              {faq.question}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-50 text-[#5b21b6] text-sm font-bold border border-purple-100/70 transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="mt-3 rounded-xl bg-purple-50/30 p-3.5 border border-purple-100/40">
              <p className="text-xs sm:text-[13.5px] font-medium leading-relaxed text-slate-600">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    );

    if (embedded) return content;

    return (
      <section className="bg-white px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3.5 py-1 text-xs font-bold text-[#5b21b6] border border-purple-100 mb-2">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {title || "Frequently Asked Questions"}
            </h2>
          </div>
          <div>{content}</div>
        </div>
      </section>
    );
  }

  return <FaqAccordion lookupPathname={lookupPathname} />;
}
