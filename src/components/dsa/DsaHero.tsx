import Image from "next/image";
import Link from "next/link";
import { dsaStats } from "./dsaData";
import { BadgeIndianRupee, Zap, Laptop, TrendingUp } from "lucide-react";

export function DsaHero() {
  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-4 pb-8 pt-8 md:px-6 lg:px-8">
      {/* decorative corner block */}
      <div className="absolute inset-0 overflow-visible pointer-events-none z-0">
        {/*Left-most rectangle bleeding off the screen */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "55px",
            height: "90px",
            top: "-20px",
            left: "-15px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
        {/*Right parallel rectangle matching the screenshot position */}
        <div
          className="absolute hidden md:block bg-[#e0effe]"
          style={{
            width: "60px",
            height: "120px",
            top: "-80px",
            left: "40px",
            borderRadius: "5px",
            transform: "rotate(140deg)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        {/* Left: text */}
        <div className="relative z-10">
          <h1 className="text-[36px] font-black leading-[1.08] tracking-[-0.03em] text-[#2a2f36] md:text-[52px]">
            Become a Fintaraa
            <span className="block mt-1">
              <span className="text-[#005ca8]">DSA Partner</span> &amp; Earn
            </span>
            <span className="block mt-1 text-[#2a2f36]">High Commissions</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[14px] font-semibold leading-7 text-[#667085]">
            Partner with 95+ leading banks and NBFCs, refer loans, credit cards
            and insurance products and earn attractive commission on every
            successful approval.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="#dsa-form"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#13a653] px-8 text-[13px] font-extrabold text-white no-underline"
            >
              Become a Partner
            </Link>
            <a
              href="tel:+918448282679"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#13a653] px-8 text-[13px] font-extrabold text-[#13a653] no-underline"
            >
              Talk to Partnership Team
            </a>
          </div>
        </div>

        {/* Right: hero image with floating badges */}
        <div className="relative min-h-74 md:min-h-112">
          {/* Blue oval/blob background */}
          <div className="absolute inset-x-0 bottom-0 mx-auto h-[80%] w-[80%] rounded-full bg-[#dbeeff] blur-2xl opacity-60" />

          <Image
            src="/assets/dsa/hero.png"
            alt="Fintaraa DSA partners"
            fill
            priority
            unoptimized
            className="object-contain object-bottom"
          />

          {/* Floating badge: center-left area — Online Process */}
          <div className="absolute left-[-15px] top-[40%] z-10 flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-[0_4px_16px_rgba(0,92,168,0.15)]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#e8f4ff] text-[#005ca8]">
              <Laptop className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-black leading-tight text-[#111827]">
              Online<br />Process
            </span>
          </div>

          {/* Floating badge: top-right — High Commissions */}
          <div className="absolute right-[-10px] top-6 z-10 flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-[0_4px_16px_rgba(0,92,168,0.15)]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#e6faf0] text-[#13a653]">
              <TrendingUp className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-black leading-tight text-[#111827]">
              High<br />Commissions
            </span>
          </div>

          {/* Floating badge: bottom-right — Fast Payouts */}
          <div className="absolute bottom-16 right-[-10px] z-10 flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-[0_4px_16px_rgba(0,92,168,0.15)]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#fff4e5] text-[#f59e0b]">
              <Zap className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-black leading-tight text-[#111827]">
              Fast<br />Payouts
            </span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-20 -mt-10 ml-4 flex flex-wrap gap-10">
        {dsaStats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          >
            <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#EDF5FF]">
              <Icon className="h-10 w-10 text-[#005CA8]" />
            </div>

            <div>
              <div className="text-[13px] font-bold text-[#111827]">
                {value}
              </div>

              <div className="text-[10px] text-[#8A8A8A]">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}