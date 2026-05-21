import Link from "next/link";
import {
  Car,
  Home,
  BarChart3,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  WalletCards,
  CheckCircle2,
} from "lucide-react";
import { heroStats } from "@/data/homePage";

function PhoneMockup() {
  return (
    <div className="relative mx-auto h-70 w-42 rounded-[26px] border-[7px] border-[#195585] bg-white p-4 shadow-[0_22px_45px_rgba(0,71,133,0.2)] md:h-80 md:w-50">
      <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#195585]" />
      <p className="text-[10px] font-black text-[#195585]">
        Find Financial Solution
      </p>
      <p className="mt-1 text-[8px] font-semibold text-[#697586]">
        Compare products in seconds
      </p>
      <div className="mt-5 flex h-24 items-end gap-2 rounded-xl bg-[#edf8ff] p-3">
        {[38, 54, 76, 96].map((height, index) => (
          <span
            key={height}
            className="w-5 rounded-t-md bg-[#12b76a]"
            style={{ height }}
          >
            <span className="sr-only">Chart bar {index + 1}</span>
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[
          { Icon: Home, label: "Loans" },
          { Icon: ShieldCheck, label: "Insurance" },
          { Icon: WalletCards, label: "Cards" },
          { Icon: BarChart3, label: "EMI" },
        ].map(({ Icon, label }) => (
          <div
            key={label}
            className="rounded-xl border border-[#e5eef7] bg-white p-2 text-center"
          >
            <Icon className="mx-auto h-4 w-4 text-[#195585]" />
            <p className="mt-1 text-[8px] font-bold text-[#344054]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#f8fcff] to-white px-4 pb-16 pt-8">
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#fff_75%)]" />
      <div className="pointer-events-none absolute right-[8%] top-28 hidden h-64 w-[52%] opacity-80 lg:block">
        <div className="absolute bottom-0 left-0 h-40 w-16 rounded-t-full bg-[#dff1ff]" />
        <div className="absolute bottom-0 left-20 h-64 w-20 rounded-t-full bg-[#eaf6ff]" />
        <div className="absolute bottom-0 left-48 h-52 w-24 rounded-t-full bg-[#d8eeff]" />
        <div className="absolute bottom-0 left-80 h-72 w-24 rounded-t-full bg-[#eef8ff]" />
        <div className="absolute bottom-0 right-0 h-48 w-28 rounded-t-full bg-[#dcefff]" />
      </div>

      <div className="relative mx-auto grid max-w-9xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <h1 className="max-w-xl text-[34px] font-black leading-[1.08] text-[#101828] md:text-[48px]">
            Get the Best Loan, Insurance & Credit Card-
            <span className="block text-[#12b76a]">Fast & Free</span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-7 text-[#667085]">
            Compare offers from trusted banks and NBFCs, check eligibility in
            seconds, and get guided support for every step.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/loans"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#12b76a] px-5 text-[13px] font-black text-[#12b76a] no-underline"
            >
              Explore Loans <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/apply"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#12b76a] px-5 text-[13px] font-black text-white no-underline shadow-[0_10px_24px_rgba(18,183,106,0.25)]"
            >
              Get matched now <CheckCircle2 className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-90 lg:min-h-120">
          <PhoneMockup />
          <div className="absolute bottom-12 left-4 hidden h-32 w-40 rounded-t-[40px] border-4 border-[#f6c36b] bg-[#fff6dc] shadow-xl md:block">
            <div className="absolute -top-10 left-8 h-20 w-24 rotate-45 rounded-md border-l-4 border-t-4 border-[#195585] bg-white" />
            <Home className="absolute bottom-6 left-12 h-14 w-14 text-[#195585]" />
          </div>
          <div className="absolute bottom-10 right-2 hidden md:block">
            <div className="relative h-28 w-64 rounded-[42px_42px_22px_22px] bg-[#195585] shadow-2xl">
              <div className="absolute -top-10 left-16 h-20 w-36 rounded-[60px_60px_20px_20px] border-10 border-[#195585] bg-transparent" />
              <Car className="absolute left-14 top-8 h-24 w-40 text-white" />
              <div className="absolute bottom-2 left-10 h-10 w-10 rounded-full border-8 border-[#1f2937] bg-white" />
              <div className="absolute bottom-2 right-10 h-10 w-10 rounded-full border-8 border-[#1f2937] bg-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto -mt-2 grid max-w-5xl grid-cols-2 rounded-xl border border-[#dbeafe] bg-white px-4 py-4 shadow-[0_12px_28px_rgba(16,24,40,0.08)] md:grid-cols-4">
        {heroStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eff8ff]">
              <Smartphone className="h-4 w-4 text-[#195585]" />
            </div>
            <div>
              <p className="text-[14px] font-black text-[#195585]">
                {stat.value}
              </p>
              <p className="text-[11px] font-semibold text-[#667085]">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
