import Image from "next/image";
import { lifeImages } from "./careersData";

export function CareersLife() {
  return (
    <section id="life" className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <h2 className="text-[20px] font-black text-[#2a2f36]">
          Life at Fintaraa
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {lifeImages.map((src, index) => (
            <div key={src} className="relative h-34 overflow-hidden rounded-xl bg-[#e8f4ff]">
              <Image src={src} alt={`Life at Fintaraa ${index + 1}`} fill unoptimized className="object-cover" />
            </div>
          ))}
        </div>
        <div className="mt-7 text-center">
          <button className="h-11 rounded-full border border-[#13a653] px-16 text-[13px] font-black text-[#13a653]">
            See More Moments
          </button>
        </div>
      </div>
    </section>
  );
}
