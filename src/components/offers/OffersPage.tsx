"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Loader2,
  Percent,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { WhatsAppConsent } from "@/components/common/WhatsAppConsent";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import { buildWebsiteConsentPayload } from "@/lib/formConsent";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import {
  applyForOffer,
  fetchEligibleOffers,
  fetchPublicOffers,
  type OfferRecord,
} from "@/services/offers";
import { OffersHero } from "./OffersHero";
import { SubmissionSuccessNotice } from "@/components/common/SubmissionSuccessNotice";

const categories = [
  { label: "All Offers", value: "all", icon: Sparkles },
  { label: "Loans", value: "loan", icon: WalletCards },
  { label: "Credit Cards", value: "card", icon: CreditCard },
  { label: "Insurance", value: "insurance", icon: ShieldCheck },
];

const categoryMeta: Record<
  string,
  {
    icon: typeof WalletCards;
    label: string;
    tone: string;
    chip: string;
    surface: string;
  }
> = {
  loan: {
    icon: WalletCards,
    label: "Loan Offer",
    tone: "bg-[#e8f4ff] text-[#005ca8]",
    chip: "bg-[#e8f4ff] text-[#005ca8]",
    surface: "from-[#e8f4ff] to-white",
  },
  card: {
    icon: CreditCard,
    label: "Card Offer",
    tone: "bg-[#f2efff] text-[#5b43d6]",
    chip: "bg-[#f2efff] text-[#5b43d6]",
    surface: "from-[#f2efff] to-white",
  },
  insurance: {
    icon: ShieldCheck,
    label: "Insurance Offer",
    tone: "bg-[#eafaf1] text-[#10884a]",
    chip: "bg-[#eafaf1] text-[#10884a]",
    surface: "from-[#eafaf1] to-white",
  },
};

type OfferDisplayRecord = OfferRecord & {
  visual?: string;
};

const publicFallbackOffers: OfferDisplayRecord[] = [
  {
    _id: "fallback-loan-offer",
    title: "Instant loan processing support",
    lenderName: "Fintaraa partner banks",
    productCategory: "loan",
    productType: "personal-loan",
    rateLabel: "From 10.5% p.a.",
    amountLabel: "Up to Rs. 25 Lakh",
    badge: "Popular",
    description:
      "Compare personal loan options with assisted eligibility and document guidance.",
    ctaText: "Check Eligibility",
    tags: ["Digital process", "Quick callback", "Bank offers"],
    visual: "/assets/home/hero-banners/instant-digital-loan.png",
  },
  {
    _id: "fallback-card-offer",
    title: "Rewards and cashback credit cards",
    lenderName: "Fintaraa card partners",
    productCategory: "card",
    productType: "credit-card",
    rateLabel: "Lifetime value",
    amountLabel: "Multiple cards",
    badge: "Rewards",
    description:
      "Explore cards for shopping, travel, fuel, cashback, and reward points.",
    ctaText: "Explore Cards",
    tags: ["Cashback", "Travel", "Fuel"],
    visual: "/assets/home/hero-banners/credit-card-rewards.png",
  },
  {
    _id: "fallback-insurance-offer",
    title: "Health and family protection plans",
    lenderName: "Fintaraa insurance partners",
    productCategory: "insurance",
    productType: "health-insurance",
    rateLabel: "Compare premium",
    amountLabel: "Family cover",
    badge: "Protection",
    description:
      "Review cover, premium, waiting periods, and claim support before buying.",
    ctaText: "Explore Cover",
    tags: ["Health", "Family", "Claims"],
    visual: "/assets/home/hero-banners/insurance-family-protection.png",
  },
];

const isLoggedIn = () => getAuthType() === "user" && Boolean(getAuthToken());

