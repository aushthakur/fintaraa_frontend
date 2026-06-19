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

const normalizeLabel = (value: string) =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const buildRows = (value: unknown): Array<{ label: string; value: string }> => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.slice(0, 6).flatMap((item, index) => {
      if (!item || typeof item !== "object") {
        return [{ label: `Item ${index + 1}`, value: String(item || "-") }];
      }
      return Object.entries(item as Record<string, unknown>)
        .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null)
        .slice(0, 4)
        .map(([key, entryValue]) => ({
          label: normalizeLabel(key),
          value: String(entryValue),
        }));
    });
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null)
      .slice(0, 8)
      .map(([key, entryValue]) => ({
        label: normalizeLabel(key),
        value:
          typeof entryValue === "object"
            ? JSON.stringify(entryValue)
            : String(entryValue),
      }));
  }
  return [{ label: "Details", value: String(value) }];
};

const arrayValue = (source: unknown, paths: string[]): string[] => {
  const value = getPathValue(source, paths);
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
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
    detailMetrics: [
      {
        icon: "🏦",
        label: "Active Loans",
        subLabel: "Open loan accounts",
        value: summaryValue(
          report,
          ["data.active_loans", "data.activeLoans", "data.loan_summary.active", "active_loans"],
          "0",
        ),
      },
      {
        icon: "✅",
        label: "Closed Loans",
        subLabel: "Closed loan accounts",
        value: summaryValue(
          report,
          ["data.closed_loans", "data.closedLoans", "data.loan_summary.closed", "closed_loans"],
          "0",
        ),
      },
      {
        icon: "💳",
        label: "Credit Cards",
        subLabel: "Reported card accounts",
        value: summaryValue(
          report,
          ["data.credit_cards", "data.creditCards", "data.credit_card_summary.total", "credit_cards"],
          "0",
        ),
      },
      {
        icon: "📈",
        label: "Utilization Ratio",
        subLabel: "Credit limit used",
        value: summaryValue(
          report,
          ["data.utilization_ratio", "data.credit_utilization", "data.utilization_percentage"],
          "10%",
          "%",
        ),
      },
      {
        icon: "🔎",
        label: "Enquiries",
        subLabel: "Recent bureau enquiries",
        value: summaryValue(
          report,
          ["data.enquiries", "data.enquiry_count", "data.enquiries_count"],
          "0",
        ),
      },
      {
        icon: "🧾",
        label: "Payment History",
        subLabel: "On-time payment behaviour",
        value: summaryValue(
          report,
          ["data.payment_history", "data.payment_history_percentage", "data.on_time_payment_percentage"],
          "100%",
          "%",
        ),
      },
    ],
    detailSections: [
      {
        title: "Account Summary",
        rows: buildRows(
          getPathValue(report, [
            "data.account_summary",
            "data.accountSummary",
            "account_summary",
          ]),
        ),
      },
      {
        title: "Loan Summary",
        rows: buildRows(
          getPathValue(report, [
            "data.loan_summary",
            "data.loanSummary",
            "loan_summary",
            "data.loans",
          ]),
        ),
      },
      {
        title: "Credit Card Summary",
        rows: buildRows(
          getPathValue(report, [
            "data.credit_card_summary",
            "data.creditCardSummary",
            "credit_card_summary",
            "data.credit_cards_detail",
          ]),
        ),
      },
    ],
    recommendations: (() => {
      const recommendations = arrayValue(report, [
        "data.recommendations",
        "recommendations",
      ]);
      return recommendations.length
        ? recommendations
        : [
        score >= 750
          ? "Maintain low utilization and continue paying all dues on time."
          : "Reduce credit utilization and avoid multiple applications in a short period.",
        "Review active accounts regularly and report incorrect bureau data.",
      ];
    })(),
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
        <div className="mx-auto grid max-w-9xl gap-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportData.detailMetrics.map((item) => (
              <div
                key={item.label}
                className="rounded border border-[#c7def3] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(16,24,40,0.04)]"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[22px]">{item.icon}</span>
                  <div>
                    <p className="text-[12px] font-black text-[#005ca8]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[20px] font-black text-[#1f2937]">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-[#98a2b3]">
                      {item.subLabel}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {reportData.detailSections.map((section) => (
              <div
                key={section.title}
                className="rounded border border-[#c7def3] bg-[#f8fbff] p-4"
              >
                <h3 className="text-[14px] font-black text-[#1f2937]">
                  {section.title}
                </h3>
                <div className="mt-3 grid gap-2">
                  {(section.rows.length ? section.rows : [{ label: "Status", value: "No data reported yet" }]).map((row) => (
                    <div
                      key={`${section.title}-${row.label}-${row.value}`}
                      className="flex items-start justify-between gap-3 rounded bg-white px-3 py-2 text-[12px]"
                    >
                      <span className="font-bold text-[#667085]">{row.label}</span>
                      <span className="text-right font-semibold text-[#1f2937]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded border border-[#c7def3] bg-white p-4">
            <h3 className="text-[14px] font-black text-[#1f2937]">
              Recommendations
            </h3>
            <ul className="mt-3 grid gap-2 text-[12px] font-semibold leading-5 text-[#667085]">
              {reportData.recommendations.map((item) => (
                <li key={item} className="rounded bg-[#f8fbff] px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
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
