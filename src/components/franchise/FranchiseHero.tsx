import Image from "next/image";
import Link from "next/link";
// import { PhoneCall } from "lucide-react";
import { franchiseStats } from "./franchiseData";

export function FranchiseHero() {
  return (
    <section className="relative overflow-hidden bg-[#fbfdff] px-4 pb-8 pt-8 md:px-6 lg:px-8">
      {/* Blue diamond accent top-left */}
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
        {/* Right parallel rectangle matching the screenshot position */}
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
      <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
        {/* Left: Text */}
        <div className="relative z-10">
          <h1 className="leading-[1.05]">
            <span className="block text-[44px] font-[800] text-[#2B2F38]">
              Open Your Own
            </span>

            <span className="mt-1 block text-[44px] font-[800] text-[#005CA8]">
              Fintaraa Franchise
            </span>

            <span className="mt-3 block text-[34px] font-[800] text-[#2B2F38]">
              &amp; Build a Profitable Business
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] font-semibold leading-7 text-[#667085]">
            Partner with 30+ leading banks and NBFCs. Refer loans, credit cards
            and insurance products and earn attractive commissions on every
            successful approval.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="#franchise-form"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#15B24A] px-8 text-[15px] font-semibold text-white"
            >
              Apply For Franchise
            </Link>
            <a
              href="tel:+918448282679"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#15B24A] px-8 text-[15px] font-semibold text-[#15B24A]"
            >
              Talk to Franchise Expert
            </a>
          </div>
        </div>

        {/* Right: Hero image - Fintaraa franchise outlet photo */}
        <div className="relative h-90 w-full overflow-hidden">
          <Image
            src="/assets/images/hero.png"
            alt="Fintaraa franchise outlet"
            fill
            priority
            unoptimized
            className="object-contain object-center"
          />
          {/* Floating badge chips visible in Figma */}
          {/* <div className="absolute right-4 top-4 flex flex-col gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-[#005ca8] shadow-md">
              30+ Bank Tie-ups
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-[#005ca8] shadow-md">
              High Commissions
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-black text-[#005ca8] shadow-md">
              Fast Payouts
            </span>
          </div> */}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative z-20 -mt-10 ml-4 flex flex-wrap gap-10">
        {franchiseStats.map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EDF5FF]">
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