const normalizeOfferSearch = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const formatDate = (value?: string) => {
  if (!value) return "Limited period";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Limited period";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function OfferSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-[#e1ebf2] bg-white"
        >
          <div className="aspect-video bg-[#edf3f8]" />
          <div className="p-4 md:p-5">
            <div className="h-5 w-24 rounded-md bg-[#edf3f8]" />
            <div className="mt-4 h-6 w-4/5 rounded bg-[#edf3f8]" />
            <div className="mt-3 h-4 w-full rounded bg-[#edf3f8]" />
            <div className="mt-2 h-4 w-2/3 rounded bg-[#edf3f8]" />
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="h-14 rounded-md bg-[#edf3f8]" />
              <div className="h-14 rounded-md bg-[#edf3f8]" />
              <div className="h-14 rounded-md bg-[#edf3f8]" />
            </div>
            <div className="mt-5 h-10 rounded-md bg-[#edf3f8]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyOffers({
  onReset,
  searching,
}: {
  onReset: () => void;
  searching: boolean;
}) {
  return (
    <div className="mx-auto grid max-w-3xl gap-5 py-10 text-center">
      <div className="mx-auto h-28 w-28 overflow-hidden rounded-lg bg-[#eef6ff] p-3">
        <Image
          src="/assets/offers/offer.png"
          alt="Fintaraa offers and rewards"
          width={160}
          height={160}
          unoptimized
          className="h-full w-full object-contain"
        />
      </div>
      <h3 className="mt-5 text-[22px] font-extrabold text-[#111827]">
        {searching ? "No matching offers found" : "Offers are being refreshed"}
      </h3>
      <p className="mt-2 text-[15px] font-semibold leading-7 text-[#667085]">
        {searching
          ? "Try another bank, product, or benefit, or return to all current offers."
          : "Switch category or view the current featured offers. Bank and partner offers update automatically when new campaigns go live."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#075cde] px-5 text-[13px] font-extrabold text-white transition-colors hover:bg-[#064cb8]"
      >
        View all offers
      </button>
    </div>
  );
}

export function OffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState("");
  const [error, setError] = useState("");
  const [submittedApplication, setSubmittedApplication] = useState<{
    referenceId: string;
    referenceLabel: string;
  } | null>(null);
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  useEffect(() => {
    let active = true;
    const loadOffers = async () => {
      setLoading(true);
      setError("");
      try {
        const result = isLoggedIn()
          ? (await fetchEligibleOffers()).offers
          : await fetchPublicOffers({ limit: 60 });
        if (active) {
          setOffers(
            result.length || isLoggedIn() ? result : publicFallbackOffers,
          );
        }
      } catch (err) {
        if (active) {
          setError((err as Error).message || "Unable to load offers.");
          setOffers([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadOffers();
    return () => {
      active = false;
    };
  }, []);

  const filteredOffers = useMemo(() => {
    const words = normalizeOfferSearch(searchQuery).split(/\s+/).filter(Boolean);

    return offers.filter((offer) => {
      if (category !== "all" && offer.productCategory !== category) {
        return false;
      }
      if (!words.length) return true;

      const searchable = normalizeOfferSearch(
        [
          offer.title,
          offer.lenderName,
          offer.description,
          offer.productCategory,
          offer.productType,
          offer.badge,
          offer.rateLabel,
          offer.amountLabel,
          ...(offer.tags || []),
        ]
          .filter(Boolean)
          .join(" "),
      );

      return words.every((word) => searchable.includes(word));
    });
  }, [category, offers, searchQuery]);

  const handleApply = async (offer: OfferRecord) => {
    if (!isLoggedIn()) {
      router.push(
        buildLoginRedirectHref({
          redirectTo: "/offers",
          product: offer.productType || offer.productCategory || "offer",
        }),
      );
      return;
    }
    if (!whatsappConsent) {
      setError("Please accept WhatsApp communication consent before applying.");
      setSubmittedApplication(null);
      return;
    }
    setApplyingId(offer._id);
    setError("");
    setSubmittedApplication(null);
    try {
      const consentPayload = buildWebsiteConsentPayload("website_offers_page");
      const result = await applyForOffer(offer._id, {
        metadata: {
          ...consentPayload,
          productCategory: offer.productCategory,
          productType: offer.productType,
        },
      });
      const referenceId = result.applicationId || result.referenceId || "";
      if (!referenceId) {
        throw new Error(
          "Application was submitted, but its tracking ID was not returned.",
        );
      }
      setSubmittedApplication({
        referenceId,
        referenceLabel:
          offer.productCategory === "card"
            ? "Credit Card Application ID"
            : offer.productCategory === "insurance"
              ? "Insurance Reference ID"
              : "Loan Application ID",
      });
    } catch (err) {
      setError((err as Error).message || "Could not apply for this offer.");
    } finally {
      setApplyingId("");
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-white">
        <OffersHero
          offerCount={filteredOffers.length}
          query={searchQuery}
          onQueryChange={setSearchQuery}
        />
        <section className="px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-9xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
            >
              <div>
                <h2 className="max-w-2xl text-[27px] font-extrabold leading-tight text-[#102f49] sm:text-[31px] lg:text-[34px]">
                  Benefits selected for real financial needs
                </h2>
                <p className="mt-3 max-w-2xl text-[14px] font-medium leading-7 text-[#667f91] sm:text-[15px]">
                  Compare current value, validity, and key benefits before you
                  continue with an application.
                </p>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-bold text-[#7890a2]">
                  {loading
                    ? "Loading available offers"
                    : `${filteredOffers.length} ${
                        filteredOffers.length === 1 ? "offer" : "offers"
                      } available`}
                </p>
                <div
                  className="flex max-w-full gap-2 overflow-x-auto pb-1"
                  aria-label="Filter offers by category"
                >
                  {categories.map((item) => {
                    const CategoryIcon = item.icon;
                    return (
                      <motion.button
                        key={item.value}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCategory(item.value)}
                        className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-[12px] font-extrabold transition-colors sm:h-11 sm:px-4 ${
                          category === item.value
                            ? "border-[#075cde] bg-[#075cde] text-white"
                            : "border-[#d9e6ef] bg-white text-[#526e82] hover:border-[#9ec5db] hover:bg-[#f4f9fc] hover:text-[#075cde]"
                        }`}
                      >
                        <CategoryIcon className="h-4 w-4" aria-hidden="true" />
                        {item.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {submittedApplication ? (
              <div className="mt-6">
                <SubmissionSuccessNotice
                  message="Application submitted successfully. Our team will contact you shortly."
                  referenceId={submittedApplication.referenceId}
                  referenceLabel={submittedApplication.referenceLabel}
                />
              </div>
            ) : null}
            {error ? (
              <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-[13px] font-extrabold text-red-700">
                {error}
              </div>
            ) : null}

            <WhatsAppConsent
              checked={whatsappConsent}
              className="mt-6 max-w-3xl"
              onChange={(checked) => {
                setWhatsappConsent(checked);
                if (checked) setError("");
              }}
            />

            <div className="mt-8">
              {loading ? (
                <OfferSkeleton />
              ) : filteredOffers.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                  {filteredOffers.map((offer, index) => {
                  const meta =
                    categoryMeta[offer.productCategory || "loan"] ||
                    categoryMeta.loan;
                  const Icon = meta.icon;
                  const visual = (offer as OfferDisplayRecord).visual;
                  const highlights = [
                    {
                      label: "Rate",
                      value: offer.rateLabel || "Best rate",
                      icon: Percent,
                    },
                    {
                      label: "Value",
                      value: offer.amountLabel || "Flexible limit",
                      icon: WalletCards,
                    },
                    {
                      label: "Valid",
                      value: formatDate(offer.validTo),
                      icon: CalendarDays,
                    },
                  ];

                    return (
                      <motion.article
                      key={offer._id}
                      layout
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3 }}
                      viewport={{ once: true, amount: 0.12 }}
                      transition={{
                        duration: 0.42,
                        delay: Math.min(index * 0.05, 0.2),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#dce8f0] bg-white transition-colors hover:border-[#9fc8df]"
                    >
                      <div
                        className={`relative overflow-hidden bg-linear-to-br ${meta.surface}`}
                      >
                        <div className="relative aspect-16/8 min-h-30 sm:aspect-video">
                          {visual ? (
                            <Image
                              src={visual}
                              alt={offer.title}
                              fill
                              unoptimized
                              className="object-cover transition duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span
                                className={`inline-flex h-16 w-16 items-center justify-center rounded-lg ${meta.tone}`}
                              >
                                <Icon className="h-7 w-7" />
                              </span>
                            </div>
                          )}
                          <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2">
                            <span
                              className={`inline-flex h-7 max-w-38 items-center gap-1.5 rounded-md px-2.5 text-[10px] font-extrabold ${meta.chip}`}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{meta.label}</span>
                            </span>
                            <span className="inline-flex h-7 max-w-28 items-center rounded-md border border-white/80 bg-white/90 px-2.5 text-[10px] font-extrabold uppercase text-[#075cde] backdrop-blur">
                              <span className="truncate">
                                {offer.badge || "Active"}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-4 md:p-5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="min-w-0 truncate text-[12px] font-extrabold text-[#005ca8] md:text-[13px]">
                            {offer.lenderName}
                          </p>
                          <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-extrabold text-[#027a48]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#12b76a]" />
                            Live
                          </span>
                        </div>

                        <h3 className="mt-3 wrap-break-word text-[18px] font-extrabold leading-6 text-[#111827] md:text-[20px] md:leading-7">
                          {offer.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-[12px] font-semibold leading-5 text-[#667085] md:text-[13px] md:leading-6">
                          {offer.description ||
                            "Apply through Fintaraa and our team will help you with the next steps."}
                        </p>

                        <div className="my-4 grid grid-cols-3 border-y border-[#e7eef4] py-3">
                          {highlights.map((item) => {
                            const Metric = item.icon;
                            return (
                              <div
                                key={item.label}
                                className="min-w-0 border-r border-[#e7eef4] px-2 last:border-r-0"
                              >
                                <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase text-[#7a869a]">
                                  <Metric className="h-3.5 w-3.5 shrink-0 text-[#005ca8]" />
                                  <span className="truncate">{item.label}</span>
                                </div>
                                <p className="mt-1 min-h-8 text-[10.5px] font-extrabold leading-4 text-[#1f2937] md:text-[11px]">
                                  {item.value}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mb-4 flex flex-wrap gap-1.5 md:gap-2">
                          {(offer.tags || []).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="max-w-full truncate rounded-md bg-[#f3f7fb] px-2.5 py-1 text-[10.5px] font-bold text-[#667085] md:px-3 md:text-[11px]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApply(offer)}
                          disabled={applyingId === offer._id}
                          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#075cde] px-4 text-[13px] font-extrabold text-white transition-colors hover:bg-[#064cb8] disabled:cursor-not-allowed disabled:opacity-70 md:mt-auto"
                        >
                          {applyingId === offer._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <BadgeCheck className="h-4 w-4" />
                          )}
                          <span>{offer.ctaText || "Apply Now"}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                      </motion.article>
                    );
                  })}
                </div>
              ) : (
                <EmptyOffers
                  searching={Boolean(searchQuery.trim()) || category !== "all"}
                  onReset={() => {
                    setCategory("all");
                    setSearchQuery("");
                  }}
                />
              )}
            </div>
          </div>
        </section>
        <AppDownloadBanner />
      </main>
    </MotionConfig>
  );
}
