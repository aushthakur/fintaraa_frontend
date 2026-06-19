import Image from "next/image";
import { whyChooseItems } from "./dsaData";

export function DsaWhyChoose() {
  return (
    <section className="bg-[#0b5aa8] px-4 py-10 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex items-start justify-between gap-6">
          <h2 className="text-[24px] font-extrabold tracking-[-0.03em]">
            Why Choose Fintaraa?
          </h2>
          <div className="relative hidden h-20 w-35 md:block">
            <Image
              src="/assets/images/security.png"
              alt="Fintaraa compliance"
              fill
              unoptimized
              sizes="112px"
              className="object-contain"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {whyChooseItems.map(({ title, icon: Icon }, index) => (
            <div
              key={`${title}-${index}`}
              className="flex min-h-18.5 items-center gap-3 rounded-[16px] bg-white px-4 py-3 text-[#0b5aa8] shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5"
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-[12px] font-extrabold leading-4 text-[#1d2633]">
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
