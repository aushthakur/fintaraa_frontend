"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Landmark,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  fetchEligibleOffers,
  type OfferRecord,
} from "@/services/offers";

type OfferCategory = "all" | "loan" | "card" | "insurance";

const categoryLabels: Record<OfferCategory, string> = {
  all: "All matches",
  loan: "Loans",
  card: "Credit cards",
  insurance: "Insurance",
};

const categoryIcons: Record<Exclude<OfferCategory, "all">, LucideIcon> = {
  loan: Landmark,
  card: CreditCard,
  insurance: ShieldCheck,
};

const categoryTone: Record<Exclude<OfferCategory, "all">, string> = {
  loan: "bg-[#e8f3fb] text-[#075cde]",
  card: "bg-[#f0ecff] text-[#6548c7]",
  insurance: "bg-[#e9f8ef] text-[#168447]",
};

export function CibilEligibleOffers({ score = 0 }: { score?: number }) {
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [category, setCategory] = useState<OfferCategory>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await fetchEligibleOffers();
        if (active) setOffers(result.offers || []);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load profile-matched offers.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const availableCategories = useMemo(() => {
    const found = new Set(
      offers
        .map((offer) => offer.productCategory)
        .filter(Boolean) as Array<Exclude<OfferCategory, "all">>,
    );
    return (["all", "loan", "card", "insurance"] as OfferCategory[]).filter(
      (item) => item === "all" || found.has(item),
    );
  }, [offers]);

  const visibleOffers = useMemo(
    () =>
      offers
        .filter(
          (offer) =>
            category === "all" || offer.productCategory === category,
        )
        .slice(0, 4),
    [category, offers],
  );

  return (
    <MotionConfig reducedMotion="user">
      <section className="border-y border-[#dce9f1] bg-[#f4f9fc] px-4 py-10 md:px-6 md:py-12 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p className="inline-flex items-center gap-2 text-[12px] font-extrabold text-[#075cde]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Profile-based matching
              </p>
              <h2 className="mt-3 text-[26px] font-extrabold leading-tight text-[#102f49] sm:text-[30px]">
                Offers matched to your credit profile
              </h2>
              <p className="mt-2 text-[14px] font-medium text-[#667f91]">
                Based on your saved CIBIL score of{" "}
                <span className="font-extrabold text-[#254e69]">
                  {score || "not available"}
                </span>
                . Final eligibility remains subject to lender assessment.
              </p>
            </div>

            {availableCategories.length > 1 ? (
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                {availableCategories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`h-10 shrink-0 rounded-md border px-3.5 text-[11px] font-extrabold transition-colors ${
                      category === item
                        ? "border-[#075cde] bg-[#075cde] text-white"
                        : "border-[#cbdde8] bg-white text-[#526e82] hover:border-[#8ebbd3] hover:text-[#075cde]"
                    }`}
                  >
                    {categoryLabels[item]}
                  </button>
                ))}
              </div>
            ) : null}
          </motion.div>

          <div className="mt-6 overflow-hidden rounded-lg border border-[#cddfe9] bg-white">
            {loading ? (
              <div className="flex min-h-44 items-center justify-center gap-2 text-[12px] font-bold text-[#526e82]">
                <Loader2 className="h-4 w-4 animate-spin text-[#075cde]" aria-hidden="true" />
                Matching offers with your profile...
              </div>
            ) : visibleOffers.length ? (
              <div className="divide-y divide-[#e2ebf1]">
                {visibleOffers.map((offer, index) => {
                  const offerCategory = (offer.productCategory ||
                    "loan") as Exclude<OfferCategory, "all">;
                  const Icon = categoryIcons[offerCategory] || Landmark;
                  return (
                    <motion.article
                      key={offer._id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(150px,0.55fr)_minmax(150px,0.55fr)_auto] lg:items-center"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${categoryTone[offerCategory] || categoryTone.loan}`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] font-extrabold text-[#075cde]">
                              {offer.lenderName || "Fintaraa partner"}
                            </p>
                            {offer.badge ? (
                              <span className="rounded-md bg-[#edf6fc] px-2 py-0.5 text-[9px] font-extrabold text-[#526e82]">
                                {offer.badge}
                              </span>
                            ) : null}
                          </div>
                          <h3 className="mt-1 text-[15px] font-extrabold leading-5 text-[#102f49]">
                            {offer.title}
                          </h3>
                          <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-5 text-[#7890a2]">
                            {offer.description ||
                              "Review the current partner terms before applying."}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase text-[#8ca0af]">
                          Offer value
                        </p>
                        <p className="mt-1 text-[13px] font-extrabold text-[#254e69]">
                          {offer.amountLabel || "Flexible value"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase text-[#8ca0af]">
                          Rate or benefit
                        </p>
                        <p className="mt-1 text-[13px] font-extrabold text-[#254e69]">
                          {offer.rateLabel || "Partner terms"}
                        </p>
                      </div>

                      <Link
                        href="/offers"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#075cde] px-4 text-[11px] font-extrabold text-white no-underline transition-colors hover:bg-[#064cb8]"
                      >
                        Review offer
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center px-5 py-8 text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#e8f3fb] text-[#075cde]">
                  <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-3 text-[15px] font-extrabold text-[#102f49]">
                  No profile-matched offers available yet
                </h3>
                <p className="mt-2 max-w-lg text-[11px] font-medium leading-5 text-[#7890a2]">
                  {error ||
                    "New lender campaigns will appear here automatically when they match your profile."}
                </p>
                <Link
                  href="/products"
                  className="mt-4 inline-flex items-center gap-2 text-[11px] font-extrabold text-[#075cde] no-underline"
                >
                  Browse all products
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
