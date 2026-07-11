"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Database,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { getAuthToken, getAuthType } from "@/hooks/authStorage";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { buildLoginRedirectHref } from "@/lib/loginRedirect";
import { CibilEligibleOffers } from "./CibilEligibleOffers";
import { CibilMonitoringTips } from "./CibilMonitoringTips";
import { CibilReportCompare } from "./CibilReportCompare";
import { CibilReportDetails } from "./CibilReportDetails";
import { CibilReportHero } from "./CibilReportHero";
import { CibilReportSocial } from "./CibilReportSocial";
import {
  type BureauScoreHistoryRecord,
  fetchUserCibil,
  fetchUserCibilHistory,
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
  const [scoreHistory, setScoreHistory] = useState<
    BureauScoreHistoryRecord[]
  >([]);
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
        history: scoreHistory,
      }),
    [cibilData, pdfData, scoreHistory, user, userCibilSnapshot],
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
    if (!authReady || loading) return;
    let active = true;

    const loadReport = async () => {
      setReportLoading(true);
      setReportError("");
      const from = new Date();
      from.setFullYear(from.getFullYear() - 1);
      const [reportResult, historyResult] = await Promise.allSettled([
        fetchUserCibil(false, { silent: true }),
        fetchUserCibilHistory({ from: from.toISOString(), limit: 50 }),
      ]);
      if (!active) return;

      if (reportResult.status === "fulfilled") {
        setCibilData(reportResult.value || userCibilSnapshot);
      } else {
        if (userCibilSnapshot) setCibilData(userCibilSnapshot);
        setReportError(
          reportResult.reason instanceof Error
            ? reportResult.reason.message
            : "Unable to load your latest CIBIL report right now.",
        );
      }

      if (historyResult.status === "fulfilled") {
        setScoreHistory(historyResult.value?.result || []);
      }
      setReportLoading(false);
    };

    void loadReport();

    return () => {
      active = false;
    };
  }, [authReady, loading, userCibilSnapshot]);

  const handleRefreshReport = async () => {
    setReportLoading(true);
    setReportError("");
    try {
      const result = await fetchUserCibil(true, { silent: true });
      setCibilData(result || null);
      const from = new Date();
      from.setFullYear(from.getFullYear() - 1);
      const history = await fetchUserCibilHistory({
        from: from.toISOString(),
        limit: 50,
      }).catch(() => null);
      if (history) setScoreHistory(history.result || []);
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
      const result = await fetchUserCibilPdf({ silent: true });
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
        <div className="flex items-center gap-3 text-[13px] font-bold text-[#254e69]">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e8f3fb] text-[#075cde]">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          </span>
          Loading your saved CIBIL report...
        </div>
      </main>
    );
  }

  const refreshDays = reportData.refreshAvailableInDays || 0;
  const refreshLocked = refreshDays > 0;
  const statusMessage = reportLoading
    ? "Syncing your saved profile and latest bureau data."
    : reportError
      ? reportError.replace(/^[^A-Za-z0-9]+/, "")
      : refreshLocked
        ? `The next bureau refresh is available in ${refreshDays} day${
            refreshDays === 1 ? "" : "s"
          }.`
        : cibilData?.message ||
          "Your latest saved credit report is available in this dashboard.";

  return (
    <main className="bg-white">
      <section className="bg-white px-4 py-5 md:px-6 lg:px-8">
        <div
          className={`mx-auto flex max-w-9xl flex-col gap-4 rounded-lg border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between ${
            reportError
              ? "border-[#efc8cc] bg-[#fff7f8]"
              : "border-[#cbdfea] bg-[#f7fbfd]"
          }`}
          aria-live="polite"
        >
          <div className="flex min-w-0 items-start gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                reportError
                  ? "bg-[#ffe8ea] text-[#b4232d]"
                  : "bg-[#e8f3fb] text-[#075cde]"
              }`}
            >
              {reportLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Database className="h-4 w-4" aria-hidden="true" />
              )}
            </span>
            <div>
              <p className="text-[12px] font-extrabold text-[#254e69]">
                {reportLoading
                  ? "Syncing credit report"
                  : reportError
                    ? "Saved profile fallback active"
                    : reportData.sourceLabel}
              </p>
              <p className="mt-1 text-[10px] font-semibold leading-4 text-[#7890a2] sm:text-[11px]">
                {statusMessage}
                {reportData.lastConsentLabel
                  ? ` Consent recorded ${reportData.lastConsentLabel}.`
                  : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefreshReport}
            disabled={reportLoading || refreshLocked}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-[#a8cbdc] bg-white px-4 text-[11px] font-extrabold text-[#075cde] transition-colors hover:border-[#075cde] disabled:cursor-not-allowed disabled:text-[#8ca0af]"
          >
            <RefreshCcw
              className={`h-4 w-4 ${reportLoading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {reportLoading
              ? "Syncing..."
              : refreshLocked
                ? `Refresh in ${refreshDays} day${refreshDays === 1 ? "" : "s"}`
                : "Refresh report"}
          </button>
        </div>
      </section>

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
      <CibilReportDetails data={reportData} />

      <section className="border-y border-[#dce9f1] bg-[#f4f9fc] px-4 py-6 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-9xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#e8f3fb] text-[#075cde]">
              <BellRing className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[12px] font-extrabold text-[#254e69]">
                Credit profile alerts
              </p>
              <p className="mt-1 text-[11px] font-semibold leading-5 text-[#7890a2]">
                Report and application updates are sent using your saved communication preferences.
              </p>
            </div>
          </div>
          <Link
            href="/support"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-[#a8cbdc] bg-white px-4 text-[11px] font-extrabold text-[#075cde] no-underline transition-colors hover:border-[#075cde]"
          >
            Contact support
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <CibilMonitoringTips
        history={reportData.scoreHistory}
        improvementPoints={reportData.improvementPoints}
        recommendations={reportData.recommendations}
      />
      <CibilReportSocial />
      <AppDownloadBanner />
    </main>
  );
}
