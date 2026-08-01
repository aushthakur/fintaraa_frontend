"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileUp,
  Gift,
  IndianRupee,
  Landmark,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  fetchAccountInsuranceApplications,
  fetchAccountLoanApplications,
  type AccountInsuranceQuery,
  type AccountLoanQuery,
} from "@/services/accountActivity";
import {
  fetchMyDocumentRequests,
  type CustomerDocumentRequest,
} from "@/services/accountDocuments";
import { fetchCreditCards, type CreditCardProduct } from "@/services/bankProducts";
import { fetchUserCibil, type UserCibilResponse } from "@/services/cibil";
import { fetchNotificationStats } from "@/services/notifications";
import {
  fetchReferralHistory,
  fetchReferralSummary,
  type ReferralHistoryItem,
  type ReferralSummary,
} from "@/services/referrals";
import { resolveLoanProductDisplayName } from "@/components/application/loanProductContract";

type DashboardData = {
  loans: AccountLoanQuery[];
  insurance: AccountInsuranceQuery[];
  requests: CustomerDocumentRequest[];
  offers: CreditCardProduct[];
  referral: ReferralSummary | null;
  referralHistory: ReferralHistoryItem[];
  unread: number;
  cibil: UserCibilResponse | null;
};

const initialData: DashboardData = {
  loans: [],
  insurance: [],
  requests: [],
  offers: [],
  referral: null,
  referralHistory: [],
  unread: 0,
  cibil: null,
};

const terminalStatuses = [
  "rejected",
  "cancelled",
  "completed",
  "expired",
  "disbursed",
  "completed_success",
  "not_interested",
  "dropped_lost",
];

const approvedStatuses = [
  "approved",
  "login_approved",
  "sanctioned",
  "approved_with_conditions",
  "agreement_signed",
  "disbursal_initiated",
  "disbursed",
  "disbursed_partial_full",
  "completed_success",
];

const activePolicyStatuses = [
  "active",
  "approved",
  "completed",
  "policy_issued",
  "completed_success",
];

const cleanStatus = (value?: string) => String(value || "submitted").toLowerCase();
const title = (value?: string, fallback = "Application") =>
  String(value || fallback)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
const money = (value?: number | string) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const shortDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};
const objectValue = (record: Record<string, unknown> | undefined, keys: string[]) => {
  for (const key of keys) {
    const value = record?.[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value);
    }
  }
  return "";
};

