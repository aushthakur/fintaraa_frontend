import { FaqAccordion } from "@/components/common/FaqAccordion";

export function LoanFAQSection({ lookupPathname = "/products/[loanType]" }: { lookupPathname?: string }) {
  return <FaqAccordion lookupPathname={lookupPathname} />;
}
