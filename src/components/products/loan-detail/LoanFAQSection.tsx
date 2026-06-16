import { FaqAccordion } from "@/components/common/FaqAccordion";
import type { FaqItem } from "@/components/common/FaqAccordion";
import { defaultFaqs } from "./LoanDetailConstants";
import type { LoanSeoFaq } from "@/services/loanSeoPages";

export function LoanFAQSection({
  loanType,
  faqs,
}: {
  loanType: string;
  faqs: LoanSeoFaq[];
}) {
  const displayFaqs: FaqItem[] = faqs.length
    ? faqs
    : defaultFaqs.map((question) => ({
        question,
        answer:
          "Our team will help you verify the latest lender-specific requirement during application.",
      }));

  return (
    <FaqAccordion
      title="Frequently Asked Questions"
      subtitle={`Everything you need to know about our ${loanType}.`}
      items={displayFaqs}
    />
  );
}
