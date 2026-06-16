import { ChevronDown } from "lucide-react";
import { dsaFaqs } from "./dsaData";

const faqAnswers: Record<string, string> = {
  "How long does it take for the loan to be disbursed?":
    "Typically, personal loans are disbursed within 24 to 72 hours after successful verification and document approval by our lending partners.",
  "Is there a penalty for prepaying the loan?":
    "Prepayment rules and penalties vary depending on the lender. Some banks allow zero-penalty prepayments after a specific lock-in period (e.g., 6-12 months), while others may charge a fee ranging from 2% to 5% of the outstanding principal.",
  "Can I apply for a second loan while the first is active?":
    "Yes, you can apply for a second loan if your income-to-debt ratio supports it and you have a strong repayment history on your active loan. Lending partners will evaluate your credit profile accordingly.",
  "What is the minimum and maximum loan amount?":
    "The minimum loan amount starts from ₹10,000, and the maximum loan amount can go up to ₹40 Lakhs or more, depending on your eligibility, employment type, and financial profile.",
  "Do I need to provide any collateral or security?":
    "No, personal loans are unsecured loans, meaning you do not need to provide any collateral, security, or guarantor to get approved.",
  "Will checking my eligibility affect my CIBIL score?":
    "Checking your initial loan eligibility through a soft query on Fintaraa does not affect your credit score. However, a formal loan application will result in a hard credit inquiry, which may temporarily affect your score by a few points.",
  "Can I change my EMI date after the loan is disbursed?":
    "Yes, some lenders allow you to change your EMI payment date by submitting a formal request, though it may involve a minor administrative fee and adjustments to interest calculations for that month.",
  "What happens if I miss an EMI payment?":
    "Missing an EMI payment will result in late payment charges, bounce fees, and a negative impact on your CIBIL score. We highly recommend maintaining sufficient balance for auto-debit to avoid this.",
};

export function DsaFaq() {
  return (
    <section className="px-4 py-14 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-[34px] font-black tracking-[-0.02em] text-[#2a2f36]">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-[13px] font-semibold text-[#667085]">
          Everything you need to know about our personal loans.
        </p>
        <div className="mt-10 grid gap-4 text-left">
          {dsaFaqs.map((question) => (
            <details
              key={question}
              className="group rounded-xl border border-[#e4eaf2] bg-white px-5 py-4 shadow-[0_5px_15px_rgba(16,24,40,0.04)] transition-all duration-300 open:shadow-[0_8px_25px_rgba(16,24,40,0.08)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-black text-[#2a2f36] select-none">
                {question}
                <ChevronDown className="h-4 w-4 shrink-0 text-[#667085] transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[12px] font-semibold leading-6 text-[#667085] transition-all duration-300">
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
