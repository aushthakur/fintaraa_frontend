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
      <div className="divide-y divide-[#e2eaf0] overflow-hidden rounded-2xl border border-[#dce7ef] bg-white">
        {faqs.map((faq, index) => (
          <details
            key={`${faq.question}-${index}`}
            className="group px-4 py-4 sm:px-5"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-extrabold text-[#17354d] marker:content-none sm:text-[14px]">
              {faq.question}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf5fb] text-[#075cde] transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[12px] font-medium leading-6 text-[#657d90] sm:text-[13px]">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    );

    if (embedded) return content;

    return (
      <section className="bg-white px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[24px] font-extrabold tracking-tight text-[#07162d]">
            {title || "Frequently Asked Questions"}
          </h2>
          <div className="mt-5">{content}</div>
        </div>
      </section>
    );
  }

  return <FaqAccordion lookupPathname={lookupPathname} />;
}
