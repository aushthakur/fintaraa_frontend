"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import { CibilEligibleOffers } from "./CibilEligibleOffers";
import { CibilMonitoringTips } from "./CibilMonitoringTips";
import { CibilReportCompare } from "./CibilReportCompare";
import { CibilReportHero } from "./CibilReportHero";
import { CibilReportSocial } from "./CibilReportSocial";
import type {
  CibilReportSummaryRow,
  CibilReportViewData,
  CibilScoreHistoryPoint,
} from "./types";

const DEFAULT_SCORE = 782;
const DEFAULT_SUMMARY_ROWS: CibilReportSummaryRow[] = [
  {
    icon: "💳",
    label: "Payment History",
    subLabel: "% of On time Payments",
    value: "100%",
  },
  {
    icon: "💳",
    label: "Credit Card Utilization",
    subLabel: "% of Credit Limit Used",
    value: "10%",
  },
  {
    icon: "🗂️",
    label: "Credit Enquiries",
    subLabel: "All Loans & Credit Card",
    value: "1",
  },
  {
    icon: "📊",
    label: "Credit Mix",
    subLabel: "All Credit Accounts",
    value: "2",
  },
  {
    icon: "📅",
    label: "Credit Age",
    subLabel: "Oldest Credit Account",
    value: "2 y, 6 m",
  },
];

const getPathValue = (source: unknown, paths: string[]) => {
  for (const path of paths) {
    const value = path
      .split(".")
      .reduce<any>((current, key) => current?.[key], source);
    if (value !== undefined && value !== null && String(value).trim()) {
      return value;
    }
  }
  return undefined;
};

const textValue = (source: unknown, paths: string[], fallback = "") => {
  const value = getPathValue(source, paths);
  return value === undefined || value === null ? fallback : String(value).trim();
};

const numberValue = (
  source: unknown,
  paths: string[],
  fallback?: number,
) => {
  const value = getPathValue(source, paths);
  const numeric =
    typeof value === "number" ? value : Number(String(value || "").replace(/,/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
};

const formatScoreDate = (value: unknown, fallback = "01 Jun '26") => {
  if (!value) return fallback;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return fallback;
  const month = date.toLocaleString("en-IN", { month: "short" });
  return `${String(date.getDate()).padStart(2, "0")} ${month} '${String(date.getFullYear()).slice(-2)}`;
};

const formatReportDate = (value: unknown, fallback = "20th May, 2025") => {
  if (!value) return fallback;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return fallback;
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = date.toLocaleString("en-IN", { month: "long" });
  return `${day}${suffix} ${month}, ${date.getFullYear()}`;
};

const summaryValue = (
  report: unknown,
  paths: string[],
  fallback: string,
  suffix = "",
) => {
  const value = getPathValue(report, paths);
  if (value === undefined || value === null || String(value).trim() === "") {
    return fallback;
  }
  const text = String(value).trim();
  return suffix && !text.endsWith(suffix) ? `${text}${suffix}` : text;
};

const buildHistory = (score: number): CibilScoreHistoryPoint[] => {
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const start = Math.max(300, score - 72);
  return months.map((month, index) => ({
    month,
    score: Math.min(900, Math.round(start + index * ((score - start) / 5))),
  }));
};

const buildReportData = (user: Record<string, unknown> | null): CibilReportViewData => {
  const report = (user?.cibilReport as Record<string, unknown> | undefined) || {};
  const score =
    numberValue(user, ["cibilScore"], undefined) ||
    numberValue(report, [
      "data.credit_score",
      "data.score",
      "data.cibil_score",
      "score",
      "cibil_score",
    ], DEFAULT_SCORE) ||
    DEFAULT_SCORE;
  const fetchedAt =
    getPathValue(user, ["cibilLastFetchedAt"]) ||
    getPathValue(report, ["updatedAt", "createdAt", "timestamp", "data.generated_at"]);
  const history = buildHistory(score);

  return {
    userName: textValue(
      user,
      ["name", "fullName", "personalDetails.fullName", "kycProfile.personalDetails.fullName"],
      "User",
    ),
    score,
    scoreDateLabel: formatScoreDate(fetchedAt),
    reportDateLabel: formatReportDate(fetchedAt),
    compareDateLabel: formatScoreDate(fetchedAt),
    reportHref:
      textValue(report, [
        "data.report_url",
        "data.reportUrl",
        "data.credit_report_link",
        "report_url",
        "reportUrl",
      ]) || "/cibil-score/report",
    scoreHistory: history,
    improvementPoints: Math.max(0, history[history.length - 1].score - history[0].score),
    summaryRows: [
      {
        ...DEFAULT_SUMMARY_ROWS[0],
        value: summaryValue(
          report,
          ["data.payment_history", "data.payment_history_percentage", "data.on_time_payment_percentage"],
          DEFAULT_SUMMARY_ROWS[0].value,
          "%",
        ),
      },
      {
        ...DEFAULT_SUMMARY_ROWS[1],
        value: summaryValue(
          report,
          ["data.credit_utilization", "data.credit_card_utilization", "data.utilization_percentage"],
          DEFAULT_SUMMARY_ROWS[1].value,
          "%",
        ),
      },
      {
        ...DEFAULT_SUMMARY_ROWS[2],
        value: summaryValue(
          report,
          ["data.enquiry_count", "data.enquiries_count", "data.credit_enquiries"],
          DEFAULT_SUMMARY_ROWS[2].value,
        ),
      },
      {
        ...DEFAULT_SUMMARY_ROWS[3],
        value: summaryValue(
          report,
          ["data.total_accounts", "data.accounts_count", "data.credit_accounts"],
          DEFAULT_SUMMARY_ROWS[3].value,
        ),
      },
      {
        ...DEFAULT_SUMMARY_ROWS[4],
        value: summaryValue(
          report,
          ["data.credit_age", "data.oldest_account_age", "data.oldest_credit_account"],
          DEFAULT_SUMMARY_ROWS[4].value,
        ),
      },
    ],
  };
};

export function CibilReportPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [authReady, setAuthReady] = useState(false);
  const reportData = useMemo(
    () => buildReportData((user as Record<string, unknown> | null) || null),
    [user],
  );

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const loggedIn = getAuthType() === "user" && Boolean(getAuthToken());
      if (!loggedIn) {
        router.replace(
          buildLoginRedirectHref({
            redirectTo: "/cibil-score/report",
            product: "cibil-score",
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

  if (!authReady || loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-white px-4">
        <div className="flex items-center gap-2 rounded-full border border-[#dce9f7] px-5 py-3 text-[13px] font-bold text-[#195585]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your CIBIL report...
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <CibilReportHero data={reportData} />
      <CibilReportCompare data={reportData} />
      <CibilEligibleOffers score={reportData.score} />
      <section className="px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto max-w-9xl rounded border border-[#c7def3] bg-[#e8f4ff] px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[12px] font-semibold text-[#005ca8]">
            You will receive alerts when your credit report changes.
          </p>
          <a className="rounded-full border border-[#13a653] px-6 py-2 text-[12px] font-black text-[#13a653] whitespace-nowrap self-start sm:self-center">
            Need help? Contact Support
          </a>
        </div>
      </section>
      <CibilMonitoringTips
        history={reportData.scoreHistory}
        improvementPoints={reportData.improvementPoints}
      />
      <CibilReportSocial />
      <AppDownloadBanner />
    </main>
  );
}
