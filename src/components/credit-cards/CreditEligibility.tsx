import Link from "next/link";
import { BadgeCheck, CheckCircle2, ShieldCheck } from "lucide-react";

export function CreditEligibility() {
  return (
    <section className="px-4 py-12 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div className="grid gap-8 md:grid-cols-[1fr_0.75fr] md:items-center">
          <div>
            <h2 className="text-[38px] font-black leading-tight tracking-[-0.03em] text-[#005ca8] md:text-[46px]">
              Check your
              <br />
              credit card eligibility
            </h2>
            <p className="mt-5 text-[15px] font-medium leading-7 text-[#667085]">
              Just a 3-step process for your dream home now.
            </p>
            <div className="mt-6 grid gap-4">
              {[
                "No impact on your CIBIL Score",
                "Personalised results",
                "Best Cards for benefits",
              ].map((item) => (
                <p key={item} className="flex items-start gap-3 text-[13px] font-semibold text-[#2a2f36]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#005ca8]" />
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="flex min-h-64 items-center justify-center rounded-3xl bg-[#e8f4ff] text-[#005ca8]">
            <BadgeCheck className="h-28 w-28" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -right-4 -top-4 h-full w-full rounded bg-[#005ca8]" />
          <div className="relative rounded bg-white p-8 shadow-[0_16px_45px_rgba(16,24,40,0.12)]">
            <div className="mb-8 flex items-center justify-between">
              {[1, 2, 3, 4].map((step, index) => (
                <div key={step} className="flex flex-1 items-center">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-black ${
                    index === 0 ? "bg-[#005ca8] text-white" : "bg-[#dff0ff] text-white"
                  }`}>
                    {step}
                  </span>
                  {index < 3 ? <span className="h-0.5 flex-1 bg-[#dff0ff]" /> : null}
                </div>
              ))}
            </div>
            <h3 className="text-[20px] font-black">Basic Details</h3>
            <p className="mt-1 text-[12px] font-semibold text-[#667085]">
              Let&apos;s start with some basic information.
            </p>
            <form className="mt-6 grid gap-5">
              {["Full Name (as per PAN)", "Mobile Number", "Email Address(Optional)"].map((label) => (
                <label key={label} className="grid gap-2">
                  <span className="text-[13px] font-black text-[#2a2f36]">
                    {label}
                  </span>
                  <input className="h-11 border border-[#d9dfe8] px-4 text-[12px] outline-none" />
                </label>
              ))}
              <button type="button" className="mx-auto h-12 w-44 rounded-full bg-[#13a653] text-[13px] font-black text-white">
                Continue →
              </button>
              <p className="flex justify-center gap-2 text-[11px] font-semibold text-[#8b95a3]">
                <ShieldCheck className="h-4 w-4" />
                Your information is safe & protected
              </p>
            </form>
          </div>
        </div>
        <div className="rounded border border-[#d7dfe8] p-4 md:col-span-2 lg:col-span-1">
          <div className="grid gap-3 text-[11px] font-semibold text-[#667085] sm:grid-cols-3">
            <p>Free to check eligibility</p>
            <p>Trust of 100+ banks</p>
            <p>Personalised offers</p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-9xl text-right">
        <Link href="/credit-cards" className="text-[12px] font-black text-[#005ca8] no-underline">
          View all Partners →
        </Link>
      </div>
    </section>
  );
}
