import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Filter,
  Landmark,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { slugifyProduct } from "@/lib/productRouting";
import { trustedPartners } from "@/data/trustedPartners";
import { loanProductDirectory } from "@/data/bankDirectory";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { getApplyHref } from "@/components/application/flowRegistry";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { BankProductOfferCard } from "@/components/eligibility/BankProductOfferCard";
import { LoadMoreResultGrid } from "@/components/eligibility/LoadMoreResultGrid";
import {
  fetchBankProducts,
  getBankProductApplyUrl,
  getInstantLoanBankApplyUrl,
  type BankProduct,
  type BankProductType,
} from "@/services/bankProducts";
import {
  loanTypeToLabel,
  loanTypeToSlug,
  searchEligibilityCriteria,
  type EligibilityCriteriaResult,
} from "@/services/eligibilityCriteria";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const baseLoanTypeOptions = loanProductDirectory.map((loan) => ({
  label: loan.name,
  value: loan.slug,
}));

const getLoanTypeOptions = (loanType: string) => {
  const normalizedLoanType = slugifyProduct(loanType || "personal-loan");
  return baseLoanTypeOptions.filter((option) => {
    if (option.value !== "instant-loan") return true;
    return ["personal-loan", "instant-loan"].includes(normalizedLoanType);
  });
};

const salaryTypeOptions = [
  "Salaried",
  "Self Employed",
  "Self Employed Professional",
];

