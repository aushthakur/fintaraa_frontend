"use client";

import { motion, MotionConfig } from "framer-motion";
import { Database, Download, Info, ShieldCheck } from "lucide-react";
import type { CibilReportViewData } from "./types";

type BureauKey = "cibil" | "equifax" | "experian" | "crif";

const bureaus: Array<{
  key: BureauKey;
  name: string;
  accent: string;
  surface: string;
}> = [
  {
    key: "cibil",
    name: "CIBIL",
    accent: "text-[#0079b8]",
    surface: "bg-[#e8f5fb]",
  },
  {
    key: "equifax",
    name: "Equifax",
    accent: "text-[#c2343f]",
    surface: "bg-[#fff0f1]",
  },
  {
    key: "experian",
    name: "Experian",
    accent: "text-[#6548c7]",
    surface: "bg-[#f0ecff]",
  },
  {
    key: "crif",
    name: "CRIF High Mark",
    accent: "text-[#254e69]",
    surface: "bg-[#edf4f7]",
  },
];

export function CibilReportCompare({
  data,
  downloadingReport,
  onDownloadReport,
}: {
  data: CibilReportViewData;
  downloadingReport?: boolean;
  onDownloadReport?: () => void;
}) {
  const connectedBureaus = bureaus.filter(
    (bureau) => data.bureauScores?.[bureau.key],
  ).length;

  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-white px-4 py-10 md:px-6 md:py-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-9xl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-[12px] font-extrabold text-[#075cde]">
                <Database className="h-4 w-4" aria-hidden="true" />
                Bureau overview
              </p>
              <h2 className="mt-3 text-[26px] font-extrabold leading-tight text-[#102f49] sm:text-[30px]">
                Compare your bureau scores
              </h2>
              <p className="mt-2 max-w-2xl text-[14px] font-medium leading-6 text-[#667f91]">
                Only scores available in your saved profile or bureau history
                are displayed.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-md bg-[#edf6fc] px-3 py-2 text-[11px] font-bold text-[#526e82]">
              <ShieldCheck className="h-4 w-4 text-[#075cde]" aria-hidden="true" />
              {connectedBureaus} of 4 sources available
            </span>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-[#d5e4ed] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 border-collapse">
                <thead>
                  <tr className="border-b border-[#dfe9ef] bg-[#f7fafc]">
                    <th className="w-48 px-5 py-4 text-left text-[11px] font-extrabold text-[#526e82]">
                      Credit bureau
                    </th>
                    {bureaus.map((bureau) => (
                      <th key={bureau.key} className="px-4 py-4 text-center">
                        <span
                          className={`mx-auto flex h-9 w-fit min-w-24 items-center justify-center rounded-md px-3 text-[11px] font-extrabold ${bureau.accent} ${bureau.surface}`}
                        >
                          {bureau.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#e6eef3]">
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-[#7890a2]">
                      Latest score
                    </th>
                    {bureaus.map((bureau) => {
                      const score = data.bureauScores?.[bureau.key];
                      return (
                        <td key={bureau.key} className="px-4 py-4 text-center">
                          <span
                            className={`text-[17px] font-extrabold ${
                              score ? "text-[#102f49]" : "text-[#a0aeb8]"
                            }`}
                          >
                            {score || "Not available"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <th className="px-5 py-4 text-left text-[11px] font-bold text-[#7890a2]">
                      Last refreshed
                    </th>
                    {bureaus.map((bureau) => {
                      const score = data.bureauScores?.[bureau.key];
                      const date = data.bureauDates?.[bureau.key];
                      return (
                        <td
                          key={bureau.key}
                          className="px-4 py-4 text-center text-[11px] font-semibold text-[#667f91]"
                        >
                          {score && date && date !== "—" ? date : "Not connected"}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#dfe9ef] bg-[#fbfdfe] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#e8f3fb] text-[#075cde]">
                  <Info className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[12px] font-extrabold text-[#254e69]">
                    Credit score insights
                  </p>
                  <p className="mt-1 text-[10px] font-semibold leading-4 text-[#7890a2] sm:text-[11px]">
                    Download the bureau file for lender-level account and enquiry details.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onDownloadReport}
                disabled={downloadingReport || !data.reportAvailable}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[#075cde] px-4 text-[11px] font-extrabold text-white transition-colors hover:bg-[#064cb8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {downloadingReport ? "Preparing..." : "Download report"}
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
