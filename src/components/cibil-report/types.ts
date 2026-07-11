export type CibilMetricIcon =
  | "payment"
  | "utilization"
  | "enquiries"
  | "accounts"
  | "age"
  | "active-loans"
  | "closed-loans"
  | "credit-cards";

export type CibilReportSummaryRow = {
  icon: CibilMetricIcon;
  label: string;
  subLabel: string;
  value: string;
};

export type CibilScoreHistoryPoint = {
  month: string;
  score: number;
  date?: string;
};

export type CibilReportViewData = {
  userName: string;
  score: number;
  scoreDateLabel: string;
  reportDateLabel: string;
  compareDateLabel: string;
  summaryRows: CibilReportSummaryRow[];
  detailMetrics: CibilReportSummaryRow[];
  detailSections: Array<{
    title: string;
    rows: Array<{ label: string; value: string }>;
  }>;
  recommendations: string[];
  scoreHistory: CibilScoreHistoryPoint[];
  improvementPoints: number;
  reportHref: string;
  reportAvailable: boolean;
  cached: boolean;
  sourceLabel: string;
  refreshAvailableInDays?: number;
  lastConsentLabel?: string;
  bureauScores?: {
    cibil?: number;
    equifax?: number;
    experian?: number;
    crif?: number;
  };
  bureauDates?: {
    cibil?: string;
    equifax?: string;
    experian?: string;
    crif?: string;
  };
};
