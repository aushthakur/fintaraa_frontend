"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FileSearch,
  Loader2,
  Search,
} from "lucide-react";
import { ServiceRequestProgress } from "./ServiceRequestProgress";
import { PremiumServiceTimeline } from "./PremiumServiceTimeline";
import {
  fetchServiceRequestHistory,
  ServiceRequestRecord,
  ServiceRequestType,
} from "@/services/serviceRequests";
import { isUserLoggedIn } from "@/hooks/authStorage";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";

const storageKey = (serviceType: ServiceRequestType) =>
  `fintaraa_service_requests_${serviceType}`;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeMobile = (value: string) =>
  value.replace(/[\s-]/g, "").replace(/^\+91/, "");

const compactStepIndex = (request?: ServiceRequestRecord | null) => {
  if (!request) return 0;
  const stage = String(request.currentStage || "").toLowerCase();
  if (stage.includes("completed")) return 4;
  if (
    stage.includes("filed") ||
    stage.includes("arn") ||
    stage.includes("approval") ||
    stage.includes("issued") ||
    stage.includes("return prepared") ||
    stage.includes("client approval") ||
    stage.includes("acknowledgement") ||
    stage.includes("application submitted") ||
    stage.includes("filings submitted") ||
    stage.includes("submission completed") ||
    stage.includes("certificate assistance") ||
    stage.includes("financial analysis") ||
    stage.includes("draft report") ||
    stage.includes("final report")
  ) {
    return 3;
  }
  if (
    stage.includes("document") ||
    stage.includes("verification") ||
    stage.includes("tax review") ||
    stage.includes("information pending") ||
    stage.includes("eligibility reviewed") ||
    stage.includes("scope reviewed") ||
    stage.includes("requirement reviewed")
  ) {
    return 2;
  }
  if (request.assignedExecutive || request.currentStageIndex >= 1) return 1;
  return 0;
};

const mergeRequests = (
  current: ServiceRequestRecord[],
  incoming: ServiceRequestRecord[],
) => {
  const map = new Map<string, ServiceRequestRecord>();
  [...incoming, ...current].forEach((item) => {
    if (item?._id) map.set(item._id, item);
  });
  return Array.from(map.values()).sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
};

const readStored = (serviceType: ServiceRequestType) => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(
      localStorage.getItem(storageKey(serviceType)) || "[]",
    );
    return Array.isArray(parsed) ? (parsed as ServiceRequestRecord[]) : [];
  } catch {
    return [];
  }
};

const writeStored = (
  serviceType: ServiceRequestType,
  requests: ServiceRequestRecord[],
) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    storageKey(serviceType),
    JSON.stringify(requests.slice(0, 20)),
  );
};

