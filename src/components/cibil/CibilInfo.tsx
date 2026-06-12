import Link from "next/link";
import { CibilGauge } from "./CibilGauge";

export function CibilInfo() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <h2 className="text-[32px] font-black text-[#2a2f36]">
            What is Credit Score
          </h2>
          <p className="mt-6 max-w-3xl text-[15px] font-medium leading-7 text-[#475467]">
            A credit score is a 3 digit number that shows how you have managed
            credit in the past. It helps banks and NBFCs understand how likely
            you are to repay a loan.
          </p>
          <p className="mt-4 max-w-3xl text-[15px] font-medium leading-7 text-[#475467]">
            In India, it is commonly called a CIBIL score, provided by
            TransUnion CIBIL. Your payment history, current credit usage, credit
            age and enquiries affect the score.
          </p>
        </div>
        <div className="text-center">
          <Link
            href="/contact-us"
            className="mb-4 inline-flex h-11 items-center justify-center rounded-full bg-[#13a653] px-8 text-[13px] font-black text-white no-underline"
          >
            Talk to Loan Expert
          </Link>
          <CibilGauge />
        </div>
      </div>
    </section>
  );
}