const bankSlugAliases: Record<string, string> = {
  pnb: "punjab-national-bank",
  sbi: "sbi-card",
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Eligibility Results | Fintaraa",
  description:
    "Review indicative matches from active Fintaraa lending partners by loan type, amount, CIBIL score, tenure, and income profile.",
};

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const formatCurrency = (value?: number | null) => {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(Number(value))
  ) {
    return "-";
  }
  return `₹${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;
};

const formatPercent = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }
  return `${Number(value).toFixed(Number(value) % 1 === 0 ? 0 : 2)}%`;
};

const formatFee = (result: EligibilityCriteriaResult) => {
  if (result.processingFees === null || result.processingFees === undefined) {
    return "-";
  }
  return result.processingFeesType === "fixed"
    ? formatCurrency(result.processingFees)
    : formatPercent(result.processingFees);
};

const estimateMonthlyEmi = (
  principal: number,
  annualRate?: number | null,
  tenureYears?: number | null,
) => {
  if (!principal || !annualRate || !tenureYears) return null;
  const months = Math.max(1, Math.round(tenureYears * 12));
  const monthlyRate = annualRate / 1200;
  const growth = Math.pow(1 + monthlyRate, months);
  return Math.round((principal * monthlyRate * growth) / (growth - 1));
};

const resolveBank = (bankName: string) => {
  const rawSlug = slugifyProduct(bankName);
  const slug = bankSlugAliases[rawSlug] || rawSlug;
  const partner = trustedPartners.find(
    (item) => item.slug === slug || slugifyProduct(item.name) === rawSlug,
  );

  return {
    name: partner?.name || bankName,
    slug: partner?.slug || slug,
    logo: partner?.logo,
  };
};

const getApplyLink = (
  result: EligibilityCriteriaResult,
  productSlug?: string,
  bankProducts: BankProduct[] = [],
) => {
  const loanSlug = productSlug || loanTypeToSlug(result.loanType);
  const bank = resolveBank(result.bankName);
  const referrer = `/banks/${bank.slug}/${loanSlug}`;

  if (loanSlug === "instant-loan") {
    const bankProduct = bankProducts.find(
      (product) =>
        slugifyProduct(product.bankName) === slugifyProduct(result.bankName) ||
        resolveBank(product.bankName).slug === bank.slug,
    );
    return bankProduct
      ? getBankProductApplyUrl(bankProduct, referrer)
      : referrer;
  }

  return getApplyHref({
    category: "loan",
    productSlug: loanSlug,
    bankSlug: bank.slug,
    referrer,
  });
};

const ResultCard = ({
  result,
  requestedAmount,
  requestedTenureYears,
  productSlug,
  productLabel,
  bankProducts = [],
}: {
  result: EligibilityCriteriaResult;
  requestedAmount: number;
  requestedTenureYears: number;
  productSlug?: string;
  productLabel?: string;
  bankProducts?: BankProduct[];
}) => {
  const bankInfo = resolveBank(result.bankName);
  const loanSlug = productSlug || loanTypeToSlug(result.loanType);
  const resolvedProductLabel = productLabel || loanTypeToLabel(result.loanType);
  const indicativeAmount = Math.min(
    requestedAmount,
    result.maximumLoanAmount || requestedAmount,
  );
  const indicativeTenure = Math.min(
    requestedTenureYears,
    result.maxTenureYears || requestedTenureYears,
  );
  const estimatedEmi = estimateMonthlyEmi(
    indicativeAmount,
    result.roi,
    indicativeTenure,
  );
  const applyHref = getApplyLink(result, loanSlug, bankProducts);
  const isExternalApply = /^https?:\/\//i.test(applyHref);

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl bg-white p-5 sm:p-6 transition-all duration-200 border border-slate-200/80 hover:border-purple-300 hover:shadow-xl hover:-translate-y-0.5">
      <div>
        {/* Header: Bank Brand and Status */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <Link
            href={`/banks/${bankInfo.slug}/${loanSlug}`}
            className="flex min-w-0 items-center gap-3 no-underline group-hover:text-[#6424C7] transition-colors"
          >
            {bankInfo.logo ? (
              <BankLogoImage
                src={bankInfo.logo}
                alt={bankInfo.name}
                className="h-9 w-24 object-contain"
                imageClassName="object-left"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#6424C7] font-bold text-xs">
                <Landmark className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0">
              <span className="block truncate text-base font-bold text-slate-900 group-hover:text-[#6424C7] transition-colors">
                {result.bankName}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {resolvedProductLabel}
              </span>
            </div>
          </Link>

          {/* Minimalist Status Indicator */}
          {result.eligible ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Eligible
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 shrink-0">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
              Lender Review
            </span>
          )}
        </div>

        {/* Core Financial Metrics Matrix */}
        <div className="grid grid-cols-2 gap-3 py-4 text-xs sm:text-sm">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="block text-[11px] font-medium text-slate-500">Interest Rate</span>
            <span className="mt-0.5 block text-base font-extrabold text-[#6424C7]">
              {formatPercent(result.roi)} <span className="text-xs font-normal text-slate-500">p.a.</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="block text-[11px] font-medium text-slate-500">Estimated EMI</span>
            <span className="mt-0.5 block text-base font-extrabold text-slate-900">
              {estimatedEmi ? `${formatCurrency(estimatedEmi)}` : "-"}
              <span className="text-xs font-normal text-slate-500">/mo</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="block text-[11px] font-medium text-slate-500">Max Sanction</span>
            <span className="mt-0.5 block text-sm font-bold text-slate-900">
              {formatCurrency(indicativeAmount)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
            <span className="block text-[11px] font-medium text-slate-500">Tenure & Fee</span>
            <span className="mt-0.5 block text-xs font-semibold text-slate-800">
              {indicativeTenure} Yrs • {formatFee(result)}
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-2">
        {loanSlug === "instant-loan" ? (
          <a
            href={applyHref}
            target={isExternalApply ? "_blank" : undefined}
            rel={isExternalApply ? "noopener noreferrer" : undefined}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6424C7] hover:bg-[#521da8] text-sm font-semibold text-white transition-all shadow-md shadow-purple-900/10 hover:shadow-purple-700/20"
          >
            <span>{isExternalApply ? "Apply on Bank Portal" : "View Bank Offer"}</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <AuthRedirectLink
            href={applyHref}
            productSlug={loanSlug}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6424C7] hover:bg-[#521da8] text-sm font-semibold text-white transition-all shadow-md shadow-purple-900/10 hover:shadow-purple-700/20"
          >
            <span>Apply Now</span>
            <ArrowRight className="h-4 w-4" />
          </AuthRedirectLink>
        )}
      </div>
    </article>
  );
};

const ResultCardsSection = ({
  title,
  results,
  sectionKey,
  requestedAmount,
  requestedTenureYears,
  description,
  productSlug,
  productLabel,
  bankProducts,
}: {
  title: string;
  results: EligibilityCriteriaResult[];
  sectionKey: string;
  requestedAmount: number;
  requestedTenureYears: number;
  description?: string;
  productSlug?: string;
  productLabel?: string;
  bankProducts?: BankProduct[];
}) =>
  results.length > 0 ? (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {title} ({results.length})
          </h2>
          {description ? (
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              {description}
            </p>
          ) : null}
        </div>
        <LoadMoreResultGrid
          key={`${sectionKey}:${productSlug || "result"}:${results
            .map((result) => result._id)
            .join(",")}`}
        >
          {results.map((result, index) => (
            <ResultCard
              key={`${sectionKey}-${productSlug || result.loanType}-${result._id}-${index}`}
              result={result}
              requestedAmount={requestedAmount}
              requestedTenureYears={requestedTenureYears}
              productSlug={productSlug}
              productLabel={productLabel}
              bankProducts={bankProducts}
            />
          ))}
        </LoadMoreResultGrid>
      </div>
    </section>
  ) : null;

const sortBankProducts = (products: BankProduct[]) =>
  [...products].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    const priorityDifference =
      (a.priorityOrder ?? a.rank ?? 9999) - (b.priorityOrder ?? b.rank ?? 9999);
    if (priorityDifference !== 0) return priorityDifference;
    return a.name.localeCompare(b.name);
  });

const BankProductCardsSection = ({
  title,
  description,
  products,
  productType,
  emptyMessage,
}: {
  title: string;
  description: string;
  products: BankProduct[];
  productType: BankProductType;
  emptyMessage?: string;
}) => (
  <section className="py-6">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          {productType === "credit_card" ? (
            <CreditCard className="h-5 w-5 text-[#6424C7]" />
          ) : (
            <Zap className="h-5 w-5 text-[#6424C7]" />
          )}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          {description}
        </p>
      </div>

      {products.length > 0 ? (
        <LoadMoreResultGrid>
          {sortBankProducts(products).map((product, index) => {
            const bank = resolveBank(product.bankName);
            return (
              <BankProductOfferCard
                key={`${productType}-${product._id || product.id || index}`}
                product={product}
                productType={productType}
                fallbackHref={
                  productType === "credit_card"
                    ? "/credit-cards"
                    : `/banks/${bank.slug}/instant-loan`
                }
              />
            );
          })}
        </LoadMoreResultGrid>
      ) : emptyMessage ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-xs sm:text-sm text-slate-600">
          {emptyMessage}
        </div>
      ) : null}
    </div>
  </section>
);

const dedupeEligibilityResults = (items: EligibilityCriteriaResult[]) => {
  const seen = new Set<string>();
  return items.filter((result) => {
    const key =
      result._id ||
      [
        loanTypeToSlug(result.loanType),
        slugifyProduct(result.bankName),
        slugifyProduct(result.salaryType),
      ].join(":");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const buildInstantLoanFallbackProducts = (
  results: EligibilityCriteriaResult[],
) => {
  const seenBanks = new Set<string>();
  return results.flatMap((result) => {
    const bank = resolveBank(result.bankName);
    const bankKey = slugifyProduct(bank.name);
    if (!bankKey || seenBanks.has(bankKey)) return [];
    seenBanks.add(bankKey);

    return [
      {
        _id: `instant-loan-${bankKey}`,
        name: `${bank.name} Instant Personal Loan`,
        title: `${bank.name} Instant Personal Loan`,
        bankName: result.bankName,
        type: "loan",
        image: bank.logo || "",
        link:
          getInstantLoanBankApplyUrl(result.bankName) ||
          `/banks/${bank.slug}/instant-loan`,
        applyUrl: getInstantLoanBankApplyUrl(result.bankName),
        creditScoreRequirement: result.cibilScore,
        processingTime: "Digital lender journey",
        featuresList: (result.terms || [])
          .slice(0, 3)
          .map((term) => `${term.label}: ${term.value}`),
        rank: result.eligible ? 1 : 2,
      } satisfies BankProduct,
    ];
  });
};

const mergeInstantLoanProducts = (
  configured: BankProduct[],
  fallback: BankProduct[],
) => {
  const configuredBanks = new Set(
    configured.map((product) => slugifyProduct(product.bankName)),
  );
  return [
    ...configured,
    ...fallback.filter(
      (product) => !configuredBanks.has(slugifyProduct(product.bankName)),
    ),
  ];
};

export default async function EligibilityResultsPage({
  searchParams,
}: PageProps) {
  const query = await searchParams;
  const loanType = firstValue(query.loanType) || "personal-loan";
  const amount = firstValue(query.amount) || "1000000";
  const salaryType = firstValue(query.salaryType) || "Salaried";
  const monthlyIncome = firstValue(query.monthlyIncome) || "50000";
  const cibilScore = firstValue(query.cibilScore) || "720";
  const tenureYears = firstValue(query.tenureYears) || "5";
  const bank = firstValue(query.bank);
  const q = firstValue(query.q);
  const requestedLoanSlug = loanTypeToSlug(loanType);
  const isPersonalLoanFamily = ["personal-loan", "instant-loan"].includes(
    requestedLoanSlug,
  );
  const relatedLoanType =
    requestedLoanSlug === "instant-loan" ? "personal-loan" : "instant-loan";
  const commonSearchParams = {
    amount,
    salaryType,
    monthlyIncome,
    cibilScore,
    tenureYears,
    bank,
    q,
  };

  const [requestedData, relatedData, instantLoanProducts, creditCardProducts] =
    await Promise.all([
      searchEligibilityCriteria({
        ...commonSearchParams,
        loanType: requestedLoanSlug,
        limit: 50,
      }),
      isPersonalLoanFamily
        ? searchEligibilityCriteria({
            ...commonSearchParams,
            loanType: relatedLoanType,
            limit: 50,
          })
        : Promise.resolve(null),
      isPersonalLoanFamily
        ? fetchBankProducts("loan").catch(() => [])
        : Promise.resolve([]),
      isPersonalLoanFamily
        ? fetchBankProducts("credit_card").catch(() => [])
        : Promise.resolve([]),
    ]);

  const personalLoanData =
    requestedLoanSlug === "personal-loan"
      ? requestedData
      : requestedLoanSlug === "instant-loan"
        ? relatedData
        : null;
  const instantLoanData =
    requestedLoanSlug === "instant-loan"
      ? requestedData
      : requestedLoanSlug === "personal-loan"
        ? relatedData
        : null;
  const personalLoanResults = (personalLoanData?.results || []).filter(
    (result) => result.eligible,
  );
  const allPersonalLoanResults = dedupeEligibilityResults(
    personalLoanData?.results || [],
  );
  const effectiveInstantLoanProducts = mergeInstantLoanProducts(
    instantLoanProducts,
    buildInstantLoanFallbackProducts(allPersonalLoanResults),
  );
  const results = dedupeEligibilityResults(
    isPersonalLoanFamily
      ? [
          ...(instantLoanData?.results || []),
          ...(personalLoanData?.results || []),
        ]
      : requestedData.results || [],
  );
  const bestResults = isPersonalLoanFamily
    ? personalLoanResults
    : results.filter((result) => result.eligible);
  const otherPersonalLoanResults = allPersonalLoanResults;
  const nearResults = results.filter((result) => !result.eligible);
  const eligibleCount = results.filter((result) => result.eligible).length;
  const partnerCount = new Set(
    results.map((result) => slugifyProduct(result.bankName)),
  ).size;
  const loanLabel = loanTypeToLabel(requestedLoanSlug);
  const visibleLoanTypeOptions = getLoanTypeOptions(requestedLoanSlug);
  const numericAmount = Number(amount) || 0;
  const numericTenureYears = Number(tenureYears) || 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* ─── HERO HEADER SECTION ─── */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Link
                href="/#eligibility-check"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6424C7] hover:text-[#521da8] transition-colors mb-2"
              >
                <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                Back to Eligibility Calculator
              </Link>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                {requestedLoanSlug === "instant-loan"
                  ? "Instant & Personal Loan Eligibility Matches"
                  : `${loanLabel} Partner Matches`}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
                Real-time algorithmic matches based on active underwriting criteria of {partnerCount}+ institutional lenders.
              </p>
            </div>

            {/* Quick Metrics Summary Bar */}
            <div className="flex items-center gap-2 sm:gap-4 bg-purple-50/60 p-3 rounded-2xl border border-purple-100 shrink-0">
              <div className="px-3 border-r border-purple-200/60">
                <span className="block text-[10px] uppercase font-bold text-slate-500">Matching Lenders</span>
                <span className="text-lg font-extrabold text-[#6424C7]">{partnerCount}</span>
              </div>
              <div className="px-3 border-r border-purple-200/60">
                <span className="block text-[10px] uppercase font-bold text-slate-500">Indicative Sanctions</span>
                <span className="text-lg font-extrabold text-emerald-700">{eligibleCount}</span>
              </div>
              <div className="px-3">
                <span className="block text-[10px] uppercase font-bold text-slate-500">Your CIBIL</span>
                <span className="text-lg font-extrabold text-slate-900">{cibilScore}</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <form
            action="/eligibility-results"
            className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200"
          >
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Loan Type
              </label>
              <select
                name="loanType"
                defaultValue={requestedLoanSlug}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#6424C7] focus:ring-1 focus:ring-[#6424C7]"
              >
                {visibleLoanTypeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Amount (₹)
              </label>
              <input
                name="amount"
                defaultValue={amount}
                inputMode="numeric"
                min={1}
                required
                type="number"
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#6424C7] focus:ring-1 focus:ring-[#6424C7]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Monthly Income (₹)
              </label>
              <input
                name="monthlyIncome"
                defaultValue={monthlyIncome}
                inputMode="numeric"
                min={0}
                required
                type="number"
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#6424C7] focus:ring-1 focus:ring-[#6424C7]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                CIBIL Score
              </label>
              <input
                name="cibilScore"
                defaultValue={cibilScore}
                inputMode="numeric"
                max={900}
                min={300}
                required
                type="number"
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#6424C7] focus:ring-1 focus:ring-[#6424C7]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Profile
              </label>
              <select
                name="salaryType"
                defaultValue={salaryType}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#6424C7] focus:ring-1 focus:ring-[#6424C7]"
              >
                {salaryTypeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tenure (Yrs)
              </label>
              <input
                name="tenureYears"
                defaultValue={tenureYears}
                inputMode="numeric"
                min={1}
                max={30}
                required
                type="number"
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-[#6424C7] focus:ring-1 focus:ring-[#6424C7]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-10 rounded-xl bg-[#6424C7] hover:bg-[#521da8] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-900/10"
              >
                <Search className="h-3.5 w-3.5" />
                Update
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ─── SECTION 2: RESULTS CARDS SECTION ─── */}
      {requestedLoanSlug === "instant-loan" ? (
        <>
          <BankProductCardsSection
            title="Instant Loan Partner Offers"
            description="Verified digital loan offers with direct lender sanction journey."
            products={effectiveInstantLoanProducts}
            productType="loan"
            emptyMessage="No instant-loan partner offers are active for these specific parameters. Compare the personal loan matches below."
          />
          <ResultCardsSection
            title="Other Personal Loan Options"
            description="Lender-verified personal loan options ranked for your monthly income profile."
            results={otherPersonalLoanResults}
            sectionKey="personal-alternatives"
            requestedAmount={numericAmount}
            requestedTenureYears={numericTenureYears}
            productSlug="personal-loan"
            productLabel="Personal Loan"
          />
          <BankProductCardsSection
            title="Credit Cards from Partner Banks"
            description="Pre-approved credit cards matching your credit profile."
            products={creditCardProducts}
            productType="credit_card"
            emptyMessage="No credit card products available right now."
          />
        </>
      ) : requestedLoanSlug === "personal-loan" ? (
        <>
          <ResultCardsSection
            title="Best Personal Loan Matches"
            results={bestResults}
            sectionKey="best-personal"
            requestedAmount={numericAmount}
            requestedTenureYears={numericTenureYears}
            productSlug="personal-loan"
            productLabel="Personal Loan"
          />
          <BankProductCardsSection
            title="Instant Digital Loan Offers"
            description="Fast digital loan sanction programs from partner institutions."
            products={effectiveInstantLoanProducts}
            productType="loan"
            emptyMessage="No active instant-loan offers currently match these parameters."
          />
          <BankProductCardsSection
            title="Recommended Credit Cards"
            description="Exclusive reward and cashback credit cards matching your eligibility."
            products={creditCardProducts}
            productType="credit_card"
            emptyMessage="No active credit card offers found."
          />
        </>
      ) : (
        <ResultCardsSection
          title="Best Loan Matches"
          results={bestResults}
          sectionKey="best"
          requestedAmount={numericAmount}
          requestedTenureYears={numericTenureYears}
        />
      )}

      {eligibleCount === 0 && nearResults.length > 0 ? (
        <ResultCardsSection
          sectionKey="near"
          results={nearResults}
          title="Closest Partner Options"
          requestedAmount={numericAmount}
          bankProducts={effectiveInstantLoanProducts}
          requestedTenureYears={numericTenureYears}
          description="These active options are closest to your criteria. Final approval may require additional documentation or co-applicant."
        />
      ) : null}

      {results.length === 0 ? (
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 text-center bg-white p-8 rounded-2xl border border-slate-200">
            <AlertCircle className="mx-auto h-8 w-8 text-amber-500 mb-3" />
            <h2 className="text-lg font-bold text-slate-900">
              No Direct Matches Found
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-md mx-auto">
              Try adjusting your requested amount, tenure, or loan type to discover additional lending partner programs.
            </p>
          </div>
        </section>
      ) : null}

      {/* ─── SECTION 3: DETAILED ACCORDION MATRIX ─── */}
      {results.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <details className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-bold text-slate-900 hover:bg-slate-50 transition-colors marker:content-none">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#6424C7]" />
                Detailed Partner Underwriting Comparison ({results.length} Institutions)
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-[#6424C7] transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-slate-100 p-6 overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-3.5 font-semibold rounded-l-lg">Lender</th>
                    <th className="p-3.5 font-semibold">Match Status</th>
                    <th className="p-3.5 font-semibold">Rate & Max Limit</th>
                    <th className="p-3.5 font-semibold">Underwriting Checks</th>
                    <th className="p-3.5 font-semibold">Fees & Charges</th>
                    <th className="p-3.5 font-semibold text-center rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((result) => {
                    const bankInfo = resolveBank(result.bankName);
                    const loanSlug = loanTypeToSlug(result.loanType);
                    const applyHref = getApplyLink(
                      result,
                      undefined,
                      effectiveInstantLoanProducts,
                    );
                    const isInstantLoan = loanSlug === "instant-loan";
                    const isExternalApply = /^https?:\/\//i.test(applyHref);
                    return (
                      <tr key={result._id} className="hover:bg-purple-50/30 transition-colors">
                        <td className="p-4 font-bold text-slate-900">
                          <Link
                            href={`/banks/${bankInfo.slug}/${loanSlug}`}
                            className="flex items-center gap-2.5 no-underline"
                          >
                            {bankInfo.logo ? (
                              <BankLogoImage
                                src={bankInfo.logo}
                                alt={bankInfo.name}
                                className="h-7 w-20 object-contain"
                                imageClassName="object-left"
                              />
                            ) : (
                              <Landmark className="h-4 w-4 text-[#6424C7]" />
                            )}
                            <span className="truncate">{result.bankName}</span>
                          </Link>
                          <div className="text-[11px] font-normal text-slate-500 mt-1">
                            {loanTypeToLabel(result.loanType)} • {result.salaryType}
                          </div>
                        </td>

                        <td className="p-4">
                          {result.eligible ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                              <CheckCircle2 className="w-3 h-3" /> Eligible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                              <AlertCircle className="w-3 h-3" /> Review
                            </span>
                          )}
                        </td>

                        <td className="p-4 font-medium text-slate-800">
                          <div className="font-bold text-[#6424C7]">{formatPercent(result.roi)} p.a.</div>
                          <div className="text-slate-600">{formatCurrency(result.maximumLoanAmount)}</div>
                          <div className="text-[11px] text-slate-400">Up to {result.maxTenureYears || "-"} Yrs</div>
                        </td>

                        <td className="p-4 space-y-1">
                          {result.checks.map((check) => (
                            <div
                              key={`${result._id}-${check.label}`}
                              className="flex items-center gap-1.5 text-[11px]"
                            >
                              {check.passed ? (
                                <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                              )}
                              <span className="text-slate-700">
                                <strong>{check.label}:</strong> {check.provided} / {check.requirement}
                              </span>
                            </div>
                          ))}
                        </td>

                        <td className="p-4 text-slate-600">
                          <div>Fee: {formatFee(result)}</div>
                          {result.loginFees && <div className="text-[11px]">Login: {result.loginFees}</div>}
                        </td>

                        <td className="p-4 text-center">
                          {isInstantLoan ? (
                            <a
                              href={applyHref}
                              target={isExternalApply ? "_blank" : undefined}
                              rel={isExternalApply ? "noopener noreferrer" : undefined}
                              className="inline-flex px-3 py-1.5 rounded-lg bg-[#6424C7] hover:bg-[#521da8] text-white text-xs font-semibold transition-all shadow-sm"
                            >
                              Apply
                            </a>
                          ) : (
                            <AuthRedirectLink
                              href={applyHref}
                              productSlug={loanSlug}
                              className="inline-flex px-3 py-1.5 rounded-lg bg-[#6424C7] hover:bg-[#521da8] text-white text-xs font-semibold transition-all shadow-sm"
                            >
                              Apply
                            </AuthRedirectLink>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      ) : null}
    </main>
  );
}
