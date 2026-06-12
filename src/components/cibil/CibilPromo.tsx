import Link from "next/link";
import { BadgeCheck } from "lucide-react";

export function CibilPromo() {
  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-8 rounded-xl border border-[#c8e8ff] bg-[linear-gradient(105deg,#f3fbff,#ffffff_45%,#eaf7ff)] p-8 md:grid-cols-[1fr_0.7fr] md:items-center">
        <div>
          <p className="inline-flex rounded-full bg-[#e8f4ff] px-3 py-1 text-[11px] font-black text-[#005ca8]">
            100% Free - No impact on score
          </p>
          <h2 className="mt-5 text-[36px] font-black leading-tight text-[#111827]">
            Your Credit Health,
            <span className="block text-[#005ca8]">Your Financial Freedom</span>
          </h2>
          <p className="mt-4 max-w-xl text-[14px] font-medium leading-6 text-[#475467]">
            Track your CIBIL score and report instantly. Know where you stand
            before applying for loans and credit cards.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {["Secure", "Instant", "No impact", "Free"].map((item) => (
              <p key={item} className="flex items-center gap-2 text-[12px] font-black text-[#475467]">
                <BadgeCheck className="h-4 w-4 text-[#005ca8]" />
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white p-7 text-center shadow-[0_18px_55px_rgba(25,85,133,0.14)]">
          <div className="mx-auto h-32 w-32 rounded-full border-[20px] border-[#13a653] border-l-[#facc15] border-b-[#ef4444]" />
          <p className="mt-5 text-[18px] font-black">Check Free CIBIL Score</p>
          <Link
            href="/cibil-score/report"
            className="mt-5 inline-flex h-12 items-center justify-center rounded bg-[#005ca8] px-8 text-[13px] font-black text-white no-underline"
          >
            Check My Score Now →
          </Link>
        </div>
      </div>
    </section>
  );
}
