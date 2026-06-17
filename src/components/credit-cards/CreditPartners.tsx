import Image from "next/image";
import { partnerBanks } from "./creditCardsData";

const tabs = ["Loan", "Insurance", "Credit Card", "Credit Bureau"];

export function CreditPartners() {
  return (
    <section className="px-4 pb-14 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[18px] font-extrabold tracking-[-0.03em] text-[#2b2f38]">
            Our Trusted Partner Banks & NBFCs
          </h2>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`h-8 rounded-full border px-4 text-[11px] font-semibold ${
                  index === 0
                    ? "border-[#1cb45c] bg-[#1cb45c] text-white"
                    : "border-[#dbe3ec] bg-white text-[#2b2f38]"
                }`}
              >
                {tab}
              </button>
            ))}
            <button className="text-[11px] font-semibold text-[#1cb45c]">
              View all Partners →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
          {[...partnerBanks, ...partnerBanks].slice(0, 14).map((logo, index) => (
            <div
              key={`${logo}-${index}`}
              className="flex h-16 items-center justify-center rounded-[8px] border border-[#dbe3ec] bg-white p-3 shadow-[0_4px_14px_rgba(16,24,40,0.03)]"
            >
              <Image
                src={logo}
                alt="Partner bank"
                width={110}
                height={34}
                className="h-auto w-[92px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
