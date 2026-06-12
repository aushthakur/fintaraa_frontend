import { ChevronDown } from "lucide-react";
import { franchiseFaqs } from "./franchiseData";

export function FranchiseFaq() {
  return (
    <section className="px-4 py-14 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-[34px] font-black tracking-[-0.02em] text-[#2a2f36]">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-[13px] font-semibold text-[#667085]">
          Everything you need to know about our franchise opportunity.
        </p>

        <div className="mt-10 grid gap-4 text-left">
          {franchiseFaqs.map((question) => (
            <details
              key={question}
              className="rounded-xl border border-[#e4eaf2] bg-white px-5 py-4 shadow-[0_5px_15px_rgba(16,24,40,0.04)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-black text-[#2a2f36]">
                {question}
                <ChevronDown className="h-4 w-4 shrink-0" />
              </summary>
              <p className="mt-3 text-[12px] font-semibold leading-6 text-[#667085]">
                Our franchise team will share the latest commercial terms,
                onboarding requirements and operating process during the
                consultation.
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
