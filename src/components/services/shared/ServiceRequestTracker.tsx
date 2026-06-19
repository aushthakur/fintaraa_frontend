"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Loader2,
  Search,
  UserCheck,
} from "lucide-react";
import { ServiceRequestProgress } from "./ServiceRequestProgress";
import {
  fetchServiceRequestHistory,
  ServiceRequestRecord,
  ServiceRequestType,
} from "@/services/serviceRequests";
import { isUserLoggedIn } from "@/hooks/authStorage";

const steps = [
  { label: "Inquiry Submitted", icon: ClipboardList },
  { label: "Expert Assigned", icon: UserCheck },
  { label: "Document Review", icon: FileSearch },
  { label: "Processing", icon: Loader2 },
  { label: "Completed", icon: CheckCircle2 },
];

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
    stage.includes("acknowledgement")
  ) {
    return 3;
  }
  if (
    stage.includes("document") ||
    stage.includes("verification") ||
    stage.includes("tax review")
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
}: {
  title: string;
  idLabel: string;
  serviceType: ServiceRequestType;
}) {
  const [mobile, setMobile] = useState("");
  const [queryId, setQueryId] = useState("");
  const [requests, setRequests] = useState<ServiceRequestRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
        return next;
      });
      setSelectedId(request._id);
    };

    window.addEventListener("service-request-created", onCreated);
    return () => {
      active = false;
      window.removeEventListener("service-request-created", onCreated);
    };
  }, [serviceType]);

  useEffect(() => {
    let active = true;
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
        setError((err as Error).message || "Unable to fetch linked request history.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadLinkedRequests();
    return () => {
      active = false;
    };
  }, [serviceType]);

  const selectedRequest = useMemo(
    () => requests.find((request) => request._id === selectedId) || requests[0],
    [requests, selectedId],
  );
  const activeStep = compactStepIndex(selectedRequest);

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

  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-9xl gap-5">
        <div className="rounded-2xl border border-[#d7e5f3] bg-white p-5 shadow-[0_14px_38px_rgba(16,24,40,0.05)] md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[12px] font-black uppercase tracking-wide text-[#13a653]">
                Track Status
              </p>
              <h2 className="mt-1 text-[24px] font-black tracking-[-0.01em] text-[#005ca8] md:text-[28px]">
                {title}
              </h2>
              <p className="mt-2 max-w-2xl text-[14px] font-semibold leading-6 text-[#667085] md:text-[15px]">
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
                <span className="text-[13px] font-black text-[#2a2f36]">
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
                <span className="text-[13px] font-black text-[#2a2f36]">
                  {idLabel}
                </span>
                <input
                  value={queryId}
                  onChange={(event) => setQueryId(event.target.value)}
                  placeholder="FT-ITR-20260619-XXXXX"
                  className="h-11 rounded-lg border border-[#dce3eb] px-3 text-[13px] font-semibold uppercase outline-none placeholder:normal-case placeholder:text-[#a0a7b2] focus:border-[#005ca8] md:text-sm"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#13a653] px-7 text-[13px] font-black text-[#13a653] transition hover:bg-[#13a653] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
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

        <div className="rounded-2xl border border-[#d7dfe8] bg-white p-5 shadow-[0_14px_38px_rgba(16,24,40,0.04)] md:p-8">
          <h3 className="text-[20px] font-black text-[#005ca8] md:text-[24px]">
            {title}
          </h3>
          <div className="mt-8 grid grid-cols-5 items-start">
            {steps.map(({ label, icon: Icon }, index) => {
              const done = index < activeStep;
              const active = index === activeStep;
              return (
                <div key={label} className="relative text-center">
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-5.5 h-0.75 w-full ${
                        index < activeStep ? "bg-[#005ca8]" : "bg-[#daeeff]"
                      }`}
                    />
                  )}
                  <span
                    className={`relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-black shadow-sm ${
                      done || active
                        ? "bg-[#005ca8] text-white"
                        : "bg-[#daeeff] text-[#005ca8]"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : active ? (
                      <Icon className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <p
                    className={`mt-4 text-[12px] font-bold leading-[1.45] md:text-[13px] ${
                      done || active ? "text-[#005ca8]" : "text-[#374151]"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#d7e5f3] bg-white p-5 shadow-[0_14px_38px_rgba(16,24,40,0.04)] md:p-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h3 className="text-[18px] font-black text-[#1f2937]">
                Submitted Request History
              </h3>
              <p className="mt-1 max-w-2xl text-[14px] font-semibold leading-6 text-[#667085]">
                Select any row to view the complete progress timeline and
                remarks below.
              </p>
            </div>
            <span className="rounded-full bg-[#eef7ff] px-4 py-2 text-[13px] font-black text-[#005ca8]">
              {requests.length} {requests.length === 1 ? "Request" : "Requests"}
            </span>
          </div>

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
                    <th key={head} className="px-3 py-3 font-black">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.length ? (
                  requests.map((request) => {
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
                        <td className="px-3 py-3.5 font-black">
                          {request.queryId}
                        </td>
                        <td className="px-3 py-3.5">
                          {request.businessName || request.name || "-"}
                        </td>
                        <td className="px-3 py-3.5">{request.mobile || "-"}</td>
                        <td className="px-3 py-3.5">{request.currentStage}</td>
                        <td className="px-3 py-3.5">
                          <span className="rounded-full bg-[#e8f8ef] px-2.5 py-1 text-[12px] font-black text-[#13a653]">
                            {request.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5">
                          {formatDate(request.updatedAt)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center">
                      <div className="mx-auto flex max-w-lg flex-col items-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4ff] text-[#005ca8]">
                          <FileSearch className="h-5 w-5" />
                        </span>
                        <p className="mt-4 text-[15px] font-black text-[#1f2937]">
                          No submitted request history yet.
                        </p>
                        <p className="mt-2 text-[14px] font-semibold leading-6 text-[#667085]">
                          Submit a request while logged in, or track an
                          existing request with your mobile number or Query ID.
                          The latest status updates will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedRequest ? (
          <ServiceRequestProgress request={selectedRequest} />
        ) : null}
      </div>
    </section>
  );
}
