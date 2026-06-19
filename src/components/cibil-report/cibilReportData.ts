import type {
  CibilReportSummaryRow,
  CibilReportViewData,
  CibilScoreHistoryPoint,
} from "./types";
import type { UserCibilResponse, UserCibilPdfResponse } from "@/services/cibil";

const DEFAULT_SCORE = 0;

const DEFAULT_SUMMARY_ROWS: CibilReportSummaryRow[] = [
  {
    icon: "💳",
    label: "Payment History",
    subLabel: "% of On time Payments",
    value: "—",
  },
  {
    icon: "💳",
    label: "Credit Card Utilization",
    subLabel: "% of Credit Limit Used",
    value: "—",
  },
  {
    icon: "🗂️",
    label: "Credit Enquiries",
    subLabel: "All Loans & Credit Card",
    value: "—",
  },
  {
    icon: "📊",
    label: "Credit Mix",
    subLabel: "All Credit Accounts",
    value: "—",
  },
  {
    icon: "📅",
    label: "Credit Age",
    subLabel: "Oldest Credit Account",
    value: "—",
  },
];

type BuildInput = {
  user: Record<string, unknown> | null;
  cibil?: UserCibilResponse | null;
  pdf?: UserCibilPdfResponse | null;
};

const closedStatuses = new Set(["12", "13", "14", "15", "16", "17", "97", "98", "99"]);

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

const toNumber = (value: unknown, fallback = 0) => {
  const numeric =
    typeof value === "number"
      ? value
      : Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : fallback;
};

const numberValue = (source: unknown, paths: string[], fallback?: number) => {
  const value = getPathValue(source, paths);
  const numeric = toNumber(value, NaN);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
};

const formatScoreDate = (value: unknown, fallback = "—") => {
  if (!value) return fallback;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return fallback;
  const month = date.toLocaleString("en-IN", { month: "short" });
  return `${String(date.getDate()).padStart(2, "0")} ${month} '${String(date.getFullYear()).slice(-2)}`;
};

