export type CibilReportSummaryRow = {
  icon: string;
  label: string;
  subLabel: string;
  value: string;
};

export type CibilScoreHistoryPoint = {
  month: string;
  score: number;
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
};
