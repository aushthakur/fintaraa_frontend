import Image from "next/image";
import { Search } from "lucide-react";

export function OffersHero() {
  return (
    <section className="bg-[#e8f4ff] px-4 py-14 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
        <div>
          <h1 className="text-[48px] font-black tracking-[-0.03em] text-[#005ca8]">
            Offers & Rewards
          </h1>
          <p className="mt-4 text-[18px] font-medium text-[#111827]">
            Exclusive offers and cashback deals for you.
          </p>
          <label className="relative mt-6 block max-w-xl">
            <input
              placeholder="Search offers, banks or products ..."
              className="h-12 w-full rounded bg-white px-5 pr-12 text-[13px] font-semibold outline-none placeholder:text-[#a0a7b2]"
            />
            <Search className="absolute right-4 top-3.5 h-5 w-5 text-[#a0a7b2]" />
          </label>
        </div>
        <div className="relative min-h-56">
          <Image
            src="/assets/offers/hero.png"
            alt="Offers and rewards"
            fill
            unoptimized
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