export function UserDashboardOverview() {
  const { user, profile } = useCurrentUser();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [refreshingScore, setRefreshingScore] = useState(false);
  const [scoreMessage, setScoreMessage] = useState("");
  const [dashboardLoadedAt] = useState(() => Date.now());

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        fetchAccountLoanApplications(),
        fetchAccountInsuranceApplications(),
        fetchMyDocumentRequests(),
        fetchCreditCards(),
        fetchReferralSummary(),
        fetchReferralHistory(),
        fetchNotificationStats("user"),
        fetchUserCibil(false, { silent: true }),
      ]);
      if (!active) return;
      setData({
        loans: results[0].status === "fulfilled" ? results[0].value : [],
        insurance: results[1].status === "fulfilled" ? results[1].value : [],
        requests: results[2].status === "fulfilled" ? results[2].value : [],
        offers: results[3].status === "fulfilled" ? results[3].value : [],
        referral: results[4].status === "fulfilled" ? results[4].value : null,
        referralHistory:
          results[5].status === "fulfilled" ? results[5].value : [],
        unread:
          results[6].status === "fulfilled" ? results[6].value.unread || 0 : 0,
        cibil: results[7].status === "fulfilled" ? results[7].value : null,
      });
      setLoading(false);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const score = Number(
    data.cibil?.cibilScore ||
      (user?.cibilScore as number | undefined) ||
      (user?.experianScore as number | undefined) ||
      0,
  );
  const scoreProgress = score ? Math.min(Math.max((score - 300) / 6, 0), 100) : 0;
  const scoreDate =
    data.cibil?.lastFetchedAt ||
    (user?.cibilLastFetchedAt as string | undefined) ||
    (user?.experianLastFetchedAt as string | undefined);

  const activeApplications = useMemo(() => {
    const loans = data.loans
      .filter((item) => !terminalStatuses.includes(cleanStatus(item.status)))
      .map((item) => ({
        id: item._id,
        type:
          resolveLoanProductDisplayName({
            loanType: item.loanType,
            policyDetails: item.policyDetails,
          }) || title(item.loanType, "Loan"),
        reference: item.loanId || item._id.slice(-8).toUpperCase(),
        status: title(item.status, "Submitted"),
        updatedAt: item.updatedAt,
        icon: Landmark,
      }));
    const insurance = data.insurance
      .filter((item) => !terminalStatuses.includes(cleanStatus(item.status)))
      .map((item) => ({
        id: item._id,
        type: title(item.typeOfInsurance, "Insurance"),
        reference:
          item.insuranceId || item.queryId || item._id.slice(-8).toUpperCase(),
        status: title(item.status, "Submitted"),
        updatedAt: item.updatedAt,
        icon: ShieldCheck,
      }));
    return [...loans, ...insurance]
      .sort(
        (first, second) =>
          new Date(second.updatedAt || 0).getTime() -
          new Date(first.updatedAt || 0).getTime(),
      )
      .slice(0, 4);
  }, [data.insurance, data.loans]);

  const approvedLoans = useMemo(
    () =>
      data.loans
        .filter(
          (item) => item.approved || approvedStatuses.includes(cleanStatus(item.status)),
        )
        .slice(0, 3),
    [data.loans],
  );

  const activePolicies = useMemo(
    () =>
      data.insurance
        .filter((item) => activePolicyStatuses.includes(cleanStatus(item.status)))
        .slice(0, 3),
    [data.insurance],
  );

  const pendingRequests = data.requests
    .filter((request) => request.status === "pending")
    .slice(0, 4);
  const monthlyIncome = Number(
    user?.employmentDetails?.monthlyIncome ||
      user?.kycProfile?.employmentDetails?.monthlyIncome ||
      0,
  );
  const matchedOffers = useMemo(() => {
    const matchScore = (offer: CreditCardProduct) => {
      const minimumIncome = Number(offer.minimumIncome || 0);
      const minimumScore = Number(offer.creditScoreRequirement || 0);
      const incomeMatch =
        !monthlyIncome || !minimumIncome || monthlyIncome >= minimumIncome;
      const creditMatch = !score || !minimumScore || score >= minimumScore;
      return Number(incomeMatch) * 4 + Number(creditMatch) * 4 + Number(Boolean(offer.featured)) * 2;
    };
    return [...data.offers]
      .sort((first, second) => matchScore(second) - matchScore(first))
      .slice(0, 3);
  }, [data.offers, monthlyIncome, score]);
  const rewardAmount = Number(
    data.referral?.totalEarnings || data.referral?.amount || 0,
  );
  const referralRewardValue = Number(data.referral?.rewardAmount);
  const referralConfigAvailable = Boolean(
    data.referral &&
      Number.isFinite(referralRewardValue) &&
      referralRewardValue > 0,
  );
  const referralProgramActive =
    referralConfigAvailable && data.referral?.programActive !== false;
  const referralProgramPaused =
    referralConfigAvailable && data.referral?.programActive === false;
  const configuredReferralReward = referralConfigAvailable
    ? referralRewardValue
    : 0;
  const referralMinimumDisbursement = Number(
    data.referral?.minimumDisbursementAmount || 0,
  );
  const referralLink =
    typeof window !== "undefined" && data.referral?.referralCode
      ? `${window.location.origin}/login?ref=${encodeURIComponent(data.referral.referralCode)}`
      : "";

  const refreshScore = async () => {
    setRefreshingScore(true);
    setScoreMessage("");
    try {
      const result = await fetchUserCibil(true, { silent: true });
      setData((current) => ({ ...current, cibil: result || null }));
      setScoreMessage(result?.message || "Latest score loaded successfully.");
    } catch (error) {
      setScoreMessage(
        error instanceof Error
          ? error.message.replace(/^❌\s*/, "")
          : "Score could not be refreshed.",
      );
    } finally {
      setRefreshingScore(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-96 place-items-center">
        <span className="inline-flex items-center gap-2 text-[13px] font-bold text-[#195585]">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your financial overview...
        </span>
      </div>
    );
  }

  return (
    <div className="grid gap-5 py-5">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-3xl border border-[#dbe8f3] bg-[#f7fbff] p-5 md:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className="grid h-38 w-38 shrink-0 place-items-center rounded-full p-3"
              style={{
                background: `conic-gradient(#12a866 ${scoreProgress}%, #dce8f2 ${scoreProgress}% 100%)`,
              }}
            >
              <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
                <span>
                  <span className="block text-[33px] font-extrabold text-[#102c45]">
                    {score || "—"}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6b8194]">
                    CIBIL score
                  </span>
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#075cde]">
                Credit health
              </p>
              <h3 className="mt-2 text-[23px] font-extrabold text-[#102c45]">
                {score >= 750
                  ? "Your score is in a strong range"
                  : score
                    ? "Keep building your credit profile"
                    : "Check your credit score"}
              </h3>
              <p className="mt-2 text-[12px] font-semibold text-[#6b8194]">
                Last checked: {shortDate(scoreDate)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void refreshScore()}
                  disabled={refreshingScore}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#075cde] px-4 text-[12px] font-extrabold text-white disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshingScore ? "animate-spin" : ""}`} />
                  Refresh Score
                </button>
                <Link
                  href="/cibil-score/report"
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-[12px] font-extrabold text-[#075cde]"
                >
                  View report
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {scoreMessage ? (
                <p className="mt-3 text-[11px] font-bold text-[#60788d]">
                  {scoreMessage}
                </p>
              ) : null}
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-[#dbe8f3] bg-white p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#075cde]">
                Profile readiness
              </p>
              <p className="mt-2 text-[30px] font-extrabold text-[#102c45]">
                {profile.completion.percent}%
              </p>
            </div>
            <UserRoundCheck className="h-9 w-9 text-[#12a866]" />
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#e5edf4]">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#075cde] to-[#12a866]"
              style={{ width: `${profile.completion.percent}%` }}
            />
          </div>
          <p className="mt-3 text-[12px] font-semibold leading-6 text-[#6b8194]">
            {profile.completion.completed} of {profile.completion.total} profile
            details completed. A complete profile improves personalised matches.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/account/profile/edit-profile"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#102c45] px-3 text-[12px] font-extrabold text-white"
            >
              Complete profile
            </Link>
            <Link
              href="/account/profile/notifications"
              className="relative inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dbe8f3] px-3 text-[12px] font-extrabold text-[#28465d]"
            >
              <Bell className="h-4 w-4" />
              {data.unread} unread
              {data.unread ? (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              ) : null}
            </Link>
          </div>
        </article>
      </section>

      <DashboardSection
        title="Active applications"
        subtitle="Latest application status with quick actions"
        href="/account/profile/my-applications"
      >
        {activeApplications.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {activeApplications.map((application) => {
              const Icon = application.icon;
              return (
                <article key={`${application.type}-${application.id}`} className="rounded-2xl border border-[#e0eaf2] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#075cde]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-700">
                      {application.status}
                    </span>
                  </div>
                  <h4 className="mt-4 text-[14px] font-extrabold text-[#17364e]">
                    {application.type}
                  </h4>
                  <p className="mt-1 font-mono text-[11px] font-bold text-[#718598]">
                    {application.reference}
                  </p>
                  <Link href="/account/profile/my-applications" className="mt-4 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#075cde]">
                    Track application <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyDashboardRow text="No active applications. Use Quick Apply to start one." />
        )}
      </DashboardSection>

      <section className="grid gap-5 xl:grid-cols-2">
        <DashboardSection title="Approved loans" subtitle="Sanctioned and disbursed loan overview">
          {approvedLoans.length ? (
            <div className="grid gap-3">
              {approvedLoans.map((loan) => (
                <DataRow
                  key={loan._id}
                  icon={IndianRupee}
                  title={
                    resolveLoanProductDisplayName({
                      loanType: loan.loanType,
                      policyDetails: loan.policyDetails,
                    }) || title(loan.loanType, "Loan")
                  }
                  subtitle={loan.bankName || "Partner lender"}
                  value={money(loan.disbursedAmount || loan.loanAmount)}
                  meta={
                    loan.disbursedDate
                      ? `Disbursed ${shortDate(loan.disbursedDate)}`
                      : ["disbursed", "disbursed_partial_full", "completed_success"].includes(
                            cleanStatus(loan.status),
                          )
                        ? `Disbursed ${shortDate(loan.updatedAt)}`
                        : "Disbursement pending"
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyDashboardRow text="Approved loans will appear here after sanction or disbursement." />
          )}
        </DashboardSection>

        <DashboardSection title="Active insurance policies" subtitle="Policy status and upcoming expiry alerts">
          {activePolicies.length ? (
            <div className="grid gap-3">
              {activePolicies.map((policy) => {
                const details = policy.policyDetails || {};
                const expiry = objectValue(details, [
                  "policyExpiryDate",
                  "expiryDate",
                  "endDate",
                  "validTill",
                ]);
                const provider = objectValue(details, [
                  "insurerName",
                  "insuranceCompany",
                  "provider",
                ]);
                return (
                  <DataRow
                    key={policy._id}
                    icon={ShieldCheck}
                    title={title(policy.typeOfInsurance, "Insurance policy")}
                    subtitle={provider || "Insurance partner"}
                    value={title(policy.status, "Active")}
                    meta={expiry ? `Expires ${shortDate(expiry)}` : "Expiry date awaited"}
                    alert={Boolean(
                      expiry &&
                        new Date(expiry).getTime() - dashboardLoadedAt <
                          30 * 86400000,
                    )}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyDashboardRow text="Issued and active insurance policies will appear here." />
          )}
        </DashboardSection>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <DashboardSection
          title="Pending documents"
          subtitle="Upload requested files to prevent processing delays"
          href="/account/profile/uploaded-documents"
        >
          {pendingRequests.length ? (
            <div className="grid gap-3">
              {pendingRequests.map((request) => (
                <div key={request._id} className="flex items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-extrabold text-orange-900">
                      {request.requestedDocuments.map((item) => title(item)).join(", ")}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-orange-700">
                      {request.loanQuery?.loanId || "Profile document"} · requested {shortDate(request.createdAt)}
                    </p>
                  </div>
                  <Link href="/account/profile/uploaded-documents" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-orange-600 px-3 text-[11px] font-extrabold text-white">
                    <FileUp className="h-3.5 w-3.5" /> Upload
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[12px] font-bold text-emerald-700">
              <CheckCircle2 className="h-5 w-5" /> No pending document requests.
            </div>
          )}
        </DashboardSection>

        <DashboardSection
          title="Offers & cashback"
          subtitle="Personalised matches based on your profile"
          href="/account/profile/my-offers"
        >
          {matchedOffers.length ? (
            <div className="grid gap-3 md:grid-cols-3">
              {matchedOffers.map((offer) => (
                <article key={offer._id} className="rounded-2xl border border-[#e0eaf2] p-4">
                  <Sparkles className="h-5 w-5 text-[#12a866]" />
                  <h4 className="mt-3 line-clamp-2 text-[13px] font-extrabold text-[#17364e]">
                    {offer.name}
                  </h4>
                  <p className="mt-1 text-[10px] font-bold text-[#718598]">
                    {offer.bankName}
                  </p>
                  <p className="mt-3 line-clamp-2 text-[11px] font-semibold leading-5 text-[#526b7f]">
                    {offer.cashbackDetails || offer.welcomeBenefits || offer.rewardStructure || "Partner benefits available"}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyDashboardRow text="Complete your profile to unlock personalised offers." />
          )}
        </DashboardSection>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardSection title="Quick Apply" subtitle="Start your frequently used financial journeys">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Personal loan", "/products/personal-loan", Landmark],
              ["Home loan", "/products/home-loan", IndianRupee],
              ["Credit card", "/credit-cards", CreditCard],
              ["Insurance", "/products", ShieldCheck],
            ].map(([label, href, icon]) => {
              const Icon = icon as typeof Landmark;
              return (
                <Link key={String(label)} href={String(href)} className="group rounded-2xl border border-[#dbe8f3] p-4 hover:border-blue-300 hover:bg-blue-50/40">
                  <Icon className="h-5 w-5 text-[#075cde]" />
                  <p className="mt-3 text-[12px] font-extrabold text-[#28465d]">{String(label)}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#075cde]">
                    Apply now <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </DashboardSection>

        <article className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-emerald-700">
                {referralProgramActive ? "Refer & earn" : "Referral program"}
              </p>
              <h3 className="mt-2 text-[22px] font-extrabold text-[#17364e]">
                {referralProgramActive
                  ? `Refer a friend and earn ${money(configuredReferralReward)}`
                  : referralProgramPaused
                    ? "Referral rewards are currently paused"
                    : "Referral details are temporarily unavailable"}
              </h3>
              {referralProgramActive && referralMinimumDisbursement > 0 ? (
                <p className="mt-2 text-[11px] font-bold text-emerald-800">
                  Minimum eligible loan disbursement: {money(referralMinimumDisbursement)}
                </p>
              ) : referralProgramPaused ? (
                <p className="mt-2 text-[11px] font-bold text-emerald-800">
                  New referral sharing and reward eligibility are temporarily unavailable.
                </p>
              ) : !referralConfigAvailable ? (
                <p className="mt-2 text-[11px] font-bold text-emerald-800">
                  Current reward terms could not be loaded. Open referral history to retry.
                </p>
              ) : null}
            </div>
            <Gift className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <ReferralMetric label="Referred" value={data.referral?.totalReferrals || 0} />
            <ReferralMetric label="Reward paid" value={data.referral?.paidCount || 0} />
            <ReferralMetric label="Earnings" value={money(rewardAmount)} />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={!referralProgramActive || !referralLink}
              onClick={() => void navigator.clipboard.writeText(referralLink)}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-emerald-600 px-3 text-[11px] font-extrabold text-white disabled:opacity-50"
            >
              Copy referral link
            </button>
            <Link href="/refer-and-earn" className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 text-[11px] font-extrabold text-emerald-700">
              View history
            </Link>
          </div>
          {data.referralHistory[0] ? (
            <p className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-emerald-800">
              <Clock3 className="h-3.5 w-3.5" /> Latest referral: {title(data.referralHistory[0].status)}
            </p>
          ) : null}
        </article>
      </section>
    </div>
  );
}

function DashboardSection({
  title: sectionTitle,
  subtitle,
  href,
  children,
}: {
  title: string;
  subtitle: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[#dbe8f3] bg-white p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[19px] font-extrabold text-[#17364e]">{sectionTitle}</h3>
          <p className="mt-1 text-[11px] font-semibold text-[#718598]">{subtitle}</p>
        </div>
        {href ? (
          <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-[#075cde]">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function DataRow({
  icon: Icon,
  title: rowTitle,
  subtitle,
  value,
  meta,
  alert,
}: {
  icon: typeof Landmark;
  title: string;
  subtitle: string;
  value: string;
  meta: string;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#e0eaf2] p-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#075cde]">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-extrabold text-[#17364e]">{rowTitle}</p>
        <p className="mt-0.5 truncate text-[10px] font-semibold text-[#718598]">{subtitle}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[12px] font-extrabold text-[#17364e]">{value}</p>
        <p className={`mt-0.5 text-[9px] font-bold ${alert ? "text-red-600" : "text-[#718598]"}`}>{meta}</p>
      </div>
    </div>
  );
}

function EmptyDashboardRow({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cfdee9] bg-[#f8fbfd] p-5 text-center text-[12px] font-semibold text-[#718598]">
      {text}
    </div>
  );
}

function ReferralMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-3 text-center">
      <p className="text-[16px] font-extrabold text-[#17364e]">{value}</p>
      <p className="mt-1 text-[9px] font-extrabold uppercase tracking-wide text-[#718598]">{label}</p>
    </div>
  );
}
