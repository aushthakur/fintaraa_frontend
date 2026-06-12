import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { offerCards, offerCategories } from "./offersData";

export function OfferCards() {
  return (
    <section className="px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="flex gap-5 overflow-x-auto">
          {offerCategories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`h-12 shrink-0 rounded-full px-8 text-[15px] font-bold ${
                index === 0
                  ? "bg-[#005ca8] text-white"
                  : "bg-[#e8f4ff] text-[#111827]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-[22px] font-black text-[#111827]">
            Exclusive Bank Offers
          </h2>
          <Link
            href="/offers"
            className="text-[12px] font-black text-[#13a653] no-underline"
          >
            View all Offers →
          </Link>
        </div>

        <div className="mt-7 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {offerCards.map((offer, index) => (
            <div
              key={`${offer.bank}-${index}`}
              className={`rounded-xl border bg-white p-8 ${
                offer.featured ? "border-[#005ca8]" : "border-[#d9e2ec]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <Image
                  src={offer.logo}
                  alt={offer.bank}
                  width={120}
                  height={36}
                  className="h-9 w-32 object-contain object-left"
                />
                <span className="rounded bg-[#d6f8e0] px-4 py-2 text-[12px] font-semibold text-[#13a653]">
                  Exclusive
                </span>
              </div>
              <h3 className="mt-8 text-[20px] font-black text-[#111827]">
                ₹3,000 Cashback
              </h3>
              <p className="mt-1 text-[15px] font-semibold text-[#111827]">
                on Personal Loan
              </p>
              <p className="mt-4 text-[12px] font-semibold leading-5 text-[#9ca3af]">
                Get ₹3,000 cashback on successful disbursement of Personal
                Loan.
              </p>
              <p className="mt-7 flex items-center gap-2 text-[12px] font-semibold text-[#005ca8]">
                <CalendarDays className="h-4 w-4" />
                Valid till 15 Jun 2024
              </p>
              <Link
                href="/login?product=offer"
                className="mt-8 flex h-13 items-center justify-center rounded-full bg-[#13a653] text-[14px] font-black text-white no-underline"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
