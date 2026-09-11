"use client";

import Image from "next/image";
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Copy,
  CheckCircle2,
  Mail,
  Camera,
  Share2,
  Loader2,
  MessageSquareText,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FaFacebookF,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { ServiceAppBanner } from "@/components/services/shared/ServiceShared";
import {
  ReferralSummary,
  ReferralHistoryItem,
  MAX_REFERRAL_PAYOUT_AMOUNT,
  type ReferralPayoutRequest,
  type ReferralWallet,
  createReferralPayoutRequest,
  fetchReferralPayoutRequests,
  fetchReferralSummary,
  fetchReferralHistory,
  fetchReferralWallet,
} from "@/services/referrals";

const howItWorks = [
  "Share your link or code with your friends",
  "They sign up using your link",
  "They submit and complete their application",
  "When their loan is approved & disbursed",
  "Reward is credited to your account",
];

const formatCurrency = (value?: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isLoggedIn = () => getAuthType() === "user" && Boolean(getAuthToken());

function StageCell({ date }: { date?: string }) {
  return date ? (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11px] font-bold text-emerald-700">
      <CheckCircle2 className="h-3.5 w-3.5" />
      {formatDate(date)}
    </span>
  ) : (
    <span className="whitespace-nowrap text-[11px] font-semibold text-[#98a2b3]">
      Pending
    </span>
  );
}

const payoutStatusLabel = (status: ReferralPayoutRequest["status"]) =>
  ({
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    paid: "Paid",
  })[status];

const payoutStatusDate = (request: ReferralPayoutRequest) => {
  if (request.status === "paid") return request.paidAt || request.updatedAt;
  if (request.status === "rejected")
    return request.rejectedAt || request.updatedAt;
  if (request.status === "approved")
    return request.approvedAt || request.updatedAt;
  return request.updatedAt || request.requestedAt || request.createdAt;
};

const payoutStatusClass = (status: ReferralPayoutRequest["status"]) =>
  ({
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    paid: "bg-emerald-100 text-emerald-800",
  })[status];

