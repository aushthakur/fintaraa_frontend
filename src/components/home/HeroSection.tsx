import Link from "next/link";
import Image from "next/image";
import {
  ChartPie,
  Headphones,
  UsersRound,
  ShieldCheck,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

const featureCards = [
  {
    title: "Secure & Trusted",
    text: "Bank-grade security to protect your data and money.",
    icon: ShieldCheck,
  },
  {
    title: "Grow Your Wealth",
    text: "Smart investment options to help you build your future.",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    title: "Track & Plan",
    text: "Easy budgeting tools to keep you in control.",
    icon: ChartPie,
  },
];

const trustStats = [
  {
    value: "256-bit",
    label: "Bank-level Security",
    icon: ShieldCheck,
  },
  {
    value: "2M+",
    label: "Happy Customers",
    icon: UsersRound,
  },
  {
    value: "99.9%",
    label: "Uptime & Reliability",
    icon: ShieldCheck,
  },
  {
    value: "24/7",
    label: "Customer Support",
    icon: Headphones,
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] pl-4 pb-10 pt-10 md:pl-6 lg:pl-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_22%,rgba(25,85,133,0.08),transparent_28%),radial-gradient(circle_at_16%_34%,rgba(18,183,106,0.08),transparent_22%)]" />

      <div className="relative mx-auto grid w-full items-center lg:min-h-162.5 lg:grid-cols-[0.39fr_0.61fr]">
        <div className="relative z-10 pt-4 lg:pt-0">
          <h1 className="max-w-2xl text-[30px] font-bold leading-[1.08] tracking-[-0.03em] text-[#2a2b2f] md:text-[42px] xl:text-[50px]">
            Get the Best Loan,
            <span className="block">Insurance & Credit Card-</span>
            <span className="block text-[#4bd96f]">Fast & Free</span>
          </h1>
          <p className="mt-4 max-w-xl text-[18px] font-semibold leading-7 text-[#8a8f99]">
            Compare offers from 30+ banks and NBFCs.
            <br />
            Apply in minutes.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            <Link
              href="/products"
              className="inline-flex h-14 items-center justify-center rounded-full border border-[#12b76a] px-7 text-[15px] font-extrabold text-[#12b76a] no-underline shadow-[0_12px_26px_rgba(18,183,106,0.10)] transition hover:-translate-y-0.5 hover:bg-[#ecfdf3]"
            >
              View All Products
            </Link>
            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#12b76a] px-8 text-[15px] font-extrabold text-white no-underline shadow-[0_16px_32px_rgba(18,183,106,0.24)] transition hover:-translate-y-0.5 hover:bg-[#0ea85f]"
            >
              Check Eligibility Free
            </Link>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-3 lg:max-w-xl">
            {featureCards.map(({ title, text, icon: Icon }) => (
              <div key={title}>
                <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-white text-[#2357ff] shadow-[0_14px_34px_rgba(25,85,133,0.10)] ring-1 ring-[#e6eef8]">
                  <Icon className="h-7 w-7" strokeWidth={2.6} />
                </div>
                <h3 className="mt-5 text-[16px] font-bold text-[#08275d]">
                  {title}
                </h3>
                <p className="mt-3 text-[12px] text-[#667085]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-90 md:min-h-130 lg:min-h-152.5">
          <Image
            src="/assets/refer/header.png"
            alt="Smart banking services with Fintaraa app"
            unoptimized
            width={100}
            height={100}
            className="object-cover w-full object-center lg:object-bottom-right"
          />
        </div>
      </div>

      <div className="relative mx-auto -mt-4 max-w-9xl lg:-mt-20 lg:pr-8">
        <div className="ml-auto grid max-w-3xl grid-cols-1 overflow-hidden rounded-2xl bg-white px-6 py-5 shadow-[0_18px_45px_rgba(25,85,133,0.12)] ring-1 ring-[#e7eff8] sm:grid-cols-2 lg:grid-cols-4">
          {trustStats.map(({ value, label, icon: Icon }, index) => (
            <div
              key={label}
              className={`flex items-center gap-4 px-4 py-3 ${
                index > 0 ? "lg:border-l lg:border-[#edf2f7]" : ""
              }`}
            >
              <Icon
                className="h-8 w-8 shrink-0 text-[#2357ff]"
                strokeWidth={2.4}
              />
              <div>
                <p className="text-[22px] font-black leading-none text-[#08275d]">
                  {value}
                </p>
                <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
