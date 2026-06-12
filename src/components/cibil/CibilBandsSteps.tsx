import Link from "next/link";
import { LockKeyhole, MessageSquareText, Smartphone } from "lucide-react";

const bands = [
  ["750 - 800", "Excellent", "You are a credit borrower.", "bg-[#16c60c]"],
  ["650 - 749", "Good", "You are a reliable borrower.", "bg-[#67df72]"],
  ["550 - 649", "Fair", "You may face limited options.", "bg-[#ffcc00]"],
  ["300 - 549", "Poor", "You have a high-risk borrower.", "bg-[#ff3b22]"],
];

const steps = [
  {
    title: "Enter Your Mobile Number",
    text: "Enter your number and receive OTP.",
    icon: Smartphone,
  },
  {
    title: "Verify with OTP",
    text: "OTP helps protect your credit report.",
    icon: MessageSquareText,
  },
  {
    title: "Check Your CIBIL Score",
    text: "View score, report and offers.",
    icon: LockKeyhole,
  },
];

export function CibilBandsSteps() {
  return (
    <>
      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl border border-[#d7dfe8] bg-white p-8 text-center">
          <h2 className="text-[30px] font-black text-[#2a2f36]">
            Understanding CIBIL Score
          </h2>
          <p className="mt-2 text-[13px] font-semibold text-[#667085]">
            CIBIL score ranges between 300 - 900 and helps lenders assess
            creditworthiness.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {bands.map(([range, label, text, color]) => (
              <div key={range} className="text-left">
                <div className={`${color} py-4 text-center text-[14px] font-black text-black`}>
                  {range}
                </div>
                <p className="mt-4 text-[13px] font-black text-[#111827]">
                  {label}
                </p>
                <p className="mt-1 text-[12px] font-medium text-[#475467]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl text-center">
          <h2 className="text-[32px] font-black leading-tight text-[#2a2f36]">
            Check Your <span className="text-[#005ca8]">CIBIL Score</span>
            <span className="block">in 3 Easy steps</span>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ title, text, icon: Icon }, index) => (
              <article
                key={title}
                className="grid min-h-30 grid-cols-[5rem_1fr] gap-4 border border-[#aeb8c5] bg-white p-5 text-left"
              >
                <span className="text-[17px] font-medium text-[#8b95a3]">
                  Step- 0{index + 1}
                </span>
                <span />
                <span className="flex h-16 w-16 items-center justify-center bg-[#e8f4ff] text-[#005ca8]">
                  <Icon className="h-8 w-8" />
                </span>
                <span>
                  <span className="block text-[13px] font-black text-[#111827]">
                    {title}
                  </span>
                  <span className="mt-2 line-clamp-2 block text-[11px] font-medium text-[#475467]">
                    {text}
                  </span>
                </span>
              </article>
            ))}
          </div>
          <Link
            href="/cibil-score/report"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-[#13a653] px-10 text-[13px] font-black text-white no-underline"
          >
            Get free credit score →
          </Link>
        </div>
      </section>
    </>
  );
}
