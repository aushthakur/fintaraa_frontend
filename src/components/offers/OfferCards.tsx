import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { offerCards, offerCategories } from "./offersData";

export function OfferCards() {
  return (
    <section className="px-4 py-10 md:px-8 lg:px-12">
      <div className="mx-auto max-w-9xl">
        {/* Category filter pills */}
        <div className="flex gap-3 overflow-x-auto pb-1">
          {offerCategories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`h-11 shrink-0 rounded-full px-6 text-[14px] font-bold transition-colors ${
                index === 0
                  ? "bg-[#4c1d95] text-white"
                  : "bg-[#e8f4ff] text-[#111827] hover:bg-[#d0e8ff]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Section heading */}
        <div className="mt-10 flex items-center justify-between">
          <h2 className="text-[20px] font-extrabold text-[#111827]">
            Exclusive Bank Offers
          </h2>
          <Link
            href="/offers"
            className="text-[13px] font-bold text-[#13a653] no-underline hover:underline"
          >
            View all Offers →
          </Link>
        </div>

        {/* Offer cards grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offerCards.map((offer, index) => (
            <div
              key={`${offer.bank}-${index}`}
              className={`flex flex-col rounded-xl border bg-white p-6 ${
                offer.featured ? "border-[#4c1d95]" : "border-[#e5e7eb]"
              }`}
            >
              {/* Bank logo + Exclusive badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="relative h-9 w-30">
                  <Image
                    src={offer.logo}
                    alt={offer.bank}
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <span className="shrink-0 rounded-sm bg-[#d6f8e0] px-3 py-1 text-[11px] font-bold text-[#13a653]">
                  Exclusive
                </span>
              </div>

              {/* Cashback amount */}
              <h3 className="mt-6 text-[22px] font-extrabold leading-tight text-[#111827]">
                ₹3,000 Cashback
              </h3>
              <p className="mt-0.5 text-[14px] font-bold text-[#111827]">
                on Personal Loan
              </p>

              {/* Description */}
              <p className="mt-3 text-[12px] font-semibold leading-5 text-[#9ca3af]">
                Get ₹3,000 cashback on successful disbursement of Personal Loan.
              </p>

              {/* Valid date */}
              <p className="mt-5 flex items-center gap-1.5 text-[12px] font-semibold text-[#4c1d95]">
                <CalendarDays className="h-4 w-4 shrink-0" />
                Valid till 15 Jun 2024
              </p>

              {/* Apply Now CTA */}
              <AuthRedirectLink
                href="/offers"
                productSlug="offer"
                className="mt-6 flex h-11.5 items-center justify-center rounded-full bg-[#13a653] text-[14px] font-extrabold text-white no-underline hover:bg-[#0f9446] transition-colors"
              >
                Apply Now
              </AuthRedirectLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
