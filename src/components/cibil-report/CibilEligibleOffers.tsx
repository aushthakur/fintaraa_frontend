"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Landmark,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { trustedPartners } from "@/data/trustedPartners";
import { slugifyProduct } from "@/lib/productRouting";
import {
  fetchBankProducts,
  getBankProductApplyUrl,
  getInstantLoanBankApplyUrl,
  type BankProduct,
} from "@/services/bankProducts";
import {
  fetchEligibleOffers,
  fetchScoreEligibility,
  type OfferRecord,
  type ScoreEligibilityResult,
} from "@/services/offers";

type LoanTypeMatch = {
  slug: string;
  label: string;
  configured: boolean;
};

type BankMatch = {
  key: string;
  bankName: string;
  loanSlug: string;
  loanLabel: string;
  minCibil?: number;
  rateLabel?: string;
  amountLabel?: string;
  href: string;
};

const loanTypeLabels: Record<string, string> = {
  "personal-loan": "Personal Loan",
  "instant-loan": "Instant Loan",
  "home-loan": "Home Loan",
  "business-loan": "Business Loan",
  "vehicle-loan": "Vehicle Loan",
  "car-loan": "Car Loan",
  "education-loan": "Education Loan",
  "gold-loan": "Gold Loan",
  "loan-against-property": "Loan Against Property",
  "loan-against-security": "Loan Against Security",
};

const loanSlug = (value: unknown) => {
  const slug = slugifyProduct(
    String(value || "").replace(/([a-z])([A-Z])/g, "$1 $2"),
  );
  if (slug.includes("instant") && slug.includes("loan")) return "instant-loan";
  if (slug === "personal" || slug.includes("personal-loan")) {
    return "personal-loan";
  }
  return slug;
};

const loanLabel = (slug: string) =>
  loanTypeLabels[slug] ||
  slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const fallbackLoanTypes = (score: number) => {
  if (score >= 750) {
    return [
      "personal-loan",
      "instant-loan",
      "home-loan",
      "business-loan",
      "vehicle-loan",
      "education-loan",
      "gold-loan",
      "loan-against-property",
    ];
  }
  if (score >= 700) {
    return [
      "personal-loan",
      "instant-loan",
      "home-loan",
      "vehicle-loan",
      "gold-loan",
      "loan-against-property",
    ];
  }
  if (score >= 650) {
    return [
      "personal-loan",
      "instant-loan",
      "gold-loan",
      "loan-against-property",
      "loan-against-security",
    ];
  }
  if (score > 0) return ["gold-loan", "loan-against-security"];
  return [];
};

