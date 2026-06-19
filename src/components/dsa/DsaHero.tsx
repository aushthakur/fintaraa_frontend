import Image from "next/image";
import Link from "next/link";
import { Building2, BadgeIndianRupee, Zap } from "lucide-react";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { dsaStats } from "./dsaData";

const heroBadges = [
  {
    label: "30+ Bank Tie-ups",
    icon: Building2,
    className: "left-4 top-24 md:left-0",
  },
  {
    label: "High Commissions",
    icon: BadgeIndianRupee,
    className: "right-4 top-10 md:right-2",
  },
  {
    label: "Fast Payouts",
    icon: Zap,
    className: "right-2 bottom-20 md:right-0",
  },
];

export function DsaHero() {
  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-4 pb-8 pt-5 md:px-6 lg:px-8 lg:pb-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-22px] top-10 h-32 w-32 rounded-[28px] bg-[#d7e8fb] opacity-75 [clip-path:polygon(0_50%,50%_0,100%_50%,50%_100%)]" />
        <div className="absolute left-[-12px] top-0 h-40 w-40 rounded-[34px] bg-[#eaf3ff] opacity-80 [clip-path:polygon(0_50%,50%_0,100%_50%,50%_100%)]" />
      </div>
      <div className="relative mx-auto grid max-w-9xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="max-w-xl text-[34px] font-extrabold leading-[1.03] tracking-[-0.05em] text-[#33393f] md:text-[48px] xl:text-[54px]">
            Become a Fintaraa
            <span className="block text-[#0d64bf]">DSA Partner</span>
            <span className="block">&amp; Earn</span>
            <span className="block">High Commissions</span>
          </h1>
          <p className="mt-5 max-w-lg text-[14px] font-medium leading-7 text-[#6f7681] md:text-[15px]">
            Partner with 30+ leading banks and NBFCs. Refer loans, credit cards
            and insurance products and earn attractive commissions on every
            successful approval.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="#dsa-form"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#1cb45c] px-8 text-[14px] font-bold text-white no-underline shadow-[0_14px_30px_rgba(28,180,92,0.22)] transition hover:-translate-y-0.5 hover:bg-[#16954d]"
            >
              Become a Partner
            </Link>
            <a
              href="tel:+918001234567"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#7edc9e] bg-white px-8 text-[14px] font-bold text-[#1cb45c] no-underline transition hover:-translate-y-0.5 hover:border-[#46c86f] hover:text-[#16a34a]"
            >
              Talk to Partnership Team
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {dsaStats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-[#dde7f2] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(16,24,40,0.04)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf5ff] text-[#0d64bf]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <AnimatedCounter
                    value={value}
                    className="block text-[16px] font-extrabold text-[#22272e]"
                  />
                  <div className="text-[10px] font-semibold leading-4 text-[#8391a3]">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-82.5 md:min-h-130">
          <Image
            src="/assets/dsa/hero.png"
            alt="Fintaraa DSA partners"
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain object-center"
          />

          {heroBadges.map(({ label, icon: Icon, className }) => (
            <div
              key={label}
              className={`absolute z-10 flex items-center gap-2 rounded-[14px] border border-[#edf1f6] bg-white px-3 py-2 shadow-[0_10px_30px_rgba(16,24,40,0.08)] ${className}`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef5ff] text-[#0d64bf]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-bold leading-4 text-[#20252d]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
