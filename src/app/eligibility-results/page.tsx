import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  AlertTriangle,
  BadgeIndianRupee,
  Search,
  Landmark,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { slugifyProduct } from "@/lib/productRouting";
import { trustedPartners } from "@/data/trustedPartners";
import { loanProductDirectory } from "@/data/bankDirectory";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { getApplyHref } from "@/components/application/flowRegistry";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
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
  return `Rs ${new Intl.NumberFormat("en-IN", {
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
  if (
    result.processingFees === null ||
    result.processingFees === undefined
  ) {
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

const getApplyLink = (result: EligibilityCriteriaResult) => {
  const loanSlug = loanTypeToSlug(result.loanType);
  const bank = resolveBank(result.bankName);
  const referrer = `/banks/${bank.slug}/${loanSlug}`;
  return getApplyHref({
    category: "loan",
    productSlug: loanSlug,
    bankSlug: bank.slug,
    referrer,
  });
};

const ResultStatus = ({ result }: { result: EligibilityCriteriaResult }) =>
  result.eligible ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eafaf1] px-3 py-1 text-[12px] font-extrabold text-[#168447]">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Indicative match
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7ed] px-3 py-1 text-[12px] font-extrabold text-[#b45309]">
      <AlertTriangle className="h-3.5 w-3.5" />
      Needs lender review
    </span>
  );

const ResultCard = ({
  result,
  requestedAmount,
  requestedTenureYears,
}: {
  result: EligibilityCriteriaResult;
  requestedAmount: number;
  requestedTenureYears: number;
}) => {
  const bankInfo = resolveBank(result.bankName);
  const loanSlug = loanTypeToSlug(result.loanType);
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

  return (
    <article className="overflow-hidden rounded-2xl bg-[#f8fbff] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <Link
          href={`/banks/${bankInfo.slug}/${loanSlug}`}
          className="flex min-w-0 items-center gap-3 no-underline"
        >
          {bankInfo.logo ? (
            <BankLogoImage
              src={bankInfo.logo}
              alt={bankInfo.name}
              className="h-9 w-24"
              imageClassName="object-left"
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#00529b]">
              <Landmark className="h-5 w-5" />
            </span>
          )}
          <span className="truncate text-[16px] font-extrabold text-[#07162d]">
            {result.bankName}
          </span>
        </Link>
        <span className="self-start">
          <ResultStatus result={result} />
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-[13px]">
        <div>
          <dt className="font-bold text-[#7a8699]">Interest rate</dt>
          <dd className="mt-1 font-extrabold text-[#07162d]">
            {formatPercent(result.roi)} p.a.
          </dd>
        </div>
        <div>
          <dt className="font-bold text-[#7a8699]">Indicative amount</dt>
          <dd className="mt-1 font-extrabold text-[#07162d]">
            {formatCurrency(indicativeAmount)}
          </dd>
        </div>
        <div>
          <dt className="font-bold text-[#7a8699]">Estimated EMI</dt>
          <dd className="mt-1 font-extrabold text-[#07162d]">
            {estimatedEmi ? `${formatCurrency(estimatedEmi)}/mo` : "-"}
          </dd>
        </div>
        <div>
          <dt className="font-bold text-[#7a8699]">Tenure & fee</dt>
          <dd className="mt-1 font-extrabold text-[#07162d]">
            {indicativeTenure || "-"} years · {formatFee(result)}
          </dd>
        </div>
      </dl>
      <AuthRedirectLink
        href={getApplyLink(result)}
        productSlug={loanSlug}
        className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] text-[13px] font-extrabold text-white no-underline"
      >
        Apply Now
      </AuthRedirectLink>
    </article>
  );
};

const ResultCardsSection = ({
  title,
  results,
  sectionKey,
  requestedAmount,
  requestedTenureYears,
}: {
  title: string;
  results: EligibilityCriteriaResult[];
  sectionKey: string;
  requestedAmount: number;
  requestedTenureYears: number;
}) =>
  results.length > 0 ? (
    <section className="px-4 pt-3 pb-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-9xl">
        <div className="mb-3 flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-[#00529b]" />
          <h2 className="text-[22px] font-extrabold tracking-tight">{title}</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {results.map((result, index) => (
            <ResultCard
              key={`${sectionKey}-${result._id}-${index}`}
              result={result}
              requestedAmount={requestedAmount}
              requestedTenureYears={requestedTenureYears}
            />
          ))}
        </div>
      </div>
    </section>
  ) : null;

export default async function EligibilityResultsPage({
  searchParams,
}: PageProps) {
  const query = await searchParams;
  const loanType = firstValue(query.loanType) || "personal-loan";
  const amount = firstValue(query.amount) || "1000000";
  const salaryType = firstValue(query.salaryType) || "Salaried";
  const cibilScore = firstValue(query.cibilScore) || "720";
  const tenureYears = firstValue(query.tenureYears) || "5";
  const bank = firstValue(query.bank);
  const q = firstValue(query.q);
  const requestedLoanSlug = loanTypeToSlug(loanType);
  const shouldLoadInstantLoans = requestedLoanSlug === "personal-loan";

  const [data, instantLoanData] = await Promise.all([
    searchEligibilityCriteria({
      loanType,
      amount,
      salaryType,
      cibilScore,
      tenureYears,
      bank,
      q,
      limit: 50,
    }),
    shouldLoadInstantLoans
      ? searchEligibilityCriteria({
          loanType: "instant-loan",
          amount,
          salaryType,
          cibilScore,
          tenureYears,
          bank,
          q,
          limit: 12,
        })
      : Promise.resolve(null),
  ]);

  const results = data.results || [];
  const bestResults = results.filter((result) => result.eligible).slice(0, 3);
  const instantLoanResults = (instantLoanData?.results || [])
    .filter((result) => result.eligible)
    .slice(0, 6);
  const resolvedLoanType = data.filters.loanType || loanType;
  const loanLabel = loanTypeToLabel(resolvedLoanType);
  const visibleLoanTypeOptions = getLoanTypeOptions(resolvedLoanType);
  const numericAmount = Number(amount) || 0;
  const numericTenureYears = Number(tenureYears) || 0;
  const summaryItems = [
    {
      icon: Building2,
      label: "Partner options",
      value: String(data.total || 0),
    },
    {
      icon: ShieldCheck,
      label: "Indicative matches",
      value: String(data.eligibleCount || 0),
    },
    {
      icon: BadgeIndianRupee,
      label: "Loan amount",
      value: formatCurrency(Number(amount)),
    },
    {
      icon: Landmark,
      label: "CIBIL score",
      value: cibilScore,
    },
  ];

  return (
    <main className="bg-white text-[#111827]">
      <section className="px-4 pb-3 pt-3 md:px-6 md:pt-4 lg:px-8">
        <div className="mobile-safe-container">
          <div>
            <Link
              href="/#eligibility-check"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-[#00529b] no-underline"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to eligibility check
            </Link>
            <h1 className="mt-3 max-w-3xl text-[26px] font-extrabold leading-tight tracking-tight text-[#07162d] sm:text-[30px] md:text-[42px]">
              Your {loanLabel} partner matches
            </h1>
            <p className="mt-2 max-w-3xl text-[13px] font-medium leading-5 text-[#5f6b7a] md:text-[14px]">
              These are indicative matches from active Fintaraa partner
              criteria—not loan approvals. Final rate, amount and approval
              depend on KYC, documents, income verification and lender
              underwriting.
            </p>
          </div>

          <form
            action="/eligibility-results"
            className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-[#f4f8fb] p-2 sm:gap-3 sm:p-3 md:mt-4 md:grid-cols-6 md:rounded-2xl xl:grid-cols-12"
          >
            <label className="col-span-2 md:col-span-2 xl:col-span-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#64748b] md:text-[12px]">
                Loan type
              </span>
              <select
                name="loanType"
                defaultValue={loanType}
                className="mt-1 h-10 w-full rounded-xl border border-[#d9e4ef] bg-white px-3 text-[13px] font-bold outline-none focus:border-[#00529b] md:mt-2 md:h-12 md:rounded-2xl md:px-4 md:text-[14px]"
              >
                {visibleLoanTypeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="xl:col-span-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#64748b] md:text-[12px]">
                Amount
              </span>
              <input
                name="amount"
                defaultValue={amount}
                inputMode="numeric"
                className="mt-1 h-10 w-full rounded-xl border border-[#d9e4ef] bg-white px-3 text-[13px] font-bold outline-none focus:border-[#00529b] md:mt-2 md:h-12 md:rounded-2xl md:px-4 md:text-[14px]"
              />
            </label>
            <label className="xl:col-span-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#64748b] md:text-[12px]">
                CIBIL
              </span>
              <input
                name="cibilScore"
                defaultValue={cibilScore}
                inputMode="numeric"
                className="mt-1 h-10 w-full rounded-xl border border-[#d9e4ef] bg-white px-3 text-[13px] font-bold outline-none focus:border-[#00529b] md:mt-2 md:h-12 md:rounded-2xl md:px-4 md:text-[14px]"
              />
            </label>
            <label className="col-span-2 md:col-span-2 xl:col-span-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#64748b] md:text-[12px]">
                Profile
              </span>
              <select
                name="salaryType"
                defaultValue={salaryType}
                className="mt-1 h-10 w-full rounded-xl border border-[#d9e4ef] bg-white px-3 text-[13px] font-bold outline-none focus:border-[#00529b] md:mt-2 md:h-12 md:rounded-2xl md:px-4 md:text-[14px]"
              >
                {salaryTypeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="xl:col-span-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#64748b] md:text-[12px]">
                Tenure
              </span>
              <input
                name="tenureYears"
                defaultValue={tenureYears}
                inputMode="numeric"
                className="mt-1 h-10 w-full rounded-xl border border-[#d9e4ef] bg-white px-3 text-[13px] font-bold outline-none focus:border-[#00529b] md:mt-2 md:h-12 md:rounded-2xl md:px-4 md:text-[14px]"
              />
            </label>
            <label className="md:col-span-2 xl:col-span-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#64748b] md:text-[12px]">
                Bank or keyword
              </span>
              <input
                name="q"
                defaultValue={bank || q}
                placeholder="Axis, HDFC, SBI..."
                className="mt-1 h-10 w-full rounded-xl border border-[#d9e4ef] bg-white px-3 text-[13px] font-bold outline-none focus:border-[#00529b] md:mt-2 md:h-12 md:rounded-2xl md:px-4 md:text-[14px]"
              />
            </label>
            <button
              type="submit"
              className="col-span-2 inline-flex h-10 items-center justify-center gap-2 self-end rounded-full bg-[#00529b] px-5 text-[13px] font-extrabold text-white md:col-span-2 md:h-12 md:px-6 md:text-[14px] xl:col-span-2"
            >
              <Search className="h-4 w-4" />
              Update Matches
            </button>
          </form>

          <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-[#f7fbff] p-2 sm:mt-3 sm:gap-3 sm:rounded-2xl sm:p-3 md:grid-cols-4">
            {summaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex min-w-0 items-center gap-2 rounded-xl bg-white px-3 py-2 md:gap-3 md:px-4 md:py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef6ff] text-[#00529b] md:h-10 md:w-10 md:rounded-xl">
                    <Icon className="h-4 w-4 md:h-4.5 md:w-4.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-[#7a8699]">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[14px] font-extrabold text-[#07162d] md:text-[17px]">
                      {item.value}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ResultCardsSection
        title="Best matches"
        results={bestResults}
        sectionKey="best"
        requestedAmount={numericAmount}
        requestedTenureYears={numericTenureYears}
      />

      <ResultCardsSection
        title="Instant loan options"
        results={instantLoanResults}
        sectionKey="instant"
        requestedAmount={numericAmount}
        requestedTenureYears={numericTenureYears}
      />

      <details className="group mx-4 mb-10 mt-4 rounded-2xl border border-[#dbe8f4] bg-white md:mx-6 lg:mx-8">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-[15px] font-extrabold text-[#07162d] marker:content-none md:px-6 md:text-[17px]">
          <span>View full partner criteria ({results.length})</span>
          <ChevronDown className="h-5 w-5 shrink-0 text-[#00529b] transition-transform group-open:rotate-180" />
        </summary>
      <section className="border-t border-[#e4edf5] px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <h2 className="text-[24px] font-extrabold tracking-tight">
            Partner eligibility comparison
          </h2>
          <div className="mt-5 overflow-x-auto rounded-3xl border border-[#e4edf5]">
            <table className="w-full min-w-260 border-collapse bg-white text-left text-[13px]">
              <thead className="bg-[#f7fbff] text-[#334155]">
                <tr>
                  {[
                    "Bank",
                    "Status",
                    "Rate & amount",
                    "Core criteria",
                    "Fees",
                    "Action",
                  ].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-extrabold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef3f8]">
                {results.map((result) => {
                  const bankInfo = resolveBank(result.bankName);
                  const loanSlug = loanTypeToSlug(result.loanType);
                  return (
                    <tr
                      key={result._id}
                      className="align-top hover:bg-[#fbfdff]"
                    >
                      <td className="px-5 py-5">
                        <Link
                          href={`/banks/${bankInfo.slug}/${loanSlug}`}
                          className="flex items-center gap-3 no-underline"
                        >
                          {bankInfo.logo ? (
                            <BankLogoImage
                              src={bankInfo.logo}
                              alt={bankInfo.name}
                              className="h-8 w-24"
                              imageClassName="object-left"
                            />
                          ) : (
                            <Landmark className="h-5 w-5 text-[#00529b]" />
                          )}
                          <span className="font-extrabold text-[#07162d]">
                            {result.bankName}
                          </span>
                        </Link>
                        <p className="mt-2 text-[12px] font-bold text-[#7a8699]">
                          {loanTypeToLabel(result.loanType)} ·{" "}
                          {result.salaryType}
                        </p>
                      </td>
                      <td className="px-5 py-5">
                        <ResultStatus result={result} />
                        <p className="mt-2 text-[12px] font-bold text-[#7a8699]">
                          Score {result.matchScore}
                        </p>
                      </td>
                      <td className="px-5 py-5 font-bold text-[#334155]">
                        <p>{formatPercent(result.roi)} p.a.</p>
                        <p className="mt-1">
                          {formatCurrency(result.maximumLoanAmount)}
                        </p>
                        <p className="mt-1">
                          Up to {result.maxTenureYears || "-"} years
                        </p>
                      </td>
                      <td className="px-5 py-5">
                        <div className="space-y-2">
                          {result.checks.map((check) => (
                            <div
                              key={`${result._id}-${check.label}`}
                              className="flex items-start gap-2"
                            >
                              {check.passed ? (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#13a653]" />
                              ) : (
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#d97706]" />
                              )}
                              <span>
                                <span className="font-extrabold text-[#07162d]">
                                  {check.label}:
                                </span>{" "}
                                <span className="text-[#64748b]">
                                  {check.provided} / {check.requirement}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-5 font-bold text-[#334155]">
                        <p>Processing {formatFee(result)}</p>
                        <p className="mt-1">Login {result.loginFees || "-"}</p>
                        <p className="mt-1">
                          Insurance {result.insurance || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-5">
                        <AuthRedirectLink
                          href={getApplyLink(result)}
                          productSlug={loanSlug}
                          className="inline-flex h-9 items-center justify-center rounded-full bg-[#13a653] px-5 text-[12px] font-extrabold text-white no-underline"
                        >
                          Apply Now
                        </AuthRedirectLink>
                      </td>
                    </tr>
                  );
                })}
                {results.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-[14px] font-bold text-[#64748b]"
                    >
                      No eligibility rows found for this search. Try another
                      bank, loan type, or salary profile.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {results.length > 0 ? (
        <section className="px-4 pb-16 md:px-6 lg:px-8">
          <div className="mobile-safe-container">
            <h2 className="text-[24px] font-extrabold tracking-tight">
              Detailed partner terms
            </h2>
            <div className="mt-4 grid gap-3">
              {results.map((result) => {
                const bankInfo = resolveBank(result.bankName);
                const loanSlug = loanTypeToSlug(result.loanType);
                return (
                  <article
                    key={`${result._id}-terms`}
                    className="rounded-2xl border border-[#dbe8f4] bg-white px-3 py-3 md:px-4 md:py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/banks/${bankInfo.slug}/${loanSlug}`}
                        className="flex min-w-0 items-center gap-3 text-[15px] font-extrabold text-[#07162d] no-underline md:text-[17px]"
                      >
                        {bankInfo.logo ? (
                          <BankLogoImage
                            src={bankInfo.logo}
                            alt={bankInfo.name}
                            className="h-7 w-20 md:h-8 md:w-24"
                            imageClassName="object-left"
                          />
                        ) : (
                          <Landmark className="h-5 w-5 text-[#00529b]" />
                        )}
                        <span className="truncate">{result.bankName}</span>
                      </Link>
                      <ResultStatus result={result} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-x-3 border-t border-[#e4edf5] pt-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {(result.terms || []).map((term, termIndex) => (
                        <div
                          key={`${result._id}-term-${termIndex}`}
                          className="min-w-0 border-b border-[#edf3f8] py-1.5"
                        >
                          <p className="truncate text-[9px] font-extrabold uppercase tracking-wide text-[#7a8699] md:text-[10px]">
                            {term.label}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[11px] font-bold leading-4 text-[#07162d] md:text-[12px]">
                            {term.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
      </details>
    </main>
  );
}
