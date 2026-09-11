"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Banknote,
  BookOpen,
  ChartNoAxesCombined,
  ClipboardList,
  Copy,
  ExternalLink,
  FileCheck2,
  Landmark,
  Medal,
  MessageCircle,
  RefreshCw,
  Send,
  Share2,
  Trophy,
  WalletCards,
} from "lucide-react";
import {
  createDsaPortalPayout,
  fetchDsaPortalCommissions,
  fetchDsaPortalDashboard,
  fetchDsaPortalLeaderboard,
  fetchDsaPortalPayouts,
  fetchDsaPortalProfile,
  fetchDsaPortalReferral,
  fetchDsaPortalTraining,
  updateDsaPortalPayoutProfile,
  type DsaPayoutMethod,
  type DsaPortalCommission,
  type DsaPortalDashboard,
  type DsaPortalLeaderboardEntry,
  type DsaPortalPayout,
  type DsaPortalProfile,
  type DsaPortalReferral,
  type DsaPortalTrainingItem,
} from "@/services/dsaPortal";

type WorkspaceTab =
  | "dashboard"
  | "commissions"
  | "payouts"
  | "referral"
  | "leaderboard"
  | "training";

type Props = {
  onShowLeads: () => void;
};

const tabs = [
  { key: "dashboard", label: "Dashboard", icon: ChartNoAxesCombined },
  { key: "commissions", label: "Commissions", icon: Banknote },
  { key: "payouts", label: "Payouts", icon: WalletCards },
  { key: "referral", label: "Referral link", icon: Share2 },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy },
  { key: "training", label: "Training", icon: BookOpen },
] as const;

const formatINR = (value?: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

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

const titleCase = (value?: string) => {
  const normalized = String(value || "")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .trim();
  if (!normalized) return "Not available";
  return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const safeExternalUrl = (value?: string) => {
  const candidate = String(value || "").trim();
  return /^https?:\/\//i.test(candidate) ? candidate : "";
};

const statusClass = (value?: string) => {
  const status = String(value || "").toLowerCase();
  if (["approved", "earned", "paid", "active", "completed"].includes(status)) {
    return "bg-[#eafaf2] text-[#087443]";
  }
  if (["rejected", "failed", "reversed", "clawback_required"].includes(status)) {
    return "bg-[#fff0ee] text-[#b42318]";
  }
  return "bg-[#fff8e6] text-[#9a6700]";
};

const errorMessage = (error: unknown, fallback: string) =>
  (error as Error)?.message || fallback;

export function DsaPortalWorkspace({ onShowLeads }: Props) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("dashboard");
  const [profile, setProfile] = useState<DsaPortalProfile | null>(null);
  const [dashboard, setDashboard] = useState<DsaPortalDashboard | null>(null);
  const [commissions, setCommissions] = useState<DsaPortalCommission[]>([]);
  const [payouts, setPayouts] = useState<DsaPortalPayout[]>([]);
  const [referral, setReferral] = useState<DsaPortalReferral | null>(null);
  const [leaderboard, setLeaderboard] = useState<DsaPortalLeaderboardEntry[]>([]);
  const [training, setTraining] = useState<DsaPortalTrainingItem[]>([]);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<
    "month" | "quarter" | "all"
  >("month");
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copy link");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [showPayoutEditor, setShowPayoutEditor] = useState(false);
  const [savingPayoutProfile, setSavingPayoutProfile] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<DsaPayoutMethod>("bank_transfer");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");

  const isApproved =
    String(profile?.onboardingStatus || "").toLowerCase() === "approved";
  const isPrimaryDsa = profile?.role !== "agency_member";

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const nextProfile = await fetchDsaPortalProfile();
      setProfile(nextProfile);
      setPayoutMethod(nextProfile.payoutProfile?.method || "bank_transfer");
      setAccountHolder(nextProfile.payoutProfile?.accountHolder || "");
      setIfsc(nextProfile.payoutProfile?.ifsc || "");
      setBankName(nextProfile.payoutProfile?.bankName || "");

      if (
        String(nextProfile.onboardingStatus || "").toLowerCase() !== "approved"
      ) {
        return;
      }

      const results = await Promise.allSettled([
        fetchDsaPortalDashboard(),
        fetchDsaPortalCommissions({ page: 1, limit: 50 }),
        fetchDsaPortalPayouts({ page: 1, limit: 50 }),
        fetchDsaPortalReferral(),
        fetchDsaPortalLeaderboard("month"),
        fetchDsaPortalTraining({ page: 1, limit: 50 }),
      ]);

      if (results[0].status === "fulfilled") setDashboard(results[0].value);
      if (results[1].status === "fulfilled") setCommissions(results[1].value.items);
      if (results[2].status === "fulfilled") setPayouts(results[2].value.items);
      if (results[3].status === "fulfilled") setReferral(results[3].value);
      if (results[4].status === "fulfilled") setLeaderboard(results[4].value.items);
      if (results[5].status === "fulfilled") setTraining(results[5].value.items);

      const failed = results.filter((result) => result.status === "rejected");
      if (failed.length) {
        setLoadError(
          `${failed.length} workspace section${failed.length === 1 ? " is" : "s are"} temporarily unavailable. Refresh to retry.`,
        );
      }
    } catch (error) {
      setLoadError(errorMessage(error, "Unable to load the DSA workspace."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadWorkspace();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadWorkspace]);

  const changeLeaderboardPeriod = async (
    period: "month" | "quarter" | "all",
  ) => {
    setLeaderboardPeriod(period);
    setLeaderboardLoading(true);
    setActionMessage("");
    try {
      const result = await fetchDsaPortalLeaderboard(period);
      setLeaderboard(result.items);
    } catch (error) {
      setActionMessage(errorMessage(error, "Unable to refresh leaderboard."));
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const copyReferral = async () => {
    if (!referral?.shareUrl) return;
    try {
      await navigator.clipboard.writeText(referral.shareUrl);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy link"), 1800);
    } catch {
      setActionMessage("Copy was blocked by the browser. Select the link manually.");
    }
  };

  const shareReferral = async () => {
    if (!referral?.shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Apply with Fintaraa",
          text: referral.smsText || "Apply using my DSA referral link",
          url: referral.shareUrl,
        });
        return;
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return;
      }
    }
    await copyReferral();
  };

  const submitPayout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionMessage("");
    const amount = Number(payoutAmount);
    const available = Number(dashboard?.payoutBalances.availableToRequest || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      setActionMessage("Enter a valid payout amount.");
      return;
    }
    if (amount > available) {
      setActionMessage(`You can request up to ${formatINR(available)}.`);
      return;
    }
    const method = profile?.payoutProfile?.method;
    if (!method) {
      setActionMessage("Save a payout destination before requesting payment.");
      return;
    }

    setRequestingPayout(true);
    try {
      await createDsaPortalPayout({
        amount,
        method,
        notes: payoutNotes.trim() || undefined,
      });
      const [nextDashboard, nextPayouts] = await Promise.all([
        fetchDsaPortalDashboard(),
        fetchDsaPortalPayouts({ page: 1, limit: 50 }),
      ]);
      setDashboard(nextDashboard);
      setPayouts(nextPayouts.items);
      setPayoutAmount("");
      setPayoutNotes("");
      setActionMessage("Payout request submitted for admin approval.");
    } catch (error) {
      setActionMessage(errorMessage(error, "Unable to create payout request."));
    } finally {
      setRequestingPayout(false);
    }
  };

  const savePayoutProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionMessage("");
    if (
      payoutMethod === "bank_transfer" &&
      accountNumber.replace(/\s/g, "") !== confirmAccountNumber.replace(/\s/g, "")
    ) {
      setActionMessage("Account number and confirmation do not match.");
      return;
    }
    setSavingPayoutProfile(true);
    try {
      await updateDsaPortalPayoutProfile(
        payoutMethod === "upi"
          ? { method: payoutMethod, upiId: upiId.trim() }
          : {
              method: payoutMethod,
              accountNumber: accountNumber.replace(/\s/g, ""),
              ifsc: ifsc.trim().toUpperCase(),
              accountHolder: accountHolder.trim(),
              bankName: bankName.trim() || undefined,
            },
      );
      const nextProfile = await fetchDsaPortalProfile();
      setProfile(nextProfile);
      setShowPayoutEditor(false);
      setUpiId("");
      setAccountNumber("");
      setConfirmAccountNumber("");
      setActionMessage(
        "Payout destination saved securely. Admin re-approval is required before the next payout request.",
      );
    } catch (error) {
      setActionMessage(errorMessage(error, "Unable to save payout destination."));
    } finally {
      setSavingPayoutProfile(false);
    }
  };

  const dashboardCards = useMemo(() => {
    if (!dashboard) return [];
    return [
      {
        label: "Applications submitted",
        value: dashboard.kpis.totalApplications.toLocaleString("en-IN"),
        hint: `${dashboard.kpis.activeApplications} active`,
        icon: ClipboardList,
      },
      {
        label: "Approved",
        value: dashboard.kpis.approvedApplications.toLocaleString("en-IN"),
        hint: `${dashboard.kpis.approvalRate.toFixed(1)}% approval rate`,
        icon: BadgeCheck,
      },
      {
        label: "Disbursed",
        value: dashboard.kpis.disbursedApplications.toLocaleString("en-IN"),
        hint: formatINR(dashboard.kpis.totalDisbursedAmount),
        icon: FileCheck2,
      },
      {
        label: "Commission earned",
        value: formatINR(dashboard.kpis.earnedCommission),
        hint: `${formatINR(dashboard.kpis.paidCommission)} paid`,
        icon: Banknote,
      },
      {
        label: "Available payout",
        value: formatINR(dashboard.payoutBalances.availableToRequest),
        hint: `${formatINR(dashboard.payoutBalances.pendingRequestedAmount)} requested`,
        icon: WalletCards,
      },
      {
        label: "Conversion",
        value: `${dashboard.kpis.conversionRate.toFixed(1)}%`,
        hint: "Application to disbursal",
        icon: ChartNoAxesCombined,
      },
    ];
  }, [dashboard]);

  if (loading && !profile) {
    return (
      <div className="border border-[#e1edf8] bg-white p-6 text-[14px] font-semibold text-[#667085]">
        Loading DSA workspace...
      </div>
    );
  }

  if (!profile) {
    return (
      <WorkspaceNotice
        title="DSA workspace unavailable"
        body={loadError || "We could not load your DSA account."}
        action={<button type="button" onClick={() => void loadWorkspace()} className="rounded-full bg-[#3b0764] px-5 py-2.5 text-[13px] font-extrabold text-white">Retry</button>}
      />
    );
  }

  if (!isApproved) {
    const rejected =
      String(profile.onboardingStatus || "").toLowerCase() === "rejected";
    return (
      <WorkspaceNotice
        title={rejected ? "DSA onboarding needs changes" : "DSA approval is pending"}
        body={
          rejected
            ? profile.rejectionReason || profile.reviewNotes || "Review the requested changes and resubmit your profile."
            : "Your dashboard, commissions, referral tools, payouts, leaderboard, and training unlock after admin approval."
        }
        detail={`Profile completion: ${Number(profile.profileCompletion || 0)}%`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/partner/profile/complete" className="rounded-full bg-[#3b0764] px-5 py-2.5 text-[13px] font-extrabold text-white no-underline">{rejected ? "Update and resubmit" : "Review profile"}</Link>
            <button type="button" onClick={() => void loadWorkspace()} className="inline-flex items-center gap-2 rounded-full border border-[#cfe0ed] px-5 py-2.5 text-[13px] font-extrabold text-[#3b0764]"><RefreshCw className="h-4 w-4" />Refresh status</button>
          </div>
        }
      />
    );
  }

  return (
    <div className="grid gap-5" data-testid="dsa-workspace">
      <div className="flex flex-col gap-3 border border-[#dbeaf6] bg-[#f7fbff] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#eafaf2] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#087443]">Approved DSA</span>
            <span className="text-[12px] font-bold text-[#667085]">ID: {profile.agencyId || "-"}</span>
          </div>
          <p className="mt-2 text-[13px] font-semibold text-[#667085]">Track applications, commissions, payouts, referrals, rank, and product learning in one place.</p>
        </div>
        <button type="button" onClick={() => void loadWorkspace()} disabled={loading} className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#cfe0ed] bg-white px-4 text-[13px] font-extrabold text-[#3b0764] disabled:opacity-60"><RefreshCw className="h-4 w-4" />Refresh workspace</button>
      </div>

      {loadError ? <Notice tone="error">{loadError}</Notice> : null}
      {actionMessage ? <Notice>{actionMessage}</Notice> : null}

      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="DSA workspace sections">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setActiveTab(key);
              setActionMessage("");
            }}
            className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[12px] font-extrabold transition ${activeTab === key ? "bg-[#3b0764] text-white" : "bg-[#edf6ff] text-[#344054] hover:text-[#3b0764]"}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "dashboard" ? (
        <div className="grid gap-5">
          {dashboard ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {dashboardCards.map(({ label, value, hint, icon: Icon }) => (
                <div key={label} className="border border-[#e1edf8] bg-white p-4">
                  <Icon className="h-5 w-5 text-[#3b0764]" />
                  <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#667085]">{label}</p>
                  <p className="mt-2 text-[24px] font-extrabold text-[#07162d]">{value}</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#667085]">{hint}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState text="Dashboard metrics are unavailable right now." />
          )}
          <div className="grid gap-3 md:grid-cols-3">
            <QuickAction icon={<ClipboardList className="h-5 w-5" />} title="View applications" body="Review every submitted lead and its latest stage." onClick={onShowLeads} />
            <QuickAction icon={<Share2 className="h-5 w-5" />} title="Share referral link" body="Send your attributed link to a prospective customer." onClick={() => setActiveTab("referral")} />
            <QuickAction icon={<WalletCards className="h-5 w-5" />} title="Track payout" body="See available balance and admin payout progress." onClick={() => setActiveTab("payouts")} />
          </div>
        </div>
      ) : null}

      {activeTab === "commissions" ? (
        <DataPanel title="Commission ledger" description="Commission is calculated after an eligible application is approved and disbursed.">
          {commissions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#f7fbff] text-[11px] uppercase tracking-[0.08em] text-[#667085]"><tr><th className="p-3">Customer / application</th><th className="p-3">Product</th><th className="p-3">Disbursed</th><th className="p-3">Commission</th><th className="p-3">Status</th><th className="p-3">Date</th></tr></thead>
                <tbody>
                  {commissions.map((item, index) => {
                    const status = item.status || item.earningStatus;
                    return <tr key={item.id || item._id || `${item.applicationId}-${index}`} className="border-t border-[#edf3f8] text-[13px] font-semibold text-[#344054]"><td className="p-3"><p className="font-extrabold text-[#07162d]">{item.customerName || "Customer"}</p><p className="mt-1 text-[11px] text-[#667085]">{item.applicationId || "-"}</p></td><td className="p-3">{titleCase(item.loanType || item.productType)}</td><td className="p-3">{formatINR(item.disbursedAmount)}</td><td className="p-3 font-extrabold text-[#3b0764]">{formatINR(item.commissionAmount)}</td><td className="p-3"><StatusBadge value={status} /></td><td className="p-3">{formatDate(item.paidAt || item.disbursedAt || item.createdAt)}</td></tr>;
                  })}
                </tbody>
              </table>
            </div>
          ) : <EmptyState text="No commission entries yet. Eligible commission appears after disbursal." />}
        </DataPanel>
      ) : null}

      {activeTab === "payouts" ? (
        <div className="grid gap-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Available" value={formatINR(dashboard?.payoutBalances.availableToRequest)} />
            <Metric label="Requested" value={formatINR(dashboard?.payoutBalances.pendingRequestedAmount)} />
            <Metric label="Paid" value={formatINR(dashboard?.payoutBalances.paidAmount)} />
            <Metric label="Paid requests" value={String(dashboard?.payoutStats.paidRequests || 0)} />
          </div>

          <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
            <DataPanel title="Request payout" description="The admin verifies and pays the request manually, then updates its status here.">
              <div className="mb-4 bg-[#f7fbff] p-4 text-[13px] font-semibold text-[#344054]">
                <div className="flex items-center justify-between gap-3"><span>Saved destination</span><span className="font-extrabold text-[#3b0764]">{profile.payoutProfile?.maskedDestination || (isPrimaryDsa ? "Not configured" : "Managed by primary DSA")}</span></div>
                {profile.payoutProfile?.method ? <div className="mt-2 flex items-center justify-between gap-3"><span>Method</span><span className="font-extrabold">{titleCase(profile.payoutProfile.method)}</span></div> : null}
              </div>
              {isPrimaryDsa && !showPayoutEditor ? (
                <button type="button" onClick={() => setShowPayoutEditor(true)} className="mb-4 text-[12px] font-extrabold text-[#3b0764] underline underline-offset-4">{profile.hasPayoutProfile ? "Change payout destination" : "Set payout destination"}</button>
              ) : isPrimaryDsa ? (
                <form onSubmit={savePayoutProfile} className="mb-5 grid gap-3 border border-[#dbeaf6] p-4">
                  <p className="text-[12px] font-bold text-[#9a6700]">Changing payout details sends your DSA profile for admin re-approval.</p>
                  <label className="grid gap-1 text-[12px] font-extrabold text-[#344054]">Method<select value={payoutMethod} onChange={(event) => setPayoutMethod(event.target.value as DsaPayoutMethod)} className="h-11 border border-[#cfe0ed] bg-white px-3 outline-none"><option value="bank_transfer">Bank transfer</option><option value="upi">UPI</option></select></label>
                  {payoutMethod === "upi" ? (
                    <label className="grid gap-1 text-[12px] font-extrabold text-[#344054]">UPI ID<input value={upiId} onChange={(event) => setUpiId(event.target.value)} required placeholder="name@bank" className="h-11 border border-[#cfe0ed] px-3 outline-none" /></label>
                  ) : (
                    <>
                      <label className="grid gap-1 text-[12px] font-extrabold text-[#344054]">Account holder<input value={accountHolder} onChange={(event) => setAccountHolder(event.target.value)} required className="h-11 border border-[#cfe0ed] px-3 outline-none" /></label>
                      <label className="grid gap-1 text-[12px] font-extrabold text-[#344054]">Account number<input value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} inputMode="numeric" required placeholder="Enter full account number" className="h-11 border border-[#cfe0ed] px-3 outline-none" /></label>
                      <label className="grid gap-1 text-[12px] font-extrabold text-[#344054]">Confirm account number<input value={confirmAccountNumber} onChange={(event) => setConfirmAccountNumber(event.target.value)} inputMode="numeric" required placeholder="Re-enter account number" className="h-11 border border-[#cfe0ed] px-3 outline-none" /></label>
                      <label className="grid gap-1 text-[12px] font-extrabold text-[#344054]">IFSC<input value={ifsc} onChange={(event) => setIfsc(event.target.value.toUpperCase())} required className="h-11 border border-[#cfe0ed] px-3 uppercase outline-none" /></label>
                      <label className="grid gap-1 text-[12px] font-extrabold text-[#344054]">Bank name (optional)<input value={bankName} onChange={(event) => setBankName(event.target.value)} className="h-11 border border-[#cfe0ed] px-3 outline-none" /></label>
                    </>
                  )}
                  <div className="flex flex-wrap gap-2"><button type="submit" disabled={savingPayoutProfile} className="rounded-full bg-[#3b0764] px-4 py-2.5 text-[12px] font-extrabold text-white disabled:opacity-60">{savingPayoutProfile ? "Saving..." : "Save securely"}</button><button type="button" onClick={() => setShowPayoutEditor(false)} className="rounded-full border border-[#cfe0ed] px-4 py-2.5 text-[12px] font-extrabold text-[#344054]">Cancel</button></div>
                </form>
              ) : null}
              {isPrimaryDsa ? <form onSubmit={submitPayout} className="grid gap-3">
                <label className="grid gap-1 text-[12px] font-extrabold text-[#344054]">Amount<input aria-label="Payout amount" value={payoutAmount} onChange={(event) => setPayoutAmount(event.target.value)} type="number" min={dashboard?.payoutBalances.minimumPayoutAmount || 0.01} max={dashboard?.payoutBalances.availableToRequest || undefined} step="0.01" required className="h-11 border border-[#cfe0ed] px-3 outline-none" placeholder="Enter amount" /></label>
                <label className="grid gap-1 text-[12px] font-extrabold text-[#344054]">Note (optional)<textarea value={payoutNotes} onChange={(event) => setPayoutNotes(event.target.value)} rows={3} maxLength={300} className="border border-[#cfe0ed] p-3 outline-none" placeholder="Note for the payout team" /></label>
                <button type="submit" disabled={requestingPayout || !profile.hasPayoutProfile || !dashboard?.payoutBalances.availableToRequest || Boolean(dashboard?.payoutStats.pendingRequests)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#12b76a] px-5 text-[13px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" />{requestingPayout ? "Submitting..." : "Request payout"}</button>
                {dashboard?.payoutStats.pendingRequests ? <p className="text-[12px] font-semibold text-[#9a6700]">An active payout request is already being processed.</p> : null}
              </form> : <EmptyState text="Only the primary DSA can update payout details or submit a payout request. Team members can view the shared payout history." />}
            </DataPanel>

            <DataPanel title="Payout history" description="Follow each request from submission to admin approval and payment.">
              {payouts.length ? <div className="grid gap-3">{payouts.map((item, index) => <div key={item.id || item._id || index} className="grid gap-3 bg-[#f7fbff] p-4 sm:grid-cols-[1fr_auto]"><div><div className="flex flex-wrap items-center gap-2"><p className="text-[16px] font-extrabold text-[#07162d]">{formatINR(item.amount)}</p><StatusBadge value={item.status} /></div><p className="mt-2 text-[12px] font-semibold text-[#667085]">{titleCase(item.method)}{item.destinationMasked ? ` | ${item.destinationMasked}` : ""} | Requested {formatDate(item.createdAt)}</p>{item.paymentReference ? <p className="mt-1 text-[12px] font-bold text-[#3b0764]">Reference: {item.paymentReference}</p> : null}{item.failureReason ? <p className="mt-1 text-[12px] font-bold text-[#b42318]">{item.failureReason}</p> : null}</div><p className="text-[12px] font-semibold text-[#667085]">Updated {formatDate(item.updatedAt)}</p></div>)}</div> : <EmptyState text="No payout requests submitted yet." />}
            </DataPanel>
          </div>
        </div>
      ) : null}

      {activeTab === "referral" ? (
        <DataPanel title="Lead sharing and referral link" description="Every application opened through this link is attributed to your DSA account.">
          {referral?.shareUrl ? (
            <div className="grid gap-5">
              <div className="bg-[#f7fbff] p-5"><p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#667085]">Referral code</p><p className="mt-2 text-[28px] font-extrabold tracking-[0.08em] text-[#3b0764]">{referral.referralCode || profile.referralCode}</p><label className="mt-4 grid gap-2 text-[12px] font-extrabold text-[#344054]">Your attributed link<input readOnly value={referral.shareUrl} onFocus={(event) => event.currentTarget.select()} className="h-12 w-full border border-[#cfe0ed] bg-white px-3 font-semibold outline-none" /></label></div>
              <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void copyReferral()} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#3b0764] px-5 text-[13px] font-extrabold text-white"><Copy className="h-4 w-4" />{copyLabel}</button><a href={safeExternalUrl(referral.whatsappUrl)} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#12b76a] px-5 text-[13px] font-extrabold text-white no-underline"><MessageCircle className="h-4 w-4" />WhatsApp</a><a href={`sms:?&body=${encodeURIComponent(referral.smsText || referral.shareUrl)}`} className="inline-flex h-11 items-center gap-2 rounded-full border border-[#cfe0ed] px-5 text-[13px] font-extrabold text-[#3b0764] no-underline"><Send className="h-4 w-4" />SMS</a><button type="button" onClick={() => void shareReferral()} className="inline-flex h-11 items-center gap-2 rounded-full border border-[#cfe0ed] px-5 text-[13px] font-extrabold text-[#3b0764]"><Share2 className="h-4 w-4" />More</button></div>
              <p className="text-[12px] font-semibold leading-5 text-[#667085]">Share only this generated link or code. The backend records the DSA attribution when the customer starts and submits an application.</p>
            </div>
          ) : <EmptyState text="Referral link is unavailable. Refresh the workspace to retry." />}
        </DataPanel>
      ) : null}

      {activeTab === "leaderboard" ? (
        <DataPanel title="DSA performance leaderboard" description="Ranking combines disbursal performance and earned commission.">
          <div className="mb-4 flex flex-wrap gap-2">{(["month", "quarter", "all"] as const).map((period) => <button key={period} type="button" disabled={leaderboardLoading} onClick={() => void changeLeaderboardPeriod(period)} className={`rounded-full px-4 py-2 text-[12px] font-extrabold ${leaderboardPeriod === period ? "bg-[#3b0764] text-white" : "bg-[#edf6ff] text-[#344054]"}`}>{period === "all" ? "All time" : titleCase(period)}</button>)}</div>
          {leaderboardLoading ? <EmptyState text="Refreshing leaderboard..." /> : leaderboard.length ? <div className="grid gap-3">{leaderboard.map((item, index) => { const current = item.isCurrentDsa || item.isCurrentAgency; return <div key={item._id || item.agencyId || index} className={`grid gap-3 p-4 sm:grid-cols-[auto_1fr_repeat(3,auto)] sm:items-center ${current ? "bg-[#eafaf2] ring-1 ring-[#9ee2bf]" : "bg-[#f7fbff]"}`}><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[15px] font-extrabold text-[#3b0764]">{Number(item.rank || index + 1) <= 3 ? <Medal className="h-5 w-5" /> : `#${item.rank || index + 1}`}</div><div><p className="text-[14px] font-extrabold text-[#07162d]">{item.businessName || item.name || "DSA Partner"}{current ? " (You)" : ""}</p><p className="mt-1 text-[11px] font-semibold text-[#667085]">{item.agencyId || item.referralCode || "-"}</p></div><LeaderboardStat label="Applications" value={item.applications} /><LeaderboardStat label="Approval" value={`${Number(item.approvalRate || 0).toFixed(1)}%`} /><LeaderboardStat label="Revenue" value={formatINR(item.revenue || item.totalCommission)} /></div>; })}</div> : <EmptyState text="No ranked DSA performance is available for this period." />}
        </DataPanel>
      ) : null}

      {activeTab === "training" ? (
        <DataPanel title="Training and product knowledge" description="Use approved guides, PDFs, and videos to improve product understanding and lead quality.">
          {training.length ? <div className="grid gap-4 md:grid-cols-2">{training.map((item, index) => { const resourceUrl = safeExternalUrl(item.url || item.documentUrl || item.videoUrl || item.youtubeUrl); return <article key={item.id || item._id || item.slug || index} className="border border-[#e1edf8] bg-white p-5"><div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf6ff] text-[#3b0764]"><BookOpen className="h-5 w-5" /></div><span className="rounded-full bg-[#f7fbff] px-3 py-1 text-[11px] font-extrabold text-[#667085]">{titleCase(item.type || item.trainingType)}</span></div><h3 className="mt-4 text-[17px] font-extrabold text-[#07162d]">{item.title || "Training resource"}</h3><p className="mt-2 line-clamp-3 text-[13px] font-semibold leading-5 text-[#667085]">{item.description || item.summary || "Open this resource for product guidance."}</p>{resourceUrl ? <a href={resourceUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-[13px] font-extrabold text-[#3b0764] no-underline">Open resource <ExternalLink className="h-4 w-4" /></a> : <p className="mt-4 text-[12px] font-semibold text-[#9a6700]">Resource file is being prepared.</p>}</article>; })}</div> : <EmptyState text="No training materials have been published yet." />}
        </DataPanel>
      ) : null}
    </div>
  );
}

function DataPanel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="border border-[#e1edf8] bg-white p-5"><div className="mb-5"><h3 className="text-[18px] font-extrabold text-[#07162d]">{title}</h3><p className="mt-1 text-[12px] font-semibold text-[#667085]">{description}</p></div>{children}</section>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="bg-[#f7fbff] p-5 text-[13px] font-semibold text-[#667085]">{text}</div>;
}

function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "error" }) {
  return <div className={`p-4 text-[13px] font-semibold ${tone === "error" ? "bg-[#fff0ee] text-[#b42318] ring-1 ring-[#ffd0ca]" : "bg-[#eef8ff] text-[#3b0764] ring-1 ring-[#cfe8fb]"}`}>{children}</div>;
}

function StatusBadge({ value }: { value?: string }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-extrabold ${statusClass(value)}`}>{titleCase(value)}</span>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="border border-[#e1edf8] bg-[#f7fbff] p-4"><p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#667085]">{label}</p><p className="mt-2 text-[22px] font-extrabold text-[#07162d]">{value}</p></div>;
}

function LeaderboardStat({ label, value }: { label: string; value?: number | string }) {
  return <div className="min-w-20 sm:text-right"><p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#667085]">{label}</p><p className="mt-1 text-[13px] font-extrabold text-[#07162d]">{value ?? 0}</p></div>;
}

function QuickAction({ icon, title, body, onClick }: { icon: React.ReactNode; title: string; body: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex items-start gap-3 border border-[#e1edf8] bg-white p-4 text-left transition hover:border-[#8ebce0]"><span className="text-[#3b0764]">{icon}</span><span><span className="block text-[14px] font-extrabold text-[#07162d]">{title}</span><span className="mt-1 block text-[12px] font-semibold leading-5 text-[#667085]">{body}</span></span></button>;
}

function WorkspaceNotice({ title, body, detail, action }: { title: string; body: string; detail?: string; action: React.ReactNode }) {
  return <div className="border border-[#dbeaf6] bg-[#f7fbff] p-6"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#3b0764]"><Landmark className="h-6 w-6" /></div><h3 className="mt-4 text-[21px] font-extrabold text-[#07162d]">{title}</h3><p className="mt-2 max-w-2xl text-[13px] font-semibold leading-6 text-[#667085]">{body}</p>{detail ? <p className="mt-2 text-[12px] font-extrabold text-[#3b0764]">{detail}</p> : null}<div className="mt-5">{action}</div></div>;
}
