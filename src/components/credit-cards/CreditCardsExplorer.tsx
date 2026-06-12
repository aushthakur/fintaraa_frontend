import Image from "next/image";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cardCategories, creditCards, benefits } from "./creditCardsData";

export function CreditCardsExplorer() {
  return (
    <section className="px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-black text-[#111827]">
              Explore Credit Cards by Category
            </h2>
            <p className="text-[12px] font-medium text-[#667085]">
              Find the perfect credit card for your lifestyle and spending
              needs.
            </p>
          </div>
          <Link href="/credit-cards" className="text-[12px] font-black text-[#005ca8] no-underline">
            View All Categories →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {cardCategories.map(({ title, icon: Icon }) => (
            <article key={title} className="rounded border border-[#d7dfe8] bg-white p-5 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4ff] text-[#005ca8]">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[11px] font-black text-[#2a2f36]">
                {title}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-[17rem_1fr]">
          <aside className="rounded border border-[#d7dfe8] bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-black">Filters</p>
              <button className="text-[11px] font-semibold text-[#667085]">
                Clear All
              </button>
            </div>
            {["Banks", "Category", "Annual Fee", "Minimum Income", "Credit Score", "Reward Type", "Welcome Benefits"].map(
              (filter, index) => (
                <div key={filter} className="border-b border-[#eef2f6] py-4">
                  <button className="flex w-full items-center justify-between text-[12px] font-black">
                    {filter}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {index < 3 ? (
                    <div className="mt-3 grid gap-2 text-[11px] font-medium text-[#667085]">
                      {["HDFC Bank", "SBI Card", "ICICI Bank", "Axis Bank"].map((bank) => (
                        <label key={bank} className="flex items-center gap-2">
                          <input type="checkbox" />
                          {bank}
                        </label>
                      ))}
                    </div>
                  ) : null}
                </div>
              ),
            )}
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[12px] font-black">52 Cards Found</p>
              <button className="inline-flex items-center gap-2 rounded border border-[#d7dfe8] px-3 py-2 text-[11px] font-semibold">
                <SlidersHorizontal className="h-4 w-4" />
                Most Popular
              </button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {creditCards.map(({ bank, title, logo }) => (
                <article key={title} className="rounded-xl border border-[#d7dfe8] bg-white p-4">
                  <div className="flex items-center justify-between">
                    <Image src={logo} alt={bank} width={96} height={28} className="h-7 w-24 object-contain object-left" />
                    <label className="flex items-center gap-1 text-[10px] font-medium text-[#667085]">
                      <input type="checkbox" />
                      Compare
                    </label>
                  </div>
                  <div className="mt-4 h-28 rounded bg-[linear-gradient(135deg,#111827,#005ca8)]" />
                  <h3 className="mt-4 min-h-10 text-[13px] font-black leading-5">
                    {title}
                  </h3>
                  <p className="mt-2 text-[11px] font-semibold text-[#667085]">
                    5% Cashback on Online Spends
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
                    <p>
                      <span className="block font-black">₹1000</span>
                      Annual Fee
                    </p>
                    <p>
                      <span className="block font-black">5%</span>
                      Reward Rate
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link href="/credit-cards" className="rounded border border-[#005ca8] py-2 text-center text-[11px] font-black text-[#005ca8] no-underline">
                      View Details
                    </Link>
                    <Link href="/login?product=credit-card" className="rounded bg-[#005ca8] py-2 text-center text-[11px] font-black text-white no-underline">
                      Apply Now
                    </Link>
                  </div>
                  <Link href="/credit-cards" className="mt-4 block text-center text-[11px] font-black text-[#005ca8] no-underline">
                    Check Eligibility
                  </Link>
                </article>
              ))}
            </div>
            <div className="mt-5 flex justify-end">
              <button className="rounded bg-[#005ca8] px-6 py-3 text-[12px] font-black text-white">
                Compare Now →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {benefits.map(({ title, icon: Icon }) => (
            <div key={title} className="rounded border border-[#d7dfe8] bg-white p-4 text-center">
              <Icon className="mx-auto h-6 w-6 text-[#005ca8]" />
              <p className="mt-2 text-[12px] font-black text-[#2a2f36]">
                {title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
