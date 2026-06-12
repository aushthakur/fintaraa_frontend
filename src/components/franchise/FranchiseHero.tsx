import Image from "next/image";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { franchiseStats } from "./franchiseData";

export function FranchiseHero() {
  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-4 pb-8 pt-8 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-4 hidden h-28 w-28 rotate-45 bg-[#d8ecff] md:block" />
      <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative z-10">
          <h1 className="text-[34px] font-black leading-[1.08] tracking-[-0.03em] text-[#2a2f36] md:text-[50px]">
            Open Your Own
            <span className="block text-[#005ca8]">Fintaraa Franchise</span>
            <span className="block text-[26px] text-[#2a2f36] md:text-[38px]">
              & Build a Profitable Business
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-[14px] font-semibold leading-7 text-[#667085]">
            Partner with 30+ leading banks and NBFCs. Refer loans, credit cards
            and insurance products and earn attractive commissions on every
            successful approval.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link
              href="#franchise-form"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#13a653] px-7 text-[13px] font-extrabold text-white no-underline"
            >
              Apply For Franchise
            </Link>
            <a
              href="tel:+918448282679"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#13a653] px-7 text-[13px] font-extrabold text-[#13a653] no-underline"
            >
              <PhoneCall className="h-4 w-4" />
              Talk to Franchise Expert
            </a>
          </div>
        </div>

        <div className="relative min-h-72 overflow-hidden bg-[#dceaf6] md:min-h-110">
          <Image
            src="/assets/franchise/hero.jpg"
            alt="Fintaraa franchise outlet"
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>
      </div>

      <div className="relative mx-auto mt-5 grid max-w-9xl grid-cols-2 gap-3 md:grid-cols-4">
        {franchiseStats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,92,168,0.08)]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#e8f4ff] text-[#005ca8]">
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-[13px] font-black text-[#111827]">
                {value}
              </span>
              <span className="text-[11px] font-semibold text-[#667085]">
                {label}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