export function ServiceRequestTracker({
  title,
  idLabel,
  serviceType,
  sectionId,
  requireLogin = false,
  deferCreatedRequestDisplay = false,
}: {
  title: string;
  idLabel: string;
  serviceType: ServiceRequestType;
  sectionId?: string;
  requireLogin?: boolean;
  deferCreatedRequestDisplay?: boolean;
}) {
  const [mobile, setMobile] = useState("");
  const [queryId, setQueryId] = useState("");
  const [requests, setRequests] = useState<ServiceRequestRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authReady, setAuthReady] = useState(!requireLogin);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!requireLogin) return;

    const syncAuth = () => {
      setLoggedIn(isUserLoggedIn());
      setAuthReady(true);
    };

    syncAuth();
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuth);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, syncAuth);
  }, [requireLogin]);

  useEffect(() => {
    if (requireLogin && (!authReady || !loggedIn)) return;

    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const stored = readStored(serviceType);
      setRequests(stored);
      setSelectedId(stored[0]?._id || "");
    });

    const onCreated = (event: Event) => {
      const request = (event as CustomEvent<ServiceRequestRecord>).detail;
      if (!request || request.serviceType !== serviceType) return;
      setRequests((current) => {
        const next = mergeRequests(current, [request]);
        writeStored(serviceType, next);
        return deferCreatedRequestDisplay ? current : next;
      });
      if (!deferCreatedRequestDisplay) {
        setSelectedId(request._id);
      }
    };

    window.addEventListener("service-request-created", onCreated);
    return () => {
      active = false;
      window.removeEventListener("service-request-created", onCreated);
    };
  }, [
    authReady,
    deferCreatedRequestDisplay,
    loggedIn,
    requireLogin,
    serviceType,
  ]);

  useEffect(() => {
    let active = true;
    if (requireLogin && (!authReady || !loggedIn)) return;
    if (!isUserLoggedIn()) return;

    const loadLinkedRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetchServiceRequestHistory({ serviceType });
        if (!active) return;
        const next = mergeRequests([], result);
        setRequests(next);
        writeStored(serviceType, next);
        setSelectedId(next[0]?._id || "");
      } catch (err) {
        if (!active) return;
        setError(
          (err as Error).message || "Unable to fetch linked request history.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadLinkedRequests();
    return () => {
      active = false;
    };
  }, [authReady, loggedIn, requireLogin, serviceType]);

  const selectedRequest = useMemo(
    () => requests.find((request) => request._id === selectedId) || requests[0],
    [requests, selectedId],
  );
  const activeStep = compactStepIndex(selectedRequest);
  const trackedQueryId = selectedRequest?.queryId;

  useEffect(() => {
    if (!trackedQueryId) return;

    let active = true;
    const refreshSelectedRequest = async () => {
      try {
        const result = await fetchServiceRequestHistory({
          serviceType,
          queryId: trackedQueryId,
        });
        if (!active || !result.length) return;
        setRequests((current) => {
          const next = mergeRequests(current, result);
          writeStored(serviceType, next);
          return next;
        });
      } catch {
        // Keep the last known timeline visible during a temporary API failure.
      }
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void refreshSelectedRequest();
      }
    };

    void refreshSelectedRequest();
    const timer = window.setInterval(refreshSelectedRequest, 30_000);
    window.addEventListener("focus", refreshSelectedRequest);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshSelectedRequest);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [serviceType, trackedQueryId]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedMobile = normalizeMobile(mobile);
    const normalizedQueryId = queryId.trim().toUpperCase();
    if (!normalizedMobile && !normalizedQueryId) {
      setError("Enter your mobile number or Query ID.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const result = await fetchServiceRequestHistory({
        serviceType,
        mobile: normalizedMobile,
        queryId: normalizedQueryId,
      });
      setRequests((current) => {
        const next = mergeRequests(current, result);
        writeStored(serviceType, next);
        return next;
      });
      setSelectedId(result[0]?._id || selectedId);
      if (!result.length) {
        setError("No request was found for this mobile number or Query ID.");
      }
    } catch (err) {
      setError((err as Error).message || "Unable to fetch request history.");
    } finally {
      setLoading(false);
    }
  };

  if (requireLogin && !authReady) {
    return null;
  }

  if (requireLogin && !loggedIn) {
    return (
      <section id={sectionId} className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mobile-safe-container">
          <div className="max-w-2xl">
            <p className="text-[12px] font-extrabold uppercase tracking-wide text-[#13a653]">
              Track Status
            </p>
            <h2 className="mt-1 text-[24px] font-extrabold tracking-[-0.01em] text-[#005ca8] md:text-[28px]">
              {title}
            </h2>
            <p className="mt-2 text-[14px] font-semibold leading-6 text-[#667085] md:text-[15px]">
              Please login first to track your DSA partner status.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[#075cde] px-5 text-[13px] font-extrabold text-white no-underline transition hover:bg-[#064cb8]"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={sectionId}
      className="scroll-mt-24 px-4 py-7 md:px-6 md:py-8 lg:px-8"
    >
      <div className="mobile-safe-container grid gap-5">
        <div className="w-full max-w-full overflow-hidden rounded-2xl border border-[#d7e5f3] bg-white p-4 shadow-[0_14px_38px_rgba(16,24,40,0.05)] sm:p-5 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[12px] font-extrabold uppercase tracking-wide text-[#13a653]">
                Track Status
              </p>
              <h2 className="mt-1 text-[21px] font-extrabold leading-tight tracking-[-0.01em] text-[#005ca8] sm:text-[24px] md:text-[28px]">
                {title}
              </h2>
              <p className="mt-2 max-w-full text-[13px] font-semibold leading-6 text-[#667085] sm:max-w-2xl sm:text-[14px] md:text-[15px]">
                Logged-in users can see linked requests automatically. You can
                also track any submitted request using a mobile number or Query
                ID.
              </p>
            </div>
            <form
              onSubmit={submit}
              className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end lg:min-w-155"
            >
              <label className="grid gap-1.5">
                <span className="text-[13px] font-extrabold text-[#2a2f36]">
                  Mobile Number
                </span>
                <input
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                  placeholder="Enter Mobile Number"
                  className="h-11 rounded-lg border border-[#dce3eb] px-3 text-[13px] font-semibold outline-none placeholder:text-[#a0a7b2] focus:border-[#005ca8] md:text-sm"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-[13px] font-extrabold text-[#2a2f36]">
                  {idLabel}
                </span>
                <input
                  value={queryId}
                  onChange={(event) => setQueryId(event.target.value)}
                  placeholder="e.g. FIN2607310001"
                  className="h-11 rounded-lg border border-[#dce3eb] px-3 text-[13px] font-semibold uppercase outline-none placeholder:normal-case placeholder:text-[#a0a7b2] focus:border-[#005ca8] md:text-sm"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-[#075cde] px-7 text-[13px] font-extrabold text-[#075cde] transition hover:bg-[#075cde] hover:text-white disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Track Status
              </button>
            </form>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] font-bold text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        <PremiumServiceTimeline title={title} activeStep={activeStep} />

        <div className="w-full max-w-full overflow-hidden rounded-2xl border border-[#d7e5f3] bg-white p-4 shadow-[0_14px_38px_rgba(16,24,40,0.04)] sm:p-5 md:p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h3 className="text-[18px] font-extrabold text-[#1f2937]">
                Submitted Request History
              </h3>
              <p className="mt-1 max-w-full text-[14px] font-semibold leading-6 text-[#667085] sm:max-w-2xl">
                Select any row to view the complete progress timeline and
                remarks below.
              </p>
            </div>
            <span className="rounded-full bg-[#eef7ff] px-4 py-2 text-[13px] font-extrabold text-[#005ca8]">
              {requests.length} {requests.length === 1 ? "Request" : "Requests"}
            </span>
          </div>

          {requests.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-190 border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#e3e8ef] text-[13px] text-[#1f2937]">
                    {[
                      "Query ID",
                      "Name / Business",
                      "Mobile",
                      "Current Stage",
                      "Status",
                      "Last Updated",
                    ].map((head) => (
                      <th key={head} className="px-3 py-3 font-extrabold">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => {
                    const selected = selectedRequest?._id === request._id;
                    return (
                      <tr
                        key={request._id}
                        onClick={() => setSelectedId(request._id)}
                        className={`cursor-pointer border-b border-[#eef1f5] text-[13.5px] font-semibold transition ${
                          selected
                            ? "bg-[#eef7ff] text-[#005ca8]"
                            : "text-[#667085] hover:bg-[#f8fbff]"
                        }`}
                      >
                        <td
                          data-service-query-id={request.queryId}
                          className="px-3 py-3.5 font-extrabold"
                        >
                          {request.queryId}
                        </td>
                        <td className="px-3 py-3.5">
                          {request.businessName || request.name || "-"}
                        </td>
                        <td className="px-3 py-3.5">{request.mobile || "-"}</td>
                        <td className="px-3 py-3.5">{request.currentStage}</td>
                        <td className="px-3 py-3.5">
                          <span className="rounded-full bg-[#e8f8ef] px-2.5 py-1 text-[12px] font-extrabold text-[#13a653]">
                            {request.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          {formatDate(request.updatedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-[#f8fbff] px-4 py-8 text-center">
              <div className="mx-auto flex max-w-sm flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4ff] text-[#005ca8]">
                  <FileSearch className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[15px] font-extrabold text-[#1f2937]">
                  No submitted request history yet.
                </p>
                <p className="mt-2 text-[14px] font-semibold leading-6 text-[#667085]">
                  Submit a request while logged in, or track an existing request
                  with your mobile number or Query ID. The latest status updates
                  will appear here.
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedRequest ? (
          <ServiceRequestProgress
            request={selectedRequest}
            showQueryId={false}
          />
        ) : null}
      </div>
    </section>
  );
}
