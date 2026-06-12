import Link from "next/link";
import { CreditCard, Gift, ShieldCheck } from "lucide-react";

export function CreditCardsHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-8 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-7 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
      <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-start">
        <div className="grid gap-7 md:grid-cols-[0.35fr_1fr] md:items-center">
          <div className="hidden min-h-44 items-center justify-center rounded-3xl bg-[#e8f4ff] text-[#005ca8] md:flex">
            <CreditCard className="h-24 w-24" />
          </div>
          <div>
            <h1 className="max-w-2xl text-[38px] font-black leading-tight tracking-[-0.03em] text-[#111827] md:text-[52px]">
              <span className="text-[#005ca8]">Find the Best Credit</span>
              <br />
              Cards for Your Lifestyle
            </h1>
            <p className="mt-5 max-w-xl text-[17px] font-medium leading-7 text-[#667085]">
              Find the perfect card for cashback, travel, fuel savings, rewards
              and more from top banks.
            </p>
            <Link
              href="/login?product=credit-card"
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-[#13a653] px-7 text-[14px] font-black text-white no-underline"
            >
              Apply Health Insurance
              <Gift className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -right-4 -top-4 h-full w-full rounded bg-[#005ca8]" />
          <div className="relative rounded bg-white p-7 shadow-[0_16px_45px_rgba(16,24,40,0.12)]">
            <h2 className="text-[21px] font-black text-[#111827]">
              Check your Card offers
            </h2>
            <p className="mt-1 text-[12px] font-semibold text-[#8b95a3]">
              Get personalized card suggestions.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {["Full Name", "Mobile Number", "Monthly Income", "Employment Type"].map(
                (label, index) => (
                  <label key={label} className="grid gap-2">
                    <span className="text-[12px] font-black text-[#2a2f36]">
                      {label}
                    </span>
                    {index > 1 ? (
                      <select className="h-10 border border-[#d9dfe8] bg-white px-3 text-[12px] font-semibold text-[#8b95a3] outline-none">
                        <option>Select Type</option>
                      </select>
                    ) : (
                      <input className="h-10 border border-[#d9dfe8] px-3 text-[12px] outline-none" />
                    )}
                  </label>
                ),
              )}
            </div>
            <button className="mx-auto mt-6 flex h-11 w-60 items-center justify-center rounded-full border border-[#13a653] text-[13px] font-black text-[#13a653]">
              Unlock card offers
            </button>
            <p className="mt-6 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#667085]">
              <ShieldCheck className="h-4 w-4 text-[#13a653]" />
              100% secure. No impact on credit score.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
