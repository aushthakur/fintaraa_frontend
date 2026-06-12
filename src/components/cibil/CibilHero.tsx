import Link from "next/link";
import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react";

export function CibilHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-10 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-7 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
      <div className="mx-auto grid max-w-9xl gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
        <div className="relative z-10">
          <div className="mb-4 h-18 w-28 rounded-full border-[12px] border-r-[#13a653] border-t-[#facc15] border-b-[#ef4444] border-l-[#005ca8]" />
          <h1 className="max-w-2xl text-[42px] font-black leading-tight tracking-[-0.03em] text-[#2a2f36] md:text-[56px]">
            Check Free <span className="text-[#13a653]">Credit Score</span>
            <span className="block">& CIBIL Report</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] font-medium leading-7 text-[#475467]">
            Get instant access to your credit health report from CIBIL and
            Experian, accurate, fast and 100% free.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "100% Free",
                text: "No hidden charges",
                icon: ShieldCheck,
              },
              {
                title: "Secure & Safe",
                text: "Your data is protected",
                icon: LockKeyhole,
              },
              {
                title: "Instant Result",
                text: "Your score in seconds",
                icon: BadgeCheck,
              },
            ].map(({ title, text, icon: Icon }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-[#005ca8]" />
                <span>
                  <span className="block text-[13px] font-black text-[#111827]">
                    {title}
                  </span>
                  <span className="text-[11px] font-semibold text-[#667085]">
                    {text}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -right-4 -top-4 h-full w-full rounded bg-[#005ca8]" />
          <div className="relative bg-white p-8 shadow-[0_16px_45px_rgba(16,24,40,0.12)]">
            <h2 className="text-[22px] font-black text-[#111827]">
              Check Your Score Now
            </h2>
            <p className="mt-1 text-[12px] font-semibold text-[#8b95a3]">
              Fill in your details to receive your report.
            </p>
            <form className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-[13px] font-black text-[#2a2f36]">
                  Mobile Number
                </span>
                <input
                  placeholder="Enter Mobile Number"
                  className="h-11 border-0 border-b border-[#111827] px-1 text-[13px] outline-none"
                />
              </label>
              <p className="text-[11px] font-semibold leading-5 text-[#667085]">
                You will receive an OTP on your mobile number.
              </p>
              <p className="text-[11px] font-semibold leading-5 text-[#667085]">
                By logging in, you agree to the Fintaraa Credit Report terms of
                use and authorize us to fetch your data.
              </p>
              <Link
                href="/cibil-score/report"
                className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[#13a653] text-[14px] font-black text-white no-underline"
              >
                Get Free Credit Score
              </Link>
              <p className="text-center text-[11px] font-semibold text-[#8b95a3]">
                Powered by CIBIL & Experian
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
