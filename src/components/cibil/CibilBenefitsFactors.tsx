import { BadgeCheck, ChartNoAxesCombined, CreditCard, Landmark, WalletCards } from "lucide-react";

const benefits = [
  {
    title: "Know Your Credit Health",
    text: "Understand your credit worthiness.",
    icon: CreditCard,
  },
  {
    title: "Better Loan Eligibility",
    text: "Improve chances of approval.",
    icon: Landmark,
  },
  {
    title: "Higher Credit Limits",
    text: "Get access to better offers.",
    icon: WalletCards,
  },
  {
    title: "Financial Planning",
    text: "Plan your finances better.",
    icon: ChartNoAxesCombined,
  },
];

const factors = [
  "Payment History",
  "Credit Utilization",
  "Credit Age",
  "Credit Mix",
  "Credit Enquiries",
];

export function CibilBenefitsFactors() {
  return (
    <>
      <section className="bg-[#005ca8] px-4 py-12 text-white md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <h2 className="text-[30px] font-black">Why Check Your CIBIL Score?</h2>
          <p className="mt-2 max-w-xl text-[13px] font-semibold text-white/80">
            Checking your score regularly helps you stay financially ready and
            loan-ready.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {benefits.map(({ title, text, icon: Icon }) => (
              <article key={title} className="bg-white p-6 text-[#111827]">
                <Icon className="h-7 w-7 text-[#005ca8]" />
                <h3 className="mt-8 text-[16px] font-black">{title}</h3>
                <p className="mt-3 text-[12px] font-medium leading-5 text-[#475467]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <h2 className="text-[30px] font-black text-[#2a2f36]">
            What affects your Score?
          </h2>
          <p className="mt-2 text-[13px] font-semibold text-[#667085]">
            Understand the key factors that shape your CIBIL score.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-5">
            {factors.map((factor) => (
              <article key={factor} className="min-h-36 border border-[#d7dfe8] bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center bg-[#e8f4ff] text-[#005ca8]">
                  <BadgeCheck className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[14px] font-black">{factor}</h3>
                <p className="mt-3 line-clamp-3 text-[11px] font-medium leading-5 text-[#475467]">
                  Consistent repayments and responsible credit usage improve
                  lender confidence.
                </p>
              </article>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-between rounded border border-[#d7e8f8] bg-[#e8f4ff] p-7">
            <div>
              <p className="text-[18px] font-black text-[#111827]">
                Join millions who are monitoring their CIBIL score with Fintaraa
              </p>
              <p className="mt-2 text-[13px] font-medium text-[#475467]">
                It is a quick, secure and completely FREE!
              </p>
            </div>
            <BadgeCheck className="h-16 w-16 text-[#005ca8]" />
          </div>
        </div>
      </section>
    </>
  );
}