const formatReportDate = (value: unknown, fallback = "—") => {
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

const parseBureauDate = (value: unknown) => {
  if (!value) return undefined;
  const raw = String(value).trim();
  if (/^\d{8}$/.test(raw)) {
    const date = new Date(
      Number(raw.slice(0, 4)),
      Number(raw.slice(4, 6)) - 1,
      Number(raw.slice(6, 8)),
    );
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const extractCreditReport = (report: any) =>
  report?.data?.credit_report ||
  report?.data?.creditReport ||
  report?.data?.report ||
  report?.credit_report ||
  report?.creditReport ||
  report?.report ||
  report;

const extractAccounts = (report: any) => {
  const target = extractCreditReport(report);
  const list =
    target?.CAIS_Account?.CAIS_Account_DETAILS ||
    target?.CAIS_Account_DETAILS ||
    target?.CAIS_Account?.cais_account_details ||
    target?.accounts ||
    target?.accountDetails ||
    target?.account_details ||
    report?.data?.accounts ||
    report?.data?.account_details ||
    [];
  return Array.isArray(list) ? list : [];
};

const extractReportDate = (report: any, fallback?: unknown) => {
  const target = extractCreditReport(report);
  const header = target?.CreditProfileHeader || target?.creditProfileHeader;
  const reportDate = header?.ReportDate || header?.reportDate;
  const reportTime = header?.ReportTime || header?.reportTime;
  const parsed = parseBureauDate(reportDate);
  if (parsed && reportTime) {
    const raw = String(reportTime).padStart(6, "0");
    parsed.setHours(Number(raw.slice(0, 2)) || 0);
    parsed.setMinutes(Number(raw.slice(2, 4)) || 0);
    parsed.setSeconds(Number(raw.slice(4, 6)) || 0);
  }
  return parsed || parseBureauDate(fallback) || undefined;
};

const accountType = (account: any) =>
  String(
    account?.accountType ||
      account?.type ||
      account?.category ||
      account?.account_category ||
      account?.account_type ||
      account?.accountName ||
      account?.Account_Type ||
      account?.AccountType ||
      "",
  ).toLowerCase();

const isCardAccount = (account: any) => {
  const portfolio = String(
    account?.Portfolio_Type || account?.portfolioType || account?.portfolio_type || "",
  ).toLowerCase();
  const type = accountType(account);
  return portfolio === "r" || type.includes("card") || type.includes("credit card");
};

const isClosedAccount = (account: any) => {
  const closeDate =
    account?.Date_Closed ||
    account?.date_closed ||
    account?.dateClosed ||
    account?.Closed_Date;
  const statusRaw =
    account?.Account_Status || account?.account_status || account?.accountStatus;
  const status = statusRaw ? String(statusRaw).trim() : "";
  return Boolean(closeDate) || (status ? closedStatuses.has(status) : false);
};

const accountBalance = (account: any) =>
  toNumber(
    account?.Current_Balance ||
      account?.currentBalance ||
      account?.current_balance ||
      account?.CurrentBalance ||
      account?.balance ||
      account?.outstandingBalance ||
      account?.outstanding_balance,
  );

const accountLimit = (account: any) =>
  toNumber(
    account?.Credit_Limit_Amount ||
      account?.creditLimitAmount ||
      account?.credit_limit_amount ||
      account?.limit ||
      account?.limitAmount,
  );

const accountPastDue = (account: any) =>
  toNumber(
    account?.Amount_Past_Due ||
      account?.amount_past_due ||
      account?.amountPastDue ||
      account?.AmountPastDue,
  );

const parseOpenDate = (account: any) =>
  parseBureauDate(
    account?.Open_Date ||
      account?.openDate ||
      account?.open_date ||
      account?.Date_Opened ||
      account?.dateOpened,
  );

const computePaymentStats = (accounts: any[]) => {
  let paymentMonths = 0;
  let paymentOnTime = 0;

  const countHistory = (history: any[]) => {
    history.forEach((entry) => {
      const raw =
        entry?.Days_Past_Due ??
        entry?.daysPastDue ??
        entry?.days_past_due ??
        entry?.Amount_Past_Due ??
        entry?.amount_past_due ??
        entry?.amountPastDue;
      if (raw === null || raw === undefined || raw === "") return;
      const value = Number(raw);
      if (!Number.isFinite(value)) return;
      paymentMonths += 1;
      if (value <= 0) paymentOnTime += 1;
    });
  };

  accounts.forEach((account) => {
    const profile =
      account?.Payment_History_Profile ||
      account?.paymentHistoryProfile ||
      account?.payment_history_profile;
    if (typeof profile === "string" && profile.trim()) {
      profile
        .trim()
        .split("")
        .forEach((char) => {
          if (char === "?" || char.toUpperCase() === "X") return;
          paymentMonths += 1;
          if (char === "0") paymentOnTime += 1;
        });
      return;
    }
    if (Array.isArray(account?.CAIS_Account_History)) {
      countHistory(account.CAIS_Account_History);
    } else if (Array.isArray(account?.Account_Review_Data)) {
      countHistory(account.Account_Review_Data);
    }
  });

  return paymentMonths > 0 ? Math.round((paymentOnTime / paymentMonths) * 100) : undefined;
};

const formatCurrency = (value: number) =>
  value > 0 ? `₹${Math.round(value).toLocaleString("en-IN")}` : "—";

const formatPercent = (value?: number) =>
  value === undefined || Number.isNaN(value) ? "—" : `${Math.max(0, Math.round(value))}%`;

const formatCreditAge = (oldest?: Date, reportDate = new Date()) => {
  if (!oldest) return "—";
  const months =
    (reportDate.getFullYear() - oldest.getFullYear()) * 12 +
    (reportDate.getMonth() - oldest.getMonth());
  const safeMonths = Math.max(0, months);
  const years = Math.floor(safeMonths / 12);
  const rest = safeMonths % 12;
  return years ? `${years} y, ${rest} m` : `${rest} m`;
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

const extractCreditReportLink = (...sources: any[]) => {
  for (const source of sources) {
    const value = getPathValue(source, [
      "data.credit_report_link",
      "data.creditReportLink",
      "data.report_url",
      "data.reportUrl",
      "credit_report_link",
      "creditReportLink",
      "report_url",
      "reportUrl",
      "pdfUrl",
      "report.data.credit_report_link",
      "report.credit_report_link",
    ]);
    if (value) return String(value);
  }
  return "";
};

const buildHistory = (score: number): CibilScoreHistoryPoint[] => {
  const finalScore = score > 0 ? score : 700;
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const start = Math.max(300, finalScore - 72);
  return months.map((month, index) => ({
    month,
    score: Math.min(900, Math.round(start + index * ((finalScore - start) / 5))),
  }));
};

export const buildCibilReportData = ({
  user,
  cibil,
  pdf,
}: BuildInput): CibilReportViewData => {
  const userReport = user?.cibilReport as Record<string, unknown> | undefined;
  const report = (cibil?.report || userReport || {}) as Record<string, unknown>;
  const creditReport = extractCreditReport(report);
  const accounts = extractAccounts(report);
  const reportDate =
    extractReportDate(report, cibil?.lastFetchedAt || user?.cibilLastFetchedAt) ||
    extractReportDate(userReport, user?.cibilLastFetchedAt);

  const score =
    cibil?.cibilScore ||
    numberValue(user, ["cibilScore"], undefined) ||
    numberValue(report, [
      "data.credit_score",
      "data.score",
      "data.cibil_score",
      "score",
      "cibil_score",
    ], DEFAULT_SCORE) ||
    DEFAULT_SCORE;

  let activeLoans = 0;
  let closedLoans = 0;
  let creditCards = 0;
  let totalLoanBalance = 0;
  let totalCardBalance = 0;
  let totalLimit = 0;
  let totalCardUsed = 0;
  let overdueAccounts = 0;
  let oldestOpenDate: Date | undefined;

  accounts.forEach((account) => {
    const isCard = isCardAccount(account);
    const closed = isClosedAccount(account);
    const balance = accountBalance(account);
    const limit = accountLimit(account);
    const pastDue = accountPastDue(account);
    const openDate = parseOpenDate(account);

    if (openDate && (!oldestOpenDate || openDate < oldestOpenDate)) {
      oldestOpenDate = openDate;
    }
    if (pastDue > 0) overdueAccounts += 1;

    if (isCard) {
      creditCards += 1;
      totalCardBalance += balance;
      totalCardUsed += balance;
      totalLimit += limit;
    } else if (closed) {
      closedLoans += 1;
    } else {
      activeLoans += 1;
      totalLoanBalance += balance;
    }
  });

  const caisSummary = creditReport?.CAIS_Account?.CAIS_Summary;
  const creditAccountSummary = caisSummary?.Credit_Account;
  const outstanding = caisSummary?.Total_Outstanding_Balance;
  const summaryTotalAccounts =
    toNumber(creditAccountSummary?.CreditAccountTotal, accounts.length) || accounts.length;
  const summaryActiveAccounts = toNumber(
    creditAccountSummary?.CreditAccountActive,
    activeLoans + creditCards,
  );
  const summaryClosedAccounts = toNumber(
    creditAccountSummary?.CreditAccountClosed,
    closedLoans,
  );
  const totalOutstanding =
    toNumber(outstanding?.Outstanding_Balance_All) ||
    totalLoanBalance + totalCardBalance;
  const paymentHistory = computePaymentStats(accounts);
  const utilization =
    totalLimit > 0
      ? Math.round((totalCardUsed / totalLimit) * 100)
      : numberValue(report, [
          "data.credit_utilization",
          "data.credit_card_utilization",
          "data.utilization_percentage",
        ]);
  const enquiryCount =
    numberValue(report, [
      "data.enquiry_count",
      "data.enquiries_count",
      "data.credit_enquiries",
      "data.credit_report.CAPS.CAPS_Summary.CAPSLast30Days",
      "data.credit_report.CAPS.CAPS_Summary.CAPSLast90Days",
    ]) || 0;
  const creditAge = formatCreditAge(oldestOpenDate, reportDate || new Date());
  const history = buildHistory(score);
  const reportHref =
    extractCreditReportLink(pdf?.report, cibil?.report, report, user?.cibilPdfReport) ||
    "/cibil-score/report";

  return {
    userName: textValue(
      user,
      ["name", "fullName", "personalDetails.fullName", "kycProfile.personalDetails.fullName"],
      "User",
    ),
    score,
    scoreDateLabel: formatScoreDate(reportDate || cibil?.lastFetchedAt || user?.cibilLastFetchedAt),
    reportDateLabel: formatReportDate(reportDate || cibil?.lastFetchedAt || user?.cibilLastFetchedAt),
    compareDateLabel: formatScoreDate(reportDate || cibil?.lastFetchedAt || user?.cibilLastFetchedAt),
    reportHref,
    scoreHistory: history,
    improvementPoints: Math.max(0, history[history.length - 1].score - history[0].score),
    bureauScores: {
      cibil: score || undefined,
      experian: numberValue(user, ["experianScore"], undefined),
    },
    bureauDates: {
      cibil: formatScoreDate(reportDate || cibil?.lastFetchedAt || user?.cibilLastFetchedAt),
      experian: formatScoreDate(user?.experianLastFetchedAt),
    },
    summaryRows: [
      {
        ...DEFAULT_SUMMARY_ROWS[0],
        value: formatPercent(paymentHistory),
      },
      {
        ...DEFAULT_SUMMARY_ROWS[1],
        value: formatPercent(utilization),
      },
      {
        ...DEFAULT_SUMMARY_ROWS[2],
        value: enquiryCount ? String(enquiryCount) : "—",
      },
      {
        ...DEFAULT_SUMMARY_ROWS[3],
        value: summaryTotalAccounts ? String(summaryTotalAccounts) : "—",
      },
      {
        ...DEFAULT_SUMMARY_ROWS[4],
        value: creditAge,
      },
    ],
    detailMetrics: [
      {
        icon: "🏦",
        label: "Active Loans",
        subLabel: "Open loan accounts",
        value: String(activeLoans || Math.max(0, summaryActiveAccounts - creditCards) || 0),
      },
      {
        icon: "✅",
        label: "Closed Loans",
        subLabel: "Closed loan accounts",
        value: String(closedLoans || summaryClosedAccounts || 0),
      },
      {
        icon: "💳",
        label: "Credit Cards",
        subLabel: "Reported card accounts",
        value: String(creditCards || 0),
      },
      {
        icon: "📈",
        label: "Utilization Ratio",
        subLabel: "Credit limit used",
        value: formatPercent(utilization),
      },
      {
        icon: "🔎",
        label: "Enquiries",
        subLabel: "Recent bureau enquiries",
        value: enquiryCount ? String(enquiryCount) : "0",
      },
      {
        icon: "🧾",
        label: "Payment History",
        subLabel: "On-time payment behaviour",
        value: formatPercent(paymentHistory),
      },
    ],
    detailSections: [
      {
        title: "Account Summary",
        rows: [
          { label: "Total Accounts", value: String(summaryTotalAccounts || 0) },
          { label: "Active Accounts", value: String(summaryActiveAccounts || 0) },
          { label: "Closed Accounts", value: String(summaryClosedAccounts || 0) },
          { label: "Overdue Accounts", value: String(overdueAccounts || 0) },
          { label: "Total Outstanding", value: formatCurrency(totalOutstanding) },
          {
            label: "Secured Outstanding",
            value: formatCurrency(toNumber(outstanding?.Outstanding_Balance_Secured)),
          },
          {
            label: "Unsecured Outstanding",
            value: formatCurrency(toNumber(outstanding?.Outstanding_Balance_UnSecured)),
          },
        ],
      },
      {
        title: "Loan Summary",
        rows: [
          { label: "Active Loans", value: String(activeLoans || 0) },
          { label: "Closed Loans", value: String(closedLoans || summaryClosedAccounts || 0) },
          { label: "Outstanding Loan Balance", value: formatCurrency(totalLoanBalance) },
          { label: "Oldest Loan/Card Age", value: creditAge },
        ],
      },
      {
        title: "Credit Card Summary",
        rows: [
          { label: "Credit Cards", value: String(creditCards || 0) },
          { label: "Total Credit Limit", value: formatCurrency(totalLimit) },
          { label: "Limit Used", value: formatCurrency(totalCardUsed) },
          { label: "Utilization", value: formatPercent(utilization) },
        ],
      },
      {
        title: "Raw Bureau Highlights",
        rows: buildRows(
          getPathValue(report, ["data.summary", "summary", "data.account_summary", "account_summary"]),
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
            overdueAccounts
              ? "Clear overdue balances and check whether the lender has updated the bureau record."
              : "Review active accounts regularly and report incorrect bureau data.",
          ];
    })(),
  };
};
