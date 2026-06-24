import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  CheckCircle2,
  Landmark,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { AuthRedirectLink } from "@/components/auth/AuthRedirectLink";
import { getApplyHref } from "@/components/application/flowRegistry";
import { BankLogoImage } from "@/components/common/BankLogoImage";
import { slugifyProduct } from "@/lib/productRouting";
import { trustedPartners } from "@/data/trustedPartners";
import { loanProductDirectory } from "@/data/bankDirectory";
import {
  loanTypeToLabel,
  loanTypeToSlug,
  searchEligibilityCriteria,
  type EligibilityCriteriaResult,
} from "@/services/eligibilityCriteria";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const loanTypeOptions = loanProductDirectory.map((loan) => ({
  label: loan.name,
  value: loan.slug,
}));

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
    "Search eligible banks by loan type, amount, CIBIL score, tenure, and salary profile.",
};

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] || "" : value || "";

const formatCurrency = (value?: number | null) => {
  if (!value) return "-";
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eafaf1] px-3 py-1 text-[12px] font-black text-[#168447]">
      <CheckCircle2 className="h-3.5 w-3.5" />
      Eligible
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7ed] px-3 py-1 text-[12px] font-black text-[#b45309]">
      <AlertTriangle className="h-3.5 w-3.5" />
      Review terms
    </span>
  );

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

  const data = await searchEligibilityCriteria({
    loanType,
    amount,
    salaryType,
    cibilScore,
    tenureYears,
    bank,
    q,
    limit: 50,
  });

  const results = data.results || [];
  const bestResults = results.filter((result) => result.eligible).slice(0, 3);
  const resolvedLoanType = data.filters.loanType || loanType;
  const loanLabel = loanTypeToLabel(resolvedLoanType);

  return (
    <main className="bg-white text-[#111827]">
      <section className="px-4 pt-12 pb-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <Link
                href="/#eligibility-check"
                className="inline-flex items-center gap-2 text-[13px] font-bold text-[#00529b] no-underline"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to eligibility check
              </Link>
              <h1 className="mt-5 max-w-3xl text-[34px] font-black leading-tight tracking-tight text-[#07162d] md:text-[52px]">
                Eligible banks for {loanLabel}
              </h1>
              <p className="mt-4 max-w-2xl text-[15px] font-medium leading-7 text-[#5f6b7a]">
                Results are ranked from the eligibility criteria configured in
                the admin panel. Final approval depends on KYC, documents,
                income verification, and lender policy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-3xl bg-[#f7fbff] p-4">
              {[
                {
                  icon: Building2,
                  label: "Banks found",
                  value: String(data.total || 0),
                },
                {
                  icon: ShieldCheck,
                  label: "Eligible now",
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
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl bg-white p-4">
                    <Icon className="h-5 w-5 text-[#00529b]" />
                    <p className="mt-3 text-[12px] font-bold uppercase tracking-wide text-[#7a8699]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[20px] font-black text-[#07162d]">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <form
            action="/eligibility-results"
            className="mt-8 grid gap-3 rounded-3xl bg-[#f4f8fb] p-4 md:grid-cols-6"
          >
            <label className="md:col-span-2">
              <span className="text-[12px] font-black uppercase tracking-wide text-[#64748b]">
                Loan type
              </span>
              <select
                name="loanType"
                defaultValue={loanType}
                className="mt-2 h-12 w-full rounded-2xl border border-[#d9e4ef] bg-white px-4 text-[14px] font-bold outline-none focus:border-[#00529b]"
              >
                {loanTypeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-[12px] font-black uppercase tracking-wide text-[#64748b]">
                Amount
              </span>
              <input
                name="amount"
                defaultValue={amount}
                inputMode="numeric"
                className="mt-2 h-12 w-full rounded-2xl border border-[#d9e4ef] bg-white px-4 text-[14px] font-bold outline-none focus:border-[#00529b]"
              />
            </label>
            <label>
              <span className="text-[12px] font-black uppercase tracking-wide text-[#64748b]">
                CIBIL
              </span>
              <input
                name="cibilScore"
                defaultValue={cibilScore}
                inputMode="numeric"
                className="mt-2 h-12 w-full rounded-2xl border border-[#d9e4ef] bg-white px-4 text-[14px] font-bold outline-none focus:border-[#00529b]"
              />
            </label>
            <label>
              <span className="text-[12px] font-black uppercase tracking-wide text-[#64748b]">
                Profile
              </span>
              <select
                name="salaryType"
                defaultValue={salaryType}
                className="mt-2 h-12 w-full rounded-2xl border border-[#d9e4ef] bg-white px-4 text-[14px] font-bold outline-none focus:border-[#00529b]"
              >
                {salaryTypeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-[12px] font-black uppercase tracking-wide text-[#64748b]">
                Tenure
              </span>
              <input
                name="tenureYears"
                defaultValue={tenureYears}
                inputMode="numeric"
                className="mt-2 h-12 w-full rounded-2xl border border-[#d9e4ef] bg-white px-4 text-[14px] font-bold outline-none focus:border-[#00529b]"
              />
            </label>
            <label className="md:col-span-2">
              <span className="text-[12px] font-black uppercase tracking-wide text-[#64748b]">
                Bank or keyword
              </span>
              <input
                name="q"
                defaultValue={bank || q}
                placeholder="Axis, HDFC, SBI..."
                className="mt-2 h-12 w-full rounded-2xl border border-[#d9e4ef] bg-white px-4 text-[14px] font-bold outline-none focus:border-[#00529b]"
              />
            </label>
            <button
              type="submit"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#00529b] px-6 text-[14px] font-black text-white md:col-span-2"
            >
              <Search className="h-4 w-4" />
              Search Banks
            </button>
          </form>
        </div>
      </section>

      {bestResults.length > 0 ? (
        <section className="px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-9xl">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-[#00529b]" />
              <h2 className="text-[22px] font-black tracking-tight">
                Best matches
              </h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {bestResults.map((result) => {
                const bankInfo = resolveBank(result.bankName);
                const loanSlug = loanTypeToSlug(result.loanType);
                return (
                  <article
                    key={result._id}
                    className="rounded-3xl bg-[#f8fbff] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
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
                        <span className="truncate text-[16px] font-black text-[#07162d]">
                          {result.bankName}
                        </span>
                      </Link>
                      <ResultStatus result={result} />
                    </div>
                    <dl className="mt-5 grid grid-cols-2 gap-3 text-[13px]">
                      <div>
                        <dt className="font-bold text-[#7a8699]">ROI</dt>
                        <dd className="mt-1 font-black text-[#07162d]">
                          {formatPercent(result.roi)} p.a.
                        </dd>
                      </div>
                      <div>
                        <dt className="font-bold text-[#7a8699]">Max loan</dt>
                        <dd className="mt-1 font-black text-[#07162d]">
                          {formatCurrency(result.maximumLoanAmount)}
                        </dd>
                      </div>
                    </dl>
                    <AuthRedirectLink
                      href={getApplyLink(result)}
                      productSlug={loanSlug}
                      className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] text-[13px] font-black text-white no-underline"
                    >
                      Apply Now
                    </AuthRedirectLink>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <h2 className="text-[24px] font-black tracking-tight">
            Bank eligibility comparison
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
                    <th key={heading} className="px-5 py-4 font-black">
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
                    <tr key={result._id} className="align-top hover:bg-[#fbfdff]">
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
                          <span className="font-black text-[#07162d]">
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
                                <span className="font-black text-[#07162d]">
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
                        <p>Processing {formatPercent(result.processingFees)}</p>
                        <p className="mt-1">Login {result.loginFees || "-"}</p>
                        <p className="mt-1">
                          Insurance {result.insurance || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-5">
                        <AuthRedirectLink
                          href={getApplyLink(result)}
                          productSlug={loanSlug}
                          className="inline-flex h-9 items-center justify-center rounded-full bg-[#13a653] px-5 text-[12px] font-black text-white no-underline"
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
          <div className="mx-auto max-w-9xl">
            <h2 className="text-[24px] font-black tracking-tight">
              All lender terms
            </h2>
            <div className="mt-5 space-y-4">
              {results.map((result) => {
                const bankInfo = resolveBank(result.bankName);
                const loanSlug = loanTypeToSlug(result.loanType);
                return (
                  <article
                    key={`${result._id}-terms`}
                    className="rounded-3xl bg-[#f8fbff] p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Link
                        href={`/banks/${bankInfo.slug}/${loanSlug}`}
                        className="flex items-center gap-3 text-[17px] font-black text-[#07162d] no-underline"
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
                        {result.bankName}
                      </Link>
                      <ResultStatus result={result} />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {(result.terms || []).map((term) => (
                        <div
                          key={`${result._id}-${term.label}-${term.value}`}
                          className="rounded-2xl bg-white px-4 py-3"
                        >
                          <p className="text-[11px] font-black uppercase tracking-wide text-[#7a8699]">
                            {term.label}
                          </p>
                          <p className="mt-1 text-[13px] font-bold leading-5 text-[#07162d]">
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
    </main>
  );
}
