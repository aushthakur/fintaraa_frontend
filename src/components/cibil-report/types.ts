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
  scoreHistory: CibilScoreHistoryPoint[];
  improvementPoints: number;
  reportHref: string;
};