const numericScoreRequirement = (value: unknown) => {
  const match = String(value ?? "").match(/\b([3-9]\d{2})\b/);
  const parsed = match ? Number(match[1]) : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const bankDetails = (bankName: string) => {
  const normalized = slugifyProduct(bankName);
  const partner = trustedPartners.find(
    (item) =>
      item.slug === normalized || slugifyProduct(item.name) === normalized,
  );
  return {
    name: partner?.name || bankName,
    slug: partner?.slug || normalized,
    logo: partner?.logo,
  };
};

const eligibilityHref = (slug: string, score: number, bankName?: string) => {
  const params = new URLSearchParams({
    loanType: slug,
    cibilScore: String(score),
  });
  if (bankName) params.set("bank", bankName);
  return `/eligibility-results?${params.toString()}`;
};

const buildBankMatches = ({
  score,
  criteria,
  offers,
  instantProducts,
}: {
  score: number;
  criteria: ScoreEligibilityResult[];
  offers: OfferRecord[];
  instantProducts: BankProduct[];
}) => {
  if (score <= 0) return [];

  const matches: BankMatch[] = criteria
    .filter((result) => result.eligible && result.bankName)
    .map((result) => {
      const slug = loanSlug(result.loanType);
      return {
        key: `criteria:${result._id}`,
        bankName: result.bankName,
        loanSlug: slug,
        loanLabel: loanLabel(slug),
        minCibil: result.cibilScore,
        rateLabel: result.roi ? `${result.roi}% p.a.` : undefined,
        amountLabel: result.maximumLoanAmount
          ? `Up to Rs ${Number(result.maximumLoanAmount).toLocaleString("en-IN")}`
          : undefined,
        href: eligibilityHref(slug, score, result.bankName),
      };
    });

  offers
    .filter(
      (offer) =>
        offer.lenderName &&
        (offer.productCategory === "loan" ||
          (!offer.productCategory &&
            !["insurance", "card", "credit_card"].includes(
              String(offer.productType || "").toLowerCase(),
            ))),
    )
    .forEach((offer) => {
      const slug = loanSlug(offer.productType || "personal-loan");
      matches.push({
        key: `offer:${offer._id}`,
        bankName: offer.lenderName,
        loanSlug: slug,
        loanLabel: loanLabel(slug),
        rateLabel: offer.rateLabel,
        amountLabel: offer.amountLabel,
        href: "/offers",
      });
    });

  instantProducts.forEach((product, index) => {
    const requiredScore = numericScoreRequirement(
      product.creditScoreRequirement,
    );
    if (requiredScore && score < requiredScore) return;
    matches.push({
      key: `instant:${product._id || product.id || index}`,
      bankName: product.bankName,
      loanSlug: "instant-loan",
      loanLabel: "Instant Loan",
      minCibil: requiredScore,
      rateLabel: product.processingTime || "Digital application",
      href: getBankProductApplyUrl(
        product,
        eligibilityHref("instant-loan", score, product.bankName),
      ),
    });
  });

  const personalMatches = matches.filter(
    (match) => match.loanSlug === "personal-loan",
  );
  personalMatches.forEach((match) => {
    const hasInstantMatch = matches.some(
      (candidate) =>
        candidate.loanSlug === "instant-loan" &&
        slugifyProduct(candidate.bankName) === slugifyProduct(match.bankName),
    );
    if (hasInstantMatch) return;
    matches.push({
      ...match,
      key: `instant-fallback:${match.key}`,
      loanSlug: "instant-loan",
      loanLabel: "Instant Loan",
      rateLabel: "Digital lender journey",
      href:
        getInstantLoanBankApplyUrl(match.bankName) ||
        eligibilityHref("instant-loan", score, match.bankName),
    });
  });

  const seen = new Set<string>();
  const uniqueMatches = matches.filter((match) => {
    const key = `${slugifyProduct(match.bankName)}:${match.loanSlug}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const priority = ["personal-loan", "instant-loan"];
  return uniqueMatches.sort((left, right) => {
    const leftIndex = priority.indexOf(left.loanSlug);
    const rightIndex = priority.indexOf(right.loanSlug);
    return (leftIndex < 0 ? 999 : leftIndex) -
      (rightIndex < 0 ? 999 : rightIndex);
  });
};

export function CibilEligibleOffers({ score = 0 }: { score?: number }) {
  const [criteria, setCriteria] = useState<ScoreEligibilityResult[]>([]);
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [instantProducts, setInstantProducts] = useState<BankProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      const [criteriaResult, offerResult, instantResult] =
        await Promise.allSettled([
          score > 0
            ? fetchScoreEligibility(score)
            : Promise.resolve({ total: 0, eligibleCount: 0, results: [] }),
          fetchEligibleOffers(),
          fetchBankProducts("loan"),
        ]);
      if (!active) return;

      if (criteriaResult.status === "fulfilled") {
        setCriteria(criteriaResult.value.results || []);
      }
      if (offerResult.status === "fulfilled") {
        setOffers(offerResult.value.offers || []);
      }
      if (instantResult.status === "fulfilled") {
        setInstantProducts(instantResult.value || []);
      }
      if (
        criteriaResult.status === "rejected" &&
        offerResult.status === "rejected" &&
        instantResult.status === "rejected"
      ) {
        setError("Partner eligibility could not be loaded right now.");
      }
      setLoading(false);
    };
    void load();
    return () => {
      active = false;
    };
  }, [score]);

  const eligibleCriteria = useMemo(
    () => criteria.filter((result) => result.eligible),
    [criteria],
  );
  const bankMatches = useMemo(
    () =>
      buildBankMatches({
        score,
        criteria,
        offers,
        instantProducts,
      }),
    [criteria, instantProducts, offers, score],
  );
  const loanTypes = useMemo(() => {
    const configured = new Set<string>();
    eligibleCriteria.forEach((result) => configured.add(loanSlug(result.loanType)));
    offers
      .filter((offer) => offer.productCategory === "loan")
      .forEach((offer) => configured.add(loanSlug(offer.productType || "personal-loan")));
    bankMatches.forEach((match) => configured.add(match.loanSlug));

    if (configured.has("personal-loan") || configured.has("instant-loan")) {
      configured.add("personal-loan");
      configured.add("instant-loan");
    }

    const fallbacks = fallbackLoanTypes(score);
    const values = configured.size ? Array.from(configured) : fallbacks;
    const order = ["personal-loan", "instant-loan", ...fallbacks];
    return Array.from(new Set(values))
      .filter(Boolean)
      .sort((left, right) => {
        const leftIndex = order.indexOf(left);
        const rightIndex = order.indexOf(right);
        return (leftIndex < 0 ? 999 : leftIndex) -
          (rightIndex < 0 ? 999 : rightIndex);
      })
      .map(
        (slug): LoanTypeMatch => ({
          slug,
          label: loanLabel(slug),
          configured: configured.has(slug),
        }),
      );
  }, [bankMatches, eligibleCriteria, offers, score]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="border-y border-[#dce9f1] bg-[#f5f9fc] px-4 py-12 md:px-6 md:py-14 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-[#cfe2ee] bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#5b21b6]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              CIBIL-based matching
            </p>
            <h2 className="mt-4 text-[27px] font-extrabold leading-tight tracking-[-0.02em] text-[#3b0764] sm:text-[32px]">
              Loan eligibility for your credit score
            </h2>
            <p className="mt-2 max-w-3xl text-[14px] font-medium text-[#667f91]">
              Indicative loan types and active partner-bank criteria matched to
              your CIBIL score of{" "}
              <span className="font-extrabold text-[#254e69]">
                {score || "not available"}
              </span>
              . Final approval remains subject to the lender&apos;s complete
              assessment.
            </p>
          </motion.div>

          {loading ? (
            <div className="mt-7 flex min-h-44 items-center justify-center gap-2 rounded-2xl border border-[#cddfe9] bg-white text-[12px] font-bold text-[#526e82]">
              <Loader2 className="h-4 w-4 animate-spin text-[#5b21b6]" />
              Matching loan types and partner banks...
            </div>
          ) : (
            <>
              <div className="mt-7 rounded-2xl border border-[#cddfe9] bg-white p-5 shadow-[0_12px_34px_rgba(30,74,102,0.065)]">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-[#5b21b6]" />
                  <h3 className="text-[16px] font-extrabold text-[#3b0764]">
                    Loan types indicated by your score
                  </h3>
                </div>
                {loanTypes.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {loanTypes.map((loan) => (
                      <Link
                        key={loan.slug}
                        href={eligibilityHref(loan.slug, score)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#cfe2ee] bg-[#f7fbfe] px-3.5 py-2.5 text-[12px] font-extrabold text-[#5b21b6] no-underline hover:border-[#5b21b6]"
                      >
                        {loan.slug === "instant-loan" ? (
                          <Zap className="h-4 w-4" />
                        ) : (
                          <Landmark className="h-4 w-4" />
                        )}
                        {loan.label}
                        {!loan.configured ? (
                          <span className="text-[9px] font-bold text-[#7890a2]">
                            Score guide
                          </span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-[12px] font-semibold text-[#7890a2]">
                    A valid saved CIBIL score is needed to calculate loan-type
                    matches.
                  </p>
                )}
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[20px] font-extrabold text-[#3b0764]">
                    Partner banks for these loan types
                  </h3>
                  {bankMatches.length ? (
                    <span className="rounded-full bg-[#e9f8ef] px-3 py-1 text-[10px] font-extrabold text-[#168447]">
                      {bankMatches.length} indicative matches
                    </span>
                  ) : null}
                </div>

                {bankMatches.length ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {bankMatches.slice(0, 12).map((match, index) => {
                      const bank = bankDetails(match.bankName);
                      const external = /^https?:\/\//i.test(match.href);
                      return (
                        <motion.article
                          key={match.key}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.15 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className="rounded-2xl border border-[#d8e6ee] bg-white p-4"
                        >
                          <div className="flex items-start gap-3">
                            {bank.logo ? (
                              <BankLogoImage
                                src={bank.logo}
                                alt={bank.name}
                                className="h-10 w-20 shrink-0"
                                imageClassName="object-left"
                              />
                            ) : (
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f3fb] text-[#5b21b6]">
                                <Landmark className="h-5 w-5" />
                              </span>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[14px] font-extrabold text-[#3b0764]">
                                {bank.name}
                              </p>
                              <span className="mt-1 inline-flex rounded-full bg-[#edf6fc] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#5b21b6]">
                                {match.loanLabel}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                            <div className="rounded-lg bg-[#f7fafc] px-3 py-2">
                              <p className="font-bold text-[#8ca0af]">CIBIL</p>
                              <p className="mt-0.5 font-extrabold text-[#254e69]">
                                {match.minCibil ? `${match.minCibil}+` : "Profile based"}
                              </p>
                            </div>
                            <div className="rounded-lg bg-[#f7fafc] px-3 py-2">
                              <p className="font-bold text-[#8ca0af]">Rate / journey</p>
                              <p className="mt-0.5 truncate font-extrabold text-[#254e69]">
                                {match.rateLabel || "Partner terms"}
                              </p>
                            </div>
                          </div>
                          <a
                            href={match.href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#5b21b6] px-4 text-[11px] font-extrabold text-white no-underline hover:bg-[#4c1d95]"
                          >
                            Check full eligibility
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </motion.article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-[#f1d8a8] bg-[#fffaf0] px-5 py-7 text-center">
                    <AlertTriangle className="mx-auto h-7 w-7 text-[#b45309]" />
                    <h4 className="mt-3 text-[16px] font-extrabold text-[#3b0764]">
                      No bank-specific match is available right now
                    </h4>
                    <p className="mx-auto mt-2 max-w-2xl text-[12px] font-semibold leading-5 text-[#7890a2]">
                      Your score-based loan-type guidance is shown above, so
                      this section never remains blank. Partner banks will
                      appear automatically when active criteria match your
                      profile.
                    </p>
                    {error ? (
                      <p className="mt-2 text-[11px] font-bold text-[#b45309]">
                        {error}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {loanTypes.slice(0, 2).map((loan) => (
                        <Link
                          key={`fallback-${loan.slug}`}
                          href={eligibilityHref(loan.slug, score)}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e4bd70] bg-white px-4 text-[11px] font-extrabold text-[#8a5600] no-underline"
                        >
                          Check {loan.label}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
