import Link from "next/link";
import Image from "next/image";
import { careerStats } from "./careersData";

export function CareersHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-9 pt-8 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-0 top-7 hidden h-30 w-30 rotate-45 bg-[#d8ecff] md:block" />
      <div className="mx-auto grid max-w-9xl gap-8 lg:grid-cols-[0.86fr_1fr] lg:items-center">
        <div>
          <h1 className="text-[40px] font-black leading-tight tracking-[-0.03em] text-[#2a2f36] md:text-[56px]">
            Grow Your Career
            <span className="block">Make a <span className="text-[#005ca8]">Real Impact</span></span>
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] font-medium leading-7 text-[#8b95a3]">
            At Fintaraa, we believe in empowering talent, encouraging
            innovation, and creating an environment where you can grow, learn
            and make a real impact.
          </p>
          <div className="mt-9 flex flex-wrap gap-6">
            <Link href="#open-positions" className="inline-flex h-13 items-center justify-center rounded-full bg-[#13a653] px-9 text-[14px] font-black text-white no-underline">
              View Open Position
            </Link>
            <Link href="#life" className="inline-flex h-13 items-center justify-center rounded-full border border-[#13a653] px-9 text-[14px] font-black text-[#13a653] no-underline">
              Life at Fintaraa
            </Link>
          </div>
        </div>
        <div className="relative min-h-80 overflow-hidden rounded bg-[#e8f4ff]">
          <Image src="/assets/careers/hero.jpg" alt="Fintaraa careers" fill unoptimized className="object-cover" />
        </div>
      </div>
      <div className="mx-auto mt-8 grid max-w-9xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {careerStats.map(({ title, icon: Icon }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-[#005ca8]" />
            <p className="text-[13px] font-black text-[#2a2f36]">{title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
