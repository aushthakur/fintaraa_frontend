import Image from "next/image";
import { lifeImages } from "./careersData";

export function CareersLife() {
  return (
    <section id="life" className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[20px] font-extrabold text-[#2b2f38]">
          Life at Fintaraa
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {lifeImages.map((src, index) => (
            <div
              key={src}
              className="relative h-34 overflow-hidden rounded-[10px] bg-[#e8f4ff] shadow-[0_4px_12px_rgba(16,24,40,0.05)]"
            >
              <Image src={src} alt={`Life at Fintaraa ${index + 1}`} fill unoptimized className="object-cover" />
            </div>
          ))}
        </div>
        <div className="mt-7 text-center">
          <button className="h-11 rounded-full border border-[#86dca3] px-16 text-[13px] font-semibold text-[#1cb45c]">
            See More Moments
          </button>
        </div>
      </div>
    </section>
  );
}
