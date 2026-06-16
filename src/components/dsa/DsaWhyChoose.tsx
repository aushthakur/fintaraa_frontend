import Image from "next/image";
import { whyChooseItems } from "./dsaData";

export function DsaWhyChoose() {
  return (
    <section className="bg-[#005ca8] px-4 py-10 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex items-start justify-between gap-6">
          <h2 className="text-[30px] font-black">Why Choose Fintaraa?</h2>
          <div className="relative hidden h-24 w-36 md:block">
            <Image
              src="/assets/dsa/security.png"
              alt="Fintaraa DSA compliance"
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
              className="flex min-h-17 items-center gap-3 rounded-xl bg-white px-4 py-3 text-[#005ca8] transition duration-300 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
            >
              <Icon className="h-6 w-6 shrink-0" />
              <span className="text-[12px] font-black leading-4 text-[#111827]">{title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
