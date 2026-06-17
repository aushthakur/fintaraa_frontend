import { ChevronDown } from "lucide-react";
import { dsaFaqs } from "./dsaData";

const faqAnswers: Record<string, string> = {
  "How long does it take for the loan to be disbursed?":
    "Timelines vary by lender, but many approvals are completed within 24 to 72 hours after verification.",
  "Is there a penalty for prepaying the loan?":
    "Prepayment rules depend on the lender. Any applicable charges are shared before the application moves forward.",
  "Can I apply for a second loan while the first is active?":
    "Yes, if your income profile and existing obligations support another application under lender criteria.",
  "What is the minimum and maximum loan amount?":
    "Loan amount depends on product type, eligibility and the partner bank or NBFC policy.",
  "Do I need to provide any collateral or security?":
    "Most partner products are unsecured, but the final requirement depends on the selected lender and loan type.",
  "Will checking my eligibility affect my CIBIL score?":
    "An initial eligibility check generally uses a soft inquiry and should not impact your score.",
  "Can I change my EMI date after the loan is disbursed?":
    "Some lenders allow EMI date changes after disbursement, subject to their servicing rules.",
  "What happens if I miss an EMI payment?":
    "Missed EMIs can attract penalty charges and may impact your credit profile, so timely repayment matters.",
};

export function DsaFaq() {
  return (
    <section className="px-4 py-14 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-[32px] font-extrabold tracking-[-0.04em] text-[#33393f] md:text-[38px]">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-[13px] font-medium text-[#8b95a5]">
          Everything you need to know about our personal loans.
        </p>

        <div className="mt-10 grid gap-4 text-left">
          {dsaFaqs.map((question) => (
            <details
              key={question}
              className="group rounded-[16px] border border-[#e4eaf2] bg-white px-5 py-4 shadow-[0_8px_22px_rgba(16,24,40,0.04)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-extrabold text-[#22272e] select-none">
                {question}
                <ChevronDown className="h-4 w-4 shrink-0 text-[#8b95a5] transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[12px] font-medium leading-6 text-[#6f7681]">
                {faqAnswers[question] ||
                  "Our support team is happy to assist you with any questions."}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