export function ReferPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [history, setHistory] = useState<ReferralHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [wallet, setWallet] = useState<ReferralWallet | null>(null);
  const [payoutRequests, setPayoutRequests] = useState<
    ReferralPayoutRequest[]
  >([]);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletApiReady, setWalletApiReady] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);
  const [withdrawalFeedback, setWithdrawalFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      if (!isLoggedIn()) {
        router.replace(
          buildLoginRedirectHref({
            redirectTo: "/refer-and-earn",
            product: "refer-and-earn",
          }),
        );
        return;
      }
      setAuthReady(true);
    });
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!authReady) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [summaryResult, historyResult] = await Promise.all([
          fetchReferralSummary(),
          fetchReferralHistory(),
        ]);
        if (!active) return;
        setSummary(summaryResult || null);
        setHistory(historyResult || []);
      } catch (err) {
        if (active) {
          setError((err as Error).message || "Unable to load referrals.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [authReady]);

  const loadWalletData = useCallback(async () => {
    const [walletResult, payoutResult] = await Promise.all([
      fetchReferralWallet(),
      fetchReferralPayoutRequests(),
    ]);
    setWallet(walletResult);
    setPayoutRequests(payoutResult);
    setWalletApiReady(true);
    setWalletError("");
  }, []);

  useEffect(() => {
    if (!authReady) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      void loadWalletData()
        .catch(() => {
          if (!active) return;
          setWalletApiReady(false);
          setWalletError(
            "Referral withdrawals are temporarily unavailable. Please try again later.",
          );
        })
        .finally(() => {
          if (active) setWalletLoading(false);
        });
    });
    return () => {
      active = false;
    };
  }, [authReady, loadWalletData]);

  const referralCode = summary?.referralCode || "";
  const rewardAmount = Number(summary?.rewardAmount);
  const referralConfigAvailable = Boolean(
    summary && Number.isFinite(rewardAmount) && rewardAmount > 0,
  );
  const configuredReward = referralConfigAvailable ? rewardAmount : 0;
  const minimumDisbursementAmount = Number(
    summary?.minimumDisbursementAmount || 0,
  );
  const programActive =
    referralConfigAvailable && summary?.programActive !== false;
  const programPaused =
    referralConfigAvailable && summary?.programActive === false;
  const referralLink = useMemo(() => {
    if (typeof window === "undefined" || !referralCode) return "";
    return `${window.location.origin}/login?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  const minimumDisbursementText =
    minimumDisbursementAmount > 0
      ? ` The referred loan must have a minimum disbursement of ${formatCurrency(minimumDisbursementAmount)}.`
      : "";
  const shareText = programPaused
    ? "Fintaraa referral rewards are currently paused."
    : programActive && referralCode
      ? `Use my Fintaraa referral code ${referralCode}. Refer a friend, earn ${formatCurrency(configuredReward)} when their loan is disbursed.${minimumDisbursementText}`
      : "Current Fintaraa referral reward terms are unavailable.";

  const copyValue = async (value: string, label: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 1600);
  };

  const openShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareButtons = [
    {
      label: "WhatsApp",
      icon: FaWhatsapp,
      color: "#25D366",
      action: () =>
        openShare(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${referralLink}`)}`,
        ),
    },
    {
      label: "SMS",
      icon: MessageSquareText,
      color: "#5b21b6",
      action: () =>
        window.location.assign(
          `sms:?&body=${encodeURIComponent(`${shareText} ${referralLink}`)}`,
        ),
    },
    {
      label: "Facebook",
      icon: FaFacebookF,
      color: "#1877F2",
      action: () =>
        openShare(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
        ),
    },
    {
      label: "X/Twitter",
      icon: FaXTwitter,
      color: "#111111",
      action: () =>
        openShare(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`,
        ),
    },
    {
      label: "Telegram",
      icon: FaTelegram,
      color: "#229ED9",
      action: () =>
        openShare(
          `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`,
        ),
    },
    {
      label: "Copy Link",
      icon: Mail,
      color: "#4c1d95",
      action: () => copyValue(referralLink, "link"),
    },
  ];

  const summaryCards: Array<{
    value: string;
    label: string;
    icon: LucideIcon;
  }> = [
    {
      value: String(summary?.totalReferrals || 0),
      label: "Referred Total",
      icon: UserCheck,
    },
    {
      value: String(summary?.visitCount || 0),
      label: "Link Visits",
      icon: UserCheck,
    },
    {
      value: String(summary?.paidCount || 0),
      label: "Reward Paid",
      icon: UserCheck,
    },
    {
      value: String(summary?.pendingReferrals || summary?.pendingCount || 0),
      label: "Pending",
      icon: UserCheck,
    },
    {
      value: formatCurrency(summary?.totalEarnings || summary?.amount),
      label: "Rewards",
      icon: Camera,
    },
  ];

  const minimumPayoutAmount = Math.max(
    500,
    Number(wallet?.minimumPayoutAmount || 500),
  );
  const availableBalance = Number(wallet?.availableAmount || 0);
  const maximumPayoutAmount = Math.min(
    availableBalance,
    MAX_REFERRAL_PAYOUT_AMOUNT,
  );
  const walletAllowsRequest = wallet?.canRequestPayout !== false;
  const parsedWithdrawalAmount = Number(withdrawalAmount);
  const withdrawalHasExcessPrecision =
    Number.isFinite(parsedWithdrawalAmount) &&
    Math.abs(
      parsedWithdrawalAmount -
        Math.round(parsedWithdrawalAmount * 100) / 100,
    ) > 0.000001;
  const activePayoutRequest = payoutRequests.find(
    (request) =>
      request.status === "pending" || request.status === "approved",
  );
  const withdrawalValidation = !withdrawalAmount.trim()
    ? ""
    : !Number.isFinite(parsedWithdrawalAmount) || parsedWithdrawalAmount <= 0
      ? "Enter a valid withdrawal amount."
      : parsedWithdrawalAmount < minimumPayoutAmount
        ? `Minimum withdrawal request is ${formatCurrency(minimumPayoutAmount)}.`
        : withdrawalHasExcessPrecision
          ? "Withdrawal amount can have at most two decimal places."
        : parsedWithdrawalAmount > availableBalance
          ? `Amount cannot exceed your available wallet balance of ${formatCurrency(availableBalance)}.`
          : parsedWithdrawalAmount > MAX_REFERRAL_PAYOUT_AMOUNT
            ? `Maximum withdrawal request is ${formatCurrency(MAX_REFERRAL_PAYOUT_AMOUNT)}.`
          : "";
  const canSubmitWithdrawal = Boolean(
    walletApiReady &&
      !walletLoading &&
      !submittingWithdrawal &&
      walletAllowsRequest &&
      !activePayoutRequest &&
      availableBalance >= minimumPayoutAmount &&
      withdrawalAmount.trim() &&
      !withdrawalValidation,
  );
  const withdrawalControlsDisabled = Boolean(
    !walletApiReady ||
      walletLoading ||
      submittingWithdrawal ||
      !walletAllowsRequest ||
      activePayoutRequest ||
      availableBalance < minimumPayoutAmount,
  );

  const submitWithdrawal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWithdrawalFeedback(null);
    if (!walletApiReady) {
      setWithdrawalFeedback({
        type: "error",
        text: "Referral withdrawals are temporarily unavailable.",
      });
      return;
    }
    if (!canSubmitWithdrawal) {
      setWithdrawalFeedback({
        type: "error",
        text:
          withdrawalValidation ||
          (activePayoutRequest
            ? "You already have an active withdrawal request."
            : !walletAllowsRequest
              ? "A new withdrawal request is not available right now."
            : `Enter an amount from ${formatCurrency(minimumPayoutAmount)} to ${formatCurrency(maximumPayoutAmount)}.`),
      });
      return;
    }

    setSubmittingWithdrawal(true);
    try {
      await createReferralPayoutRequest(parsedWithdrawalAmount);
      setWithdrawalAmount("");
      setWithdrawalFeedback({
        type: "success",
        text: "Withdrawal request submitted for manual admin review.",
      });
      try {
        await loadWalletData();
      } catch {
        setWalletApiReady(false);
        setWalletError(
          "Your request was submitted, but updated wallet details could not be loaded. Refresh the page before taking another action.",
        );
      }
    } catch (requestError) {
      setWithdrawalFeedback({
        type: "error",
        text:
          (requestError as Error).message ||
          "Unable to create the withdrawal request.",
      });
    } finally {
      setSubmittingWithdrawal(false);
    }
  };

  if (!authReady) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#dce9f7] px-5 py-3 text-[13px] font-bold text-[#3b0764]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking login...
        </span>
      </main>
    );
  }

  return (
    <main className="bg-white text-[#1f2937]">
      <section className="relative overflow-hidden px-4 py-6 md:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-visible">
          <div
            className="absolute hidden bg-[#dceefc] md:block"
            style={{
              width: "55px",
              height: "90px",
              top: "-20px",
              left: "-15px",
              borderRadius: "5px",
              transform: "rotate(140deg)",
            }}
          />
          <div
            className="absolute hidden bg-[#dceefc] md:block"
            style={{
              width: "60px",
              height: "120px",
              top: "-80px",
              left: "40px",
              borderRadius: "5px",
              transform: "rotate(140deg)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-9xl">
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="grid gap-5">
              <div className="grid gap-4 rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-8">
                <div>
                  <h1 className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] text-[#4c1d95] md:text-[42px]">
                    {loading
                      ? "Referral rewards"
                      : !referralConfigAvailable
                        ? "Referral details"
                        : programActive
                          ? "Refer a friend"
                          : "Referral rewards"}
                    <span className="block text-[#4ade80]">
                      {loading
                        ? "loading..."
                        : !referralConfigAvailable
                          ? "temporarily unavailable"
                          : programActive
                            ? "earn rewards"
                            : "currently paused"}
                    </span>
                  </h1>
                  <p className="mt-5 text-[17px] font-semibold text-[#1f2937] md:text-[19px]">
                    {loading
                      ? "Loading the current referral reward and eligibility terms."
                      : !referralConfigAvailable
                        ? "Current referral reward terms could not be loaded. Please try again shortly."
                        : programActive
                      ? `Refer a friend, earn ${formatCurrency(configuredReward)} when their loan is disbursed`
                      : "New referral sharing and reward eligibility are temporarily unavailable."}
                  </p>
                  {programActive && minimumDisbursementAmount > 0 ? (
                    <p className="mt-3 text-[13px] font-bold text-[#667085]">
                      Minimum eligible loan disbursement: {formatCurrency(minimumDisbursementAmount)}
                    </p>
                  ) : null}
                </div>
                <div className="relative min-h-50 md:min-h-57.5">
                  <Image
                    src="/assets/refer/image.png"
                    alt="Refer a friend illustration"
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 1024px) 38vw, 100vw"
                    className="object-contain object-center"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-8">
                {loading ? (
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#4c1d95]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading referral details...
                  </div>
                ) : error ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">
                    {error}
                  </p>
                ) : (
                  <>
                    {!programActive ? (
                      <p
                        role="status"
                        className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-bold text-amber-800"
                      >
                        Referral sharing is disabled while the program is paused. Your existing history remains available below.
                      </p>
                    ) : null}
                    <div className="grid gap-6 md:grid-cols-2">
                      {[
                        ["Your Referral Link", referralLink, "link"],
                        ["Your Referral Code", referralCode, "code"],
                      ].map(([label, value, key]) => (
                        <div key={label}>
                          <h2 className="text-[15px] font-extrabold text-[#1f2937]">
                            {label}
                          </h2>
                          <div className="mt-3 flex overflow-hidden rounded-lg border border-[#dde3ea]">
                            <input
                              readOnly
                              value={value}
                              className="h-11 min-w-0 flex-1 border-0 bg-white px-4 text-[13px] font-medium text-[#98a2b3] outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => copyValue(value, key)}
                              disabled={!programActive || !value}
                              className="inline-flex h-11 shrink-0 items-center gap-1.5 bg-[#dbeeff] px-4 text-[13px] font-bold text-[#6d28d9] disabled:cursor-not-allowed disabled:bg-[#edf1f5] disabled:text-[#98a2b3]"
                            >
                              <Copy className="h-4 w-4" />
                              {copied === key ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7">
                      <h2 className="text-[15px] font-extrabold text-[#1f2937]">
                        Share via
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {shareButtons.map(
                          ({ label, icon: Icon, color, action }) => (
                            <button
                              key={label}
                              type="button"
                              onClick={action}
                              disabled={!programActive || !referralLink}
                              className="inline-flex h-12 min-w-37 items-center justify-center gap-2.5 rounded-lg bg-[#eaf6ff] px-5 text-[14px] font-bold text-[#1f2937] disabled:cursor-not-allowed disabled:bg-[#edf1f5] disabled:text-[#98a2b3]"
                            >
                              <Icon
                                className="h-5 w-5 shrink-0"
                                style={{ color }}
                              />
                              {label}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 xl:p-7">
                {(loading ? Array.from({ length: 5 }) : summaryCards).map(
                  (item, index) => {
                    if (loading) {
                      return (
                        <div
                          key={index}
                          className="h-12 animate-pulse rounded bg-[#eef3f8]"
                        />
                      );
                    }
                    const {
                      value,
                      label,
                      icon: Icon,
                    } = item as (typeof summaryCards)[number];
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <Icon className="h-6 w-6 shrink-0 text-[#6d28d9]" />
                        <span>
                          <span className="block text-[17px] font-extrabold text-[#1f2937]">
                            {value}
                          </span>
                          <span className="text-[12px] font-medium leading-4 text-[#667085]">
                            {label}
                          </span>
                        </span>
                      </div>
                    );
                  },
                )}
              </div>

              <div
                data-referral-wallet
                className="rounded-2xl border border-[#d9e6f2] bg-[#f8fbff] p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-8"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#6d28d9]">
                      Referral wallet
                    </p>
                    <h2 className="mt-1 text-[22px] font-extrabold text-[#1f2937]">
                      Rewards and withdrawals
                    </h2>
                  </div>
                  <p className="max-w-xl text-[12px] font-semibold leading-5 text-[#667085]">
                    Withdrawal requests are reviewed and paid manually by the
                    Fintaraa admin team. Submitting a request does not trigger
                    an automatic transfer.
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Lifetime credited", wallet?.lifetimeCredited],
                    ["Reserved / pending", wallet?.reservedAmount],
                    ["Paid", wallet?.paidAmount],
                    ["Available wallet", wallet?.availableAmount],
                  ].map(([label, amount]) => (
                    <div
                      key={String(label)}
                      data-wallet-metric={String(label)}
                      className="rounded-xl border border-[#dce8f3] bg-white px-4 py-4"
                    >
                      <span className="block text-[11px] font-bold text-[#667085]">
                        {label}
                      </span>
                      <span className="mt-1 block text-[20px] font-extrabold text-[#17364e]">
                        {walletLoading
                          ? "Loading..."
                          : wallet
                            ? formatCurrency(Number(amount || 0))
                            : "—"}
                      </span>
                    </div>
                  ))}
                </div>

                {walletError ? (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold text-red-700"
                  >
                    {walletError}
                  </p>
                ) : null}
                {programPaused && walletApiReady ? (
                  <p className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-[12px] font-semibold text-blue-800">
                    The referral program is paused, but rewards already credited
                    to your available wallet can still be requested for payout.
                  </p>
                ) : null}

                <div className="mt-6 grid gap-6 xl:grid-cols-[340px_1fr]">
                  <form
                    aria-label="Request referral withdrawal"
                    onSubmit={submitWithdrawal}
                    className="h-fit rounded-2xl border border-[#dce8f3] bg-white p-5"
                  >
                    <h3 className="text-[16px] font-extrabold text-[#1f2937]">
                      Request withdrawal
                    </h3>
                    <p className="mt-2 text-[11px] font-semibold leading-5 text-[#667085]">
                      Minimum request: {formatCurrency(minimumPayoutAmount)}.
                      Admin will review the request and update its payment status.
                    </p>
                    <label
                      htmlFor="referral-withdrawal-amount"
                      className="mt-5 block text-[12px] font-extrabold text-[#344054]"
                    >
                      Withdrawal amount
                    </label>
                    <div className="mt-2 flex h-12 items-center rounded-xl border border-[#cfddea] bg-white px-3 focus-within:border-[#6d28d9]">
                      <span className="text-[15px] font-extrabold text-[#667085]">
                        ₹
                      </span>
                      <input
                        id="referral-withdrawal-amount"
                        name="withdrawalAmount"
                        type="number"
                        inputMode="decimal"
                        min={minimumPayoutAmount}
                        max={maximumPayoutAmount}
                        step="0.01"
                        value={withdrawalAmount}
                        disabled={withdrawalControlsDisabled}
                        aria-invalid={Boolean(withdrawalValidation)}
                        aria-describedby="referral-withdrawal-help"
                        onChange={(event) => {
                          setWithdrawalAmount(event.target.value);
                          setWithdrawalFeedback(null);
                        }}
                        placeholder={String(minimumPayoutAmount)}
                        className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-[15px] font-bold text-[#1f2937] outline-none disabled:cursor-not-allowed disabled:text-[#98a2b3]"
                      />
                    </div>
                    <p
                      id="referral-withdrawal-help"
                      className={`mt-2 text-[11px] font-semibold ${
                        withdrawalValidation ? "text-red-700" : "text-[#667085]"
                      }`}
                    >
                      {withdrawalValidation ||
                        `Available wallet: ${formatCurrency(availableBalance)}. Maximum per request: ${formatCurrency(maximumPayoutAmount)}.`}
                    </p>

                    {activePayoutRequest ? (
                      <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-800">
                        You already have an active {activePayoutRequest.status}
                        {" "}request for {formatCurrency(activePayoutRequest.amount)}.
                      </p>
                    ) : walletApiReady &&
                      availableBalance < minimumPayoutAmount ? (
                      <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700">
                        At least {formatCurrency(minimumPayoutAmount)} must be
                        available before you can request a withdrawal.
                      </p>
                    ) : walletApiReady && !walletAllowsRequest ? (
                      <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700">
                        A new withdrawal request is not available right now.
                      </p>
                    ) : null}

                    {withdrawalFeedback ? (
                      <p
                        role={
                          withdrawalFeedback.type === "error"
                            ? "alert"
                            : "status"
                        }
                        className={`mt-3 rounded-lg px-3 py-2 text-[11px] font-bold ${
                          withdrawalFeedback.type === "success"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {withdrawalFeedback.text}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={!canSubmitWithdrawal}
                      className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6d28d9] px-4 text-[12px] font-extrabold text-white disabled:cursor-not-allowed disabled:bg-[#9db9d1]"
                    >
                      {submittingWithdrawal ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : null}
                      {submittingWithdrawal
                        ? "Submitting request..."
                        : "Request withdrawal"}
                    </button>
                  </form>

                  <div className="min-w-0 rounded-2xl border border-[#dce8f3] bg-white p-5">
                    <h3 className="text-[16px] font-extrabold text-[#1f2937]">
                      Withdrawal requests
                    </h3>
                    {walletLoading ? (
                      <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-[#667085]">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading withdrawal requests...
                      </div>
                    ) : payoutRequests.length ? (
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-190 border-collapse text-left">
                          <thead>
                            <tr className="border-b border-[#e3e8ef] text-[11px] text-[#667085]">
                              {[
                                "Amount",
                                "Status",
                                "Requested",
                                "Status date",
                                "Reference",
                                "Note",
                              ].map((heading) => (
                                <th
                                  key={heading}
                                  className="px-2 py-2.5 font-extrabold"
                                >
                                  {heading}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {payoutRequests.map((request) => (
                              <tr
                                key={request.id}
                                data-payout-request={request.id}
                                className="border-b border-[#eef1f5] text-[11px] font-semibold text-[#475467]"
                              >
                                <td className="px-2 py-3 font-extrabold text-[#17364e]">
                                  {formatCurrency(request.amount)}
                                </td>
                                <td className="px-2 py-3">
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${payoutStatusClass(request.status)}`}
                                  >
                                    {payoutStatusLabel(request.status)}
                                  </span>
                                </td>
                                <td className="px-2 py-3 whitespace-nowrap">
                                  {formatDate(
                                    request.requestedAt || request.createdAt,
                                  )}
                                </td>
                                <td className="px-2 py-3 whitespace-nowrap">
                                  {formatDate(payoutStatusDate(request))}
                                </td>
                                <td className="px-2 py-3">
                                  {request.payoutReference || "—"}
                                </td>
                                <td className="max-w-55 px-2 py-3">
                                  {request.adminNote ||
                                    request.rejectionReason ||
                                    "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : walletApiReady ? (
                      <p className="mt-4 rounded-xl bg-[#f5f8fb] px-4 py-4 text-[12px] font-semibold text-[#667085]">
                        No withdrawal requests yet.
                      </p>
                    ) : (
                      <p className="mt-4 rounded-xl bg-[#f5f8fb] px-4 py-4 text-[12px] font-semibold text-[#667085]">
                        Withdrawal request history is unavailable.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-8">
                <h2 className="text-[20px] font-extrabold text-[#1f2937]">
                  Referral History
                </h2>
                {loading || history.length ? (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-245 border-collapse text-left">
                      <thead>
                        <tr className="border-b border-[#e3e8ef] text-[14px] text-[#1f2937]">
                          {[
                            "Name",
                            "Referred",
                            "Registered",
                            "Applied",
                            "Approved",
                            "Reward Paid",
                            "Reward",
                          ].map((head) => (
                            <th key={head} className="px-3 py-3 font-extrabold">
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {loading
                          ? Array.from({ length: 4 }).map((_, index) => (
                              <tr
                                key={index}
                                className="border-b border-[#eef1f5]"
                              >
                                <td colSpan={7} className="px-3 py-3.5">
                                  <div className="h-5 animate-pulse rounded bg-[#eef3f8]" />
                                </td>
                              </tr>
                            ))
                          : history.map((row) => (
                              <tr
                                key={row.id}
                                className="border-b border-[#eef1f5] text-[13.5px] font-medium text-[#98a2b3]"
                              >
                                <td className="px-3 py-3.5">
                                  {row.referredUser?.name || "New user"}
                                </td>
                                <td className="px-3 py-3.5">
                                  <StageCell date={row.createdAt} />
                                </td>
                                <td className="px-3 py-3.5">
                                  <StageCell date={row.registeredAt || row.createdAt} />
                                </td>
                                <td className="px-3 py-3.5">
                                  <StageCell date={row.appliedAt} />
                                </td>
                                <td className="px-3 py-3.5">
                                  <StageCell date={row.approvedAt} />
                                </td>
                                <td className="px-3 py-3.5">
                                  <StageCell date={row.paidAt} />
                                </td>
                                <td className="px-3 py-3.5 font-bold text-[#6d28d9]">
                                  {row.rewardAmount
                                    ? formatCurrency(row.rewardAmount)
                                    : "—"}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="mx-auto max-w-2xl text-center">
                      <h3 className="mt-5 text-[24px] font-extrabold text-[#1f2937]">
                        No referrals tracked yet
                      </h3>
                      <p className="mx-auto mt-3 max-w-xl text-[14px] font-semibold leading-7 text-[#667085]">
                        Share your referral link with friends. Once they sign up
                        and complete an eligible journey, their progress and
                        rewards will appear here.
                      </p>
                      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => copyValue(referralLink, "link")}
                          disabled={!programActive || !referralLink}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#4c1d95] px-6 text-[14px] font-extrabold text-white shadow-[0_12px_24px_rgba(0,92,168,0.18)] disabled:cursor-not-allowed disabled:bg-[#9db9d1]"
                        >
                          <Copy className="h-4 w-4" />
                          Copy Referral Link
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openShare(
                              `https://wa.me/?text=${encodeURIComponent(`${shareText} ${referralLink}`)}`,
                            )
                          }
                          disabled={!programActive || !referralLink}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1cb45c] px-6 text-[14px] font-extrabold text-white shadow-[0_12px_24px_rgba(28,180,92,0.18)] disabled:cursor-not-allowed disabled:bg-[#b7dec6]"
                        >
                          <Share2 className="h-4 w-4" />
                          Share Now
                        </button>
                      </div>
                      {copied === "link" ? (
                        <p className="mt-3 text-[12px] font-bold text-[#1cb45c]">
                          Referral link copied.
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className="grid h-fit gap-5">
              <div className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-7">
                <h2 className="text-[16px] font-extrabold text-[#1f2937]">
                  Your Earnings
                </h2>
                <div className="mt-5 flex items-center gap-4">
                  <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#fde9c8]">
                    <Image
                      src="/assets/refer/badge.png"
                      alt="Rewards badge"
                      fill
                      unoptimized
                      className="rounded-full object-contain p-2"
                    />
                  </span>
                  <span>
                    <span className="block text-[26px] font-extrabold text-[#1f2937]">
                      {formatCurrency(
                        summary?.totalEarnings || summary?.amount,
                      )}
                    </span>
                    <span className="text-[13px] font-medium text-[#98a2b3]">
                      Total Rewards Earned
                    </span>
                  </span>
                </div>
                <p className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-[12px] font-semibold leading-5 text-emerald-700">
                  {programActive
                    ? `Eligible rewards are credited after loan disbursement${minimumDisbursementAmount > 0 ? ` of at least ${formatCurrency(minimumDisbursementAmount)}` : ""}, and payout status is updated here by the Fintaraa team.`
                    : programPaused
                      ? "New referral rewards are paused. Existing payout history remains visible here."
                      : "Current reward terms are unavailable. Refresh the page before sharing a referral."}
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-7">
                <h2 className="text-[19px] font-extrabold text-[#1f2937]">
                  {programActive
                    ? "How it works"
                    : programPaused
                      ? "How it works when active"
                      : "How referrals work"}
                </h2>
                <div className="mt-5 grid gap-5">
                  {howItWorks.map((item, index) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dbeeff] text-[13px] font-extrabold text-[#6d28d9]">
                        {index + 1}
                      </span>
                      <p className="pt-0.5 text-[13.5px] font-medium leading-5 text-[#475467]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <ServiceAppBanner />
    </main>
  );
}
