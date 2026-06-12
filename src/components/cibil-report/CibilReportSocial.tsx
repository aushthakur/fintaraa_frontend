import { UserRound } from "lucide-react";
import { testimonials } from "@/data/homePage";

const links = [
  "Cibil score",
  "Personal loan",
  "Car loan",
  "Home loan",
  "Credit card",
  "Business loan",
  "Credit report",
  "Loan eligibility",
  "Instant loan",
  "Low interest loan",
];

export function CibilReportSocial() {
  return (
    <>
      <section className="px-4 py-12 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-[28px] font-black text-[#111827]">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-[13px] font-semibold text-[#667085]">
            Everything you need to know about personal loans.
          </p>
          <div className="mt-8 grid gap-3 text-left">
            {[
              "How long does it take for the loan to be disbursed?",
              "Is there a penalty for prepaying the loan?",
              "Can I apply for a second loan while the first is active?",
              "What is the minimum and maximum loan amount?",
              "Will checking my eligibility affect my CIBIL score?",
            ].map((question) => (
              <details key={question} className="rounded-xl border border-[#e5eaf0] bg-white px-5 py-4">
                <summary className="cursor-pointer list-none text-[13px] font-black">
                  {question}
                </summary>
                <p className="mt-3 text-[12px] font-medium leading-6 text-[#667085]">
                  Our team will help verify the latest lender requirement.
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl text-center">
          <h2 className="text-[22px] font-black text-[#111827]">
            What Our Clients Say
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((item) => (
              <article key={item.name} className="border-t border-[#d7dfe8] p-5 text-left">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f4ff] text-[#005ca8]">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-black">{item.name}</span>
                    <span className="text-[11px] font-semibold text-[#667085]">
                      {item.role}
                    </span>
                  </span>
                </div>
                <p className="mt-4 line-clamp-4 text-[12px] font-medium leading-6 text-[#475467]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#005ca8] px-4 py-8 text-white md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl text-center">
          <h2 className="text-[22px] font-black">Most Search Links</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[12px] font-semibold">
            {[...links, ...links].map((link, index) => (
              <span key={`${link}-${index}`}>{link}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
