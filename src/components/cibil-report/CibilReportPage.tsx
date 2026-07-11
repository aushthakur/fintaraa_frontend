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
import {
  fetchUserCibil,
  fetchUserCibilPdf,
  type UserCibilPdfResponse,
  type UserCibilResponse,
} from "@/services/cibil";
import { buildCibilReportData } from "./cibilReportData";

export function CibilReportPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const [authReady, setAuthReady] = useState(false);
  const [cibilData, setCibilData] = useState<UserCibilResponse | null>(null);
  const [pdfData, setPdfData] = useState<UserCibilPdfResponse | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const userCibilSnapshot = useMemo(() => {
    const currentUser = user as Record<string, unknown> | null;
    if (!currentUser) return null;
    if (
      !currentUser.cibilScore &&
      !currentUser.cibilReport &&
      !currentUser.cibilLastFetchedAt
    ) {
      return null;
    }

    return {
      cached: true,
      cibilScore:
        typeof currentUser.cibilScore === "number"
          ? currentUser.cibilScore
          : Number(currentUser.cibilScore) || undefined,
      report: currentUser.cibilReport,
      payload: currentUser.cibilRequestPayload,
      lastFetchedAt:
        typeof currentUser.cibilLastFetchedAt === "string"
          ? currentUser.cibilLastFetchedAt
          : currentUser.cibilLastFetchedAt instanceof Date
            ? currentUser.cibilLastFetchedAt.toISOString()
            : currentUser.cibilLastFetchedAt
              ? String(currentUser.cibilLastFetchedAt)
              : undefined,
    } satisfies UserCibilResponse;
  }, [user]);
  const reportData = useMemo(
    () =>
      buildCibilReportData({
        user: (user as Record<string, unknown> | null) || null,
        cibil: cibilData || userCibilSnapshot,
        pdf: pdfData,
      }),
    [cibilData, pdfData, user, userCibilSnapshot],
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

  useEffect(() => {
    if (!authReady) return;
    let active = true;

    const loadReport = async () => {
      setReportLoading(true);
      setReportError("");
      try {
        const result = await fetchUserCibil(false);
        if (!active) return;
        setCibilData(result || userCibilSnapshot);
      } catch (error) {
        if (!active) return;
        if (userCibilSnapshot) setCibilData(userCibilSnapshot);
        setReportError(
          (error as Error).message ||
            "Unable to load your latest CIBIL report right now.",
        );
      } finally {
        if (active) setReportLoading(false);
      }
    };

    void loadReport();

    return () => {
      active = false;
    };
  }, [authReady, userCibilSnapshot]);

  const handleRefreshReport = async () => {
    setReportLoading(true);
    setReportError("");
    try {
      const result = await fetchUserCibil(true);
      setCibilData(result || null);
    } catch (error) {
      setReportError(
        (error as Error).message ||
          "Unable to refresh your CIBIL report right now.",
      );
    } finally {
      setReportLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (
      reportData.reportHref &&
      reportData.reportHref !== "/cibil-score/report"
    ) {
      window.open(reportData.reportHref, "_blank", "noopener,noreferrer");
      return;
    }

    setPdfLoading(true);
    setReportError("");
    try {
      const result = await fetchUserCibilPdf();
      setPdfData(result || null);
      const link = buildCibilReportData({
        user: (user as Record<string, unknown> | null) || null,
        cibil: cibilData,
        pdf: result,
      }).reportHref;

      if (link && link !== "/cibil-score/report") {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        throw new Error("CIBIL PDF link is unavailable.");
      }
    } catch (error) {
      setReportError(
        (error as Error).message ||
          "Unable to download your CIBIL report right now.",
      );
    } finally {
      setPdfLoading(false);
    }
  };

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
      {(reportLoading || reportError || cibilData?.message) && (
        <section className="px-4 pt-5 md:px-6 lg:px-8">
          <div className="mx-auto flex max-w-9xl flex-col gap-3 rounded border border-[#c7def3] bg-[#f8fbff] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] font-bold text-[#005ca8]">
              {reportLoading
                ? "Fetching latest CIBIL data from backend..."
                : reportError || cibilData?.message}
            </p>
            <button
              type="button"
              onClick={handleRefreshReport}
              disabled={reportLoading}
              className="inline-flex h-9 items-center justify-center rounded-full border border-[#13a653] px-4 text-[12px] font-extrabold text-[#13a653] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reportLoading ? "Refreshing..." : "Refresh Report"}
            </button>
          </div>
        </section>
      )}
      <CibilReportHero
        data={reportData}
        downloadingReport={pdfLoading}
        onDownloadReport={handleDownloadReport}
      />
      <CibilReportCompare
        data={reportData}
        downloadingReport={pdfLoading}
        onDownloadReport={handleDownloadReport}
      />
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
                    <p className="text-[12px] font-extrabold text-[#005ca8]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[20px] font-extrabold text-[#1f2937]">
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
                <h3 className="text-[14px] font-extrabold text-[#1f2937]">
                  {section.title}
                </h3>
                <div className="mt-3 grid gap-2">
                  {(section.rows.length
                    ? section.rows
                    : [{ label: "Status", value: "No data reported yet" }]
                  ).map((row) => (
                    <div
                      key={`${section.title}-${row.label}-${row.value}`}
                      className="flex items-start justify-between gap-3 rounded bg-white px-3 py-2 text-[12px]"
                    >
                      <span className="font-bold text-[#667085]">
                        {row.label}
                      </span>
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
            <h3 className="text-[14px] font-extrabold text-[#1f2937]">
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
          <a
            href="/support"
            className="rounded-full border border-[#13a653] px-6 py-2 text-[12px] font-extrabold text-[#13a653] whitespace-nowrap self-start sm:self-center"
          >
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
