import { FaqAccordion } from "@/components/common/FaqAccordion";
import type { LoanSeoFaq } from "@/services/loanSeoPages";

export function LoanFAQSection({
  lookupPathname = "/products/[loanType]",
  faqs,
  title,
}: {
  lookupPathname?: string;
  faqs?: LoanSeoFaq[];
  title?: string;
}) {
  if (faqs?.length) {
    return (
      <section className="bg-white px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-[24px] font-black tracking-tight text-[#07162d]">
            {title || "Frequently Asked Questions"}
          </h2>
          <div className="mt-5 divide-y divide-[#e4edf5] rounded-2xl bg-white">
            {faqs.map((faq, index) => (
              <details key={`${faq.question}-${index}`} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-extrabold text-[#07162d]">
                  {faq.question}
                  <span className="text-[#005ca8] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[13px] font-semibold leading-6 text-[#667085]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <FaqAccordion lookupPathname={lookupPathname} />;
}
