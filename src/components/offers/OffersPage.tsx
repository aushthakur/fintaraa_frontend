"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
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

const categories = [
  { label: "All Offers", value: "all" },
  { label: "Loans", value: "loan" },
  { label: "Credit Cards", value: "card" },
  { label: "Insurance", value: "insurance" },
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
          className="overflow-hidden rounded-2xl border border-[#e5edf6] bg-white shadow-[0_16px_40px_rgba(16,24,40,0.05)]"
        >
          <div className="aspect-video bg-[#edf3f8]" />
          <div className="p-4 md:p-5">
            <div className="h-5 w-24 rounded-full bg-[#edf3f8]" />
            <div className="mt-4 h-6 w-4/5 rounded bg-[#edf3f8]" />
            <div className="mt-3 h-4 w-full rounded bg-[#edf3f8]" />
            <div className="mt-2 h-4 w-2/3 rounded bg-[#edf3f8]" />
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="h-14 rounded-xl bg-[#edf3f8]" />
              <div className="h-14 rounded-xl bg-[#edf3f8]" />
              <div className="h-14 rounded-xl bg-[#edf3f8]" />
            </div>
            <div className="mt-5 h-10 rounded-xl bg-[#edf3f8]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyOffers({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto grid max-w-3xl gap-5 py-10 text-center">
      <div className="mx-auto h-28 w-28 overflow-hidden rounded-2xl bg-[#eef6ff] p-3">
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
        Offers are being refreshed
      </h3>
      <p className="mt-2 text-[15px] font-semibold leading-7 text-[#667085]">
        Switch category or view the current featured offers. Bank and partner
        offers update automatically when new campaigns go live.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#005ca8] px-5 text-[13px] font-extrabold text-white"
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
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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

  const filteredOffers = useMemo(
    () =>
      category === "all"
        ? offers
        : offers.filter((offer) => offer.productCategory === category),
    [category, offers],
  );

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
      setMessage("");
      return;
    }
    setApplyingId(offer._id);
    setError("");
    setMessage("");
    try {
      const consentPayload = buildWebsiteConsentPayload("website_offers_page");
      await applyForOffer(offer._id, {
        metadata: {
          ...consentPayload,
          productCategory: offer.productCategory,
          productType: offer.productType,
        },
      });
      setMessage(
        "Offer application recorded. Our team will contact you shortly.",
      );
    } catch (err) {
      setError((err as Error).message || "Could not apply for this offer.");
    } finally {
      setApplyingId("");
    }
  };

  return (
    <main className="bg-white">
      <OffersHero />
      <section className="px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#eef6ff] px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#005ca8]">
                <Sparkles className="h-4 w-4" />
                Live partner offers
              </p>
              <h2 className="mt-4 text-[28px] font-extrabold tracking-[-0.02em] text-[#111827] md:text-[36px]">
                Exclusive offers matched to your profile
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] font-semibold leading-7 text-[#667085]">
                Browse active loan, card, and insurance offers managed from the
                admin panel.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value)}
                  className={`h-11 rounded-full px-5 text-[13px] font-extrabold transition ${
                    category === item.value
                      ? "bg-[#005ca8] text-white shadow-[0_12px_26px_rgba(0,92,168,0.18)]"
                      : "bg-[#f3f7fb] text-[#475467] hover:bg-[#e8f1fb]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {message ? (
            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-[#ecfdf3] px-4 py-3 text-[13px] font-extrabold text-[#027a48]">
              <CheckCircle2 className="h-4 w-4" />
              {message}
            </div>
          ) : null}
          {error ? (
            <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-[13px] font-extrabold text-red-700">
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
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-5">
                {filteredOffers.map((offer) => {
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
                    <div
                      key={offer._id}
                      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#dfeaf5] bg-white shadow-[0_16px_42px_rgba(16,24,40,0.06)] transition hover:-translate-y-0.5 hover:border-[#bdd8ef] hover:shadow-[0_22px_60px_rgba(16,24,40,0.1)]"
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
                                className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${meta.tone}`}
                              >
                                <Icon className="h-7 w-7" />
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-[#061528]/70 via-[#061528]/10 to-transparent" />
                          <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2">
                            <span
                              className={`inline-flex h-7 max-w-38 items-center gap-1.5 rounded-full px-2.5 text-[10px] font-extrabold ${meta.chip}`}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{meta.label}</span>
                            </span>
                            <span className="inline-flex h-7 max-w-28 items-center rounded-full bg-white/90 px-2.5 text-[10px] font-extrabold uppercase tracking-wide text-[#005ca8] backdrop-blur">
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
                          <span className="shrink-0 rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[10px] font-extrabold text-[#027a48]">
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

                        <div className="my-4 grid grid-cols-3 gap-1.5 rounded-2xl border border-[#edf3f8] bg-[#fbfdff] p-1.5">
                          {highlights.map((item) => {
                            const Metric = item.icon;
                            return (
                              <div
                                key={item.label}
                                className="min-w-0 rounded-xl bg-white px-2 py-2 shadow-[0_4px_14px_rgba(16,24,40,0.03)]"
                              >
                                <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide text-[#7a869a]">
                                  <Metric className="h-3.5 w-3.5 shrink-0 text-[#005ca8]" />
                                  <span className="truncate">{item.label}</span>
                                </div>
                                <p className="mt-1 line-clamp-1 text-[10.5px] font-extrabold leading-4 text-[#1f2937] md:text-[11px]">
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
                              className="max-w-full truncate rounded-full bg-[#f3f7fb] px-2.5 py-1 text-[10.5px] font-bold text-[#667085] md:px-3 md:text-[11px]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApply(offer)}
                          disabled={applyingId === offer._id}
                          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#005ca8] px-4 text-[13px] font-extrabold text-white transition hover:bg-[#004b93] disabled:cursor-not-allowed disabled:opacity-70 md:mt-auto"
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
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyOffers onReset={() => setCategory("all")} />
            )}
          </div>
        </div>
      </section>
      <AppDownloadBanner />
    </main>
  );
}
