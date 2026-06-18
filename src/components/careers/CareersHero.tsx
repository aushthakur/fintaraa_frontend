import Link from "next/link";
import Image from "next/image";
import { careerStats } from "./careersData";

export function CareersHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-9 pt-6 md:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-22px] top-10 hidden h-32 w-32 rounded-[28px] bg-[#dcecfb] opacity-80 [clip-path:polygon(0_50%,50%_0,100%_50%,50%_100%)] md:block" />
        <div className="absolute left-[-10px] top-0 hidden h-40 w-40 rounded-[34px] bg-[#eef5ff] opacity-90 [clip-path:polygon(0_50%,50%_0,100%_50%,50%_100%)] md:block" />
      </div>

      <div className="mx-auto grid max-w-9xl gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
        <div className="relative z-10">
          <h1 className="max-w-xl text-[34px] font-extrabold leading-[1.04] tracking-[-0.05em] text-[#2b2f38] md:text-[46px] lg:text-[58px]">
            Grow Your Career
            <span className="block">
              Make a <span className="text-[#0d64bf]">Real Impact</span>
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-[14px] font-medium leading-7 text-[#8b95a3] md:text-[15px]">
            At Fintaraa, we believe in empowering talent, encouraging
            innovation, and creating an environment where you can grow, learn
            and make a real impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 md:gap-5">
            <Link
              href="#open-positions"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#1cb45c] px-8 text-[14px] font-semibold text-white no-underline shadow-[0_14px_28px_rgba(28,180,92,0.22)] transition hover:-translate-y-0.5 hover:bg-[#16954d]"
            >
              View Open Position
            </Link>
            <Link
              href="#life"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#86dca3] bg-white px-8 text-[14px] font-semibold text-[#1cb45c] no-underline transition hover:-translate-y-0.5 hover:border-[#4fc76f]"
            >
              Life at Fintaraa
            </Link>
          </div>
        </div>

        <div className="relative h-90 w-full overflow-hidden">
          <Image
            src="/assets/images/hero1.png"
            alt="Fintaraa careers"
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      <div className="relative z-20 mt10 ml-4 flex flex-wrap gap-10">
        {careerStats.map(({ title, icon: Icon }) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf5ff] text-[#0d64bf]">
              <Icon className="h-4 w-4" />
            </span>
            <p className="text-[13px] font-semibold text-[#2b2f38]">{title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}