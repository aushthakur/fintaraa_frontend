"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Copy,
  Mail,
  Camera,
  Share2,
  Loader2,
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
  fetchReferralSummary,
  fetchReferralHistory,
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

export function ReferPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [history, setHistory] = useState<ReferralHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

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

  const referralCode = summary?.referralCode || "";
  const referralLink = useMemo(() => {
    if (typeof window === "undefined" || !referralCode) return "";
    return `${window.location.origin}/login?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  const shareText = referralCode
    ? `Use my Fintaraa referral code ${referralCode} to explore loans, cards and insurance.`
    : "Join Fintaraa to explore loans, cards and insurance.";

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
      color: "#005ca8",
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
      value: String(
        summary?.successfulReferrals || summary?.rewardedCount || 0,
      ),
      label: "Successful",
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

  if (!authReady) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#dce9f7] px-5 py-3 text-[13px] font-bold text-[#195585]">
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
                  <h1 className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] text-[#005ca8] md:text-[42px]">
                    Refer a friend
                    <span className="block text-[#4ade80]">earn rewards</span>
                  </h1>
                  <p className="mt-5 text-[17px] font-semibold text-[#1f2937] md:text-[19px]">
                    Track registrations, conversions and rewards live
                  </p>
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
                  <div className="flex items-center gap-2 text-[13px] font-bold text-[#005ca8]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading referral details...
                  </div>
                ) : error ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] font-bold text-red-700">
                    {error}
                  </p>
                ) : (
                  <>
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
                              className="inline-flex h-11 shrink-0 items-center gap-1.5 bg-[#dbeeff] px-4 text-[13px] font-bold text-[#0d64bf]"
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
                              className="inline-flex h-12 min-w-37 items-center justify-center gap-2.5 rounded-lg bg-[#eaf6ff] px-5 text-[14px] font-bold text-[#1f2937]"
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
                        <Icon className="h-6 w-6 shrink-0 text-[#0d64bf]" />
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

              <div className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-8">
                <h2 className="text-[20px] font-extrabold text-[#1f2937]">
                  Referral History
                </h2>
                {loading || history.length ? (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-170 border-collapse text-left">
                      <thead>
                        <tr className="border-b border-[#e3e8ef] text-[14px] text-[#1f2937]">
                          {[
                            "Name",
                            "Date",
                            "Status",
                            "Reward",
                            "Conversion",
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
                                <td colSpan={5} className="px-3 py-3.5">
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
                                  {formatDate(row.createdAt)}
                                </td>
                                <td className="px-3 py-3.5 font-bold text-[#0d64bf]">
                                  {row.status}
                                </td>
                                <td className="px-3 py-3.5">
                                  {formatCurrency(row.rewardAmount)}
                                </td>
                                <td className="px-3 py-3.5">
                                  <span
                                    className={`rounded-sm px-2.5 py-1 text-[12px] font-semibold ${
                                      row.conversionStatus === "Converted"
                                        ? "bg-[#cdf3da] text-[#1cb45c]"
                                        : "bg-[#eef3bd] text-[#a3a300]"
                                    }`}
                                  >
                                    {row.conversionStatus || "Pending"}
                                  </span>
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
                          disabled={!referralLink}
                          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#005ca8] px-6 text-[14px] font-extrabold text-white shadow-[0_12px_24px_rgba(0,92,168,0.18)] disabled:cursor-not-allowed disabled:bg-[#9db9d1]"
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
                          disabled={!referralLink}
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
                <button
                  type="button"
                  className="mt-6 h-12 w-full rounded-full bg-[#1cb45c] text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(28,180,92,0.25)]"
                >
                  Withdraw Earnings
                </button>
                <p className="mt-3 text-center text-[12px] font-medium text-[#98a2b3]">
                  Min. withdraw amount is ₹500
                </p>
              </div>

              <div className="rounded-2xl border border-[#e3e8ef] bg-white p-6 shadow-[0_4px_18px_rgba(16,24,40,0.04)] md:p-7">
                <h2 className="text-[19px] font-extrabold text-[#1f2937]">
                  How it work?
                </h2>
                <div className="mt-5 grid gap-5">
                  {howItWorks.map((item, index) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dbeeff] text-[13px] font-extrabold text-[#0d64bf]">
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
