import Image from "next/image";
import { whyChooseItems } from "./franchiseData";

export function FranchiseWhyChoose() {
  return (
    <section className="bg-[#005ca8] px-4 py-8 text-white md:px-6 md:py-10 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#bfe7ff]">
              Why choose Fintaraa
            </p>
            <h2 className="mt-1 text-[24px] font-extrabold leading-tight md:text-[32px]">
              Franchise support built for faster daily operations
            </h2>
          </div>
          <div className="relative hidden h-16 w-42 shrink-0 md:block">
            <Image
              src="/assets/images/security.png"
              alt="Fintaraa compliance badges"
              fill
              sizes="168px"
              unoptimized
              className="object-contain object-right"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseItems.map(({ title, text, icon: Icon }, index) => (
            <div
              key={`${title}-${index}`}
              className="flex min-w-0 items-start gap-3 rounded-xl border border-white/20 bg-white p-3 text-[#073a62] shadow-[0_10px_24px_rgba(0,35,70,0.12)] md:p-3.5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f4ff] text-[#005ca8]">
                <Icon className="h-5 w-5 stroke-[1.8]" />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-extrabold leading-5 text-[#07162d]">
                  {title}
                </span>
                <span className="mt-1 block text-[11.5px] font-semibold leading-5 text-[#667085]">
                  {text}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
