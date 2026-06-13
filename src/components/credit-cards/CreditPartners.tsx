import Image from "next/image";
import { partnerBanks } from "./creditCardsData";

export function CreditPartners() {
  return (
    <section className="px-4 pb-14 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[20px] font-black text-[#2a2f36]">
            Our Trusted Partner Banks & NBFCs
          </h2>
          <div className="flex gap-3">
            {["All", "Insurance", "Credit Card", "Credit Bureau"].map((tab, index) => (
              <button
                key={tab}
                className={`h-9 rounded-full border px-5 text-[11px] font-black ${
                  index === 0
                    ? "border-[#13a653] bg-[#13a653] text-white"
                    : "border-[#13a653] bg-white text-[#2a2f36]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {[...partnerBanks, ...partnerBanks].map((logo, index) => (
            <div key={`${logo}-${index}`} className="flex h-18 items-center justify-center rounded-xl border border-[#d7dfe8] bg-white p-4">
              <Image
                src={logo}
                alt="Partner bank"
                width={120}
                height={38}
                className="object-contain"
                style={{ width: "112px", height: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
