import { Download } from "lucide-react";
import type { CibilReportViewData } from "./types";

const scoreText = (value?: number) => (value ? String(value) : "Not fetched");
const dateText = (value?: string) => (value && value !== "—" ? value : "—");

export function CibilReportCompare({
  data,
  downloadingReport,
  onDownloadReport,
}: {
  data: CibilReportViewData;
  downloadingReport?: boolean;
  onDownloadReport?: () => void;
}) {
  return (
    <section className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-9xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-6 lg:p-8">
        <h3 className="mb-5 text-[17px] font-bold tracking-tight text-gray-900">
          Compare your Credit Report across 4 Bureau(s)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-170 w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="w-[25%] pb-3 text-xs font-bold leading-tight text-gray-900">
                  Bureau <br />
                  <span className="text-[11px] font-medium text-gray-400">
                    Last Refresh Date
                  </span>
                </th>
                <th className="pb-3 text-center">
                  <span className="text-xs font-bold tracking-wide text-[#00a4eb]">
                    CIBIL
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-gray-400">
                    {dateText(data.bureauDates?.cibil || data.compareDateLabel)}
                  </span>
                </th>
                <th className="pb-3 text-center">
                  <span className="text-xs font-serif font-extrabold italic tracking-tight text-[#de1f26]">
                    EQUIFAX
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-gray-400">
                    {dateText(data.bureauDates?.equifax)}
                  </span>
                </th>
                <th className="pb-3 text-center">
                  <span className="text-xs font-sans font-bold text-purple-600">
                    Experian
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-gray-400">
                    {dateText(data.bureauDates?.experian)}
                  </span>
                </th>
                <th className="pb-3 text-center">
                  <span className="text-xs font-sans font-extrabold uppercase italic text-blue-900">
                    CRIF{" "}
                    <span className="-ml-0.5 text-[9px] font-bold not-italic text-orange-500">
                      HIGH MARK
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11px] font-medium text-gray-400">
                    {dateText(data.bureauDates?.crif)}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Score
                </td>
                <td className="py-4 text-center text-xs font-semibold text-gray-400">
                  {scoreText(data.bureauScores?.cibil || data.score)}
                </td>
                <td className="py-4 text-center text-xs font-semibold text-gray-400">
                  {scoreText(data.bureauScores?.equifax)}
                </td>
                <td className="py-4 text-center text-xs font-semibold text-gray-400">
                  {scoreText(data.bureauScores?.experian)}
                </td>
                <td className="py-4 text-center text-[11px] font-medium text-gray-400">
                  {scoreText(data.bureauScores?.crif)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-[13px] font-bold text-gray-900">
              Credit Score Insights
            </h4>
            <p className="mt-0.5 text-xs font-medium text-gray-400">
              A deeper look into the factors behind your score
            </p>
          </div>

          <button
            type="button"
            onClick={onDownloadReport}
            disabled={downloadingReport}
            className="flex h-9 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#0fae5e] to-[#17cb70] px-6 text-xs font-bold text-white transition-all hover:brightness-110"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
            {downloadingReport ? "Preparing..." : "Download Report"}
          </button>
        </div>
      </div>
    </section>
  );
}
