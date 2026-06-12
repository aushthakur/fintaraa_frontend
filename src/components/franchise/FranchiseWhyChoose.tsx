import Image from "next/image";
import { whyChooseItems } from "./franchiseData";

export function FranchiseWhyChoose() {
  return (
    <section className="bg-[#005ca8] px-4 py-10 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex items-start justify-between gap-6">
          <h2 className="text-[30px] font-black">Why Choose Fintaraa?</h2>
          <div className="relative hidden h-24 w-36 md:block">
            <Image
              src="/assets/franchise/security.png"
              alt="Fintaraa compliance"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-5">
          {whyChooseItems.map(({ title, icon: Icon }, index) => (
            <div
              key={`${title}-${index}`}
              className="flex min-h-17 items-center gap-3 rounded-lg bg-white px-4 py-3 text-[#005ca8]"
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span className="text-[12px] font-black leading-4">{title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
