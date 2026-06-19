"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Loader2,
  Search,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { StatusHero } from "./StatusHero";
import { isUserLoggedIn } from "@/hooks/authStorage";
import {
  fetchAccountInsuranceApplications,
  fetchAccountLoanApplications,
  type AccountInsuranceQuery,
  type AccountLoanQuery,
} from "@/services/accountActivity";
import {
  fetchServiceRequestHistory,
  type ServiceRequestRecord,
  type ServiceRequestType,
} from "@/services/serviceRequests";

type StatusItem = {
  id: string;
  queryId: string;
  type: "loan" | "insurance" | "service";
  title: string;
  subtitle: string;
  status: string;
  amount?: string;
  assigned?: string;
  updatedAt?: string;
  timeline: Array<{
    stage: string;
    status: "pending" | "active" | "completed" | "blocked";
    remarks?: string;
    updatedBy?: string;
    updatedAt?: string;
  }>;
};

const serviceTypes: Array<{ label: string; value: ServiceRequestType }> = [
  { label: "GST Registration", value: "gst_registration" },
  { label: "ITR Filing", value: "itr_filing" },
  { label: "Company Registration", value: "company_registration" },
  { label: "Franchise Partner", value: "franchise_partner" },
  { label: "DSA Partner", value: "dsa_partner" },
];

const statusTabs = ["All", "Loan", "Insurance", "Service"];

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

const formatCurrency = (value?: number | string) => {
  const numeric = Number(String(value || "").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return undefined;
  return `₹${numeric.toLocaleString("en-IN")}`;
};

const titleCase = (value = "") =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const personName = (value: unknown) => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  const item = value as Record<string, unknown>;
  return String(item.name || item.username || item.email || item.mobile || "").trim();
};

const loanTimeline = (status?: string): StatusItem["timeline"] => {
  const current = String(status || "submitted").toLowerCase();
  const stages = [
    "Submitted",
    "Under Review",
    "Documents Check",
    "Partner Decision",
    "Completed",
  ];
  const activeIndex = current.includes("complete") || current.includes("approved")
    ? 4
    : current.includes("document")
      ? 2
      : current.includes("review")
        ? 1
        : 0;
  return stages.map((stage, index) => ({
    stage,
    status:
      index < activeIndex ? "completed" : index === activeIndex ? "active" : "pending",
    remarks:
      index === activeIndex
        ? "Latest application status from backend."
        : "",
    updatedBy: index === activeIndex ? "Fintaraa" : "",
  }));
};

const mapLoan = (item: AccountLoanQuery): StatusItem => ({
  id: item._id,
  queryId: item.loanId || item._id,
  type: "loan",
  title: titleCase(item.loanType || "Loan Application"),
  subtitle: [item.bankName, item.city, item.state].filter(Boolean).join(" • "),
  status: item.status || "Submitted",
  amount: formatCurrency(item.loanAmount),
  assigned:
    personName(item.assignedAgent) ||
    personName(item.assignedLander) ||
    item.updatedByName,
  updatedAt: item.updatedAt || item.createdAt,
  timeline: loanTimeline(item.status),
});

const mapInsurance = (item: AccountInsuranceQuery): StatusItem => ({
  id: item._id,
  queryId: item.insuranceId || item.queryId || item._id,
  type: "insurance",
  title: titleCase(item.typeOfInsurance || "Insurance Application"),
  subtitle: [item.city, item.state].filter(Boolean).join(" • "),
  status: item.status || "Submitted",
  amount: formatCurrency(item.annualIncome),
  assigned: personName(item.assignedAgent) || personName(item.assignedLander),
  updatedAt: item.updatedAt || item.createdAt,
  timeline: loanTimeline(item.status),
});

const mapService = (item: ServiceRequestRecord): StatusItem => ({
  id: item._id,
  queryId: item.queryId,
  type: "service",
  title: titleCase(item.serviceType),
  subtitle: item.businessName || item.name || item.mobile || "",
  status: item.status || item.currentStage || "Open",
  assigned: item.assignedExecutive,
  updatedAt: item.updatedAt || item.createdAt,
  timeline: item.timeline || [],
});

function StatusSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-56 animate-pulse rounded-2xl border border-[#e5edf6] bg-white p-5"
        >
          <div className="h-8 w-24 rounded bg-[#edf3f8]" />
          <div className="mt-6 h-6 w-3/4 rounded bg-[#edf3f8]" />
          <div className="mt-3 h-4 w-2/3 rounded bg-[#edf3f8]" />
          <div className="mt-7 h-10 rounded-full bg-[#edf3f8]" />
        </div>
      ))}
    </div>
  );
}

export function ApplicationStatusPage() {
  const [items, setItems] = useState<StatusItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [tab, setTab] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchServiceType, setSearchServiceType] =
    useState<ServiceRequestType>("gst_registration");
  const [queryId, setQueryId] = useState("");
  const [mobile, setMobile] = useState("");

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) || items[0],
    [items, selectedId],
  );

  const filtered = useMemo(
    () =>
      tab === "All"
        ? items
        : items.filter((item) => item.type === tab.toLowerCase()),
    [items, tab],
  );

  useEffect(() => {
    let active = true;
    if (!isUserLoggedIn()) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [loans, insurance, gst, itr, company, franchise, dsa] =
          await Promise.all([
            fetchAccountLoanApplications(),
            fetchAccountInsuranceApplications(),
            fetchServiceRequestHistory({ serviceType: "gst_registration" }),
            fetchServiceRequestHistory({ serviceType: "itr_filing" }),
            fetchServiceRequestHistory({ serviceType: "company_registration" }),
            fetchServiceRequestHistory({ serviceType: "franchise_partner" }),
            fetchServiceRequestHistory({ serviceType: "dsa_partner" }),
          ]);
        if (!active) return;
        const next = [
          ...loans.map(mapLoan),
          ...insurance.map(mapInsurance),
          ...[...gst, ...itr, ...company, ...franchise, ...dsa].map(mapService),
        ].sort(
          (a, b) =>
            new Date(b.updatedAt || 0).getTime() -
            new Date(a.updatedAt || 0).getTime(),
        );
        setItems(next);
        setSelectedId(next[0]?.id || "");
      } catch (err) {
        if (active) setError((err as Error).message || "Unable to load status.");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const trackRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!queryId.trim() && !mobile.trim()) {
      setError("Enter a query ID or mobile number to track a service request.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await fetchServiceRequestHistory({
        serviceType: searchServiceType,
        queryId: queryId.trim(),
        mobile: mobile.trim(),
      });
      const mapped = result.map(mapService);
      setItems((current) => {
        const map = new Map<string, StatusItem>();
        [...mapped, ...current].forEach((item) => map.set(item.id, item));
        return Array.from(map.values());
      });
      setSelectedId(mapped[0]?.id || selectedId);
      if (!mapped.length) setError("No request found for the submitted details.");
    } catch (err) {
      setError((err as Error).message || "Unable to track request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      <StatusHero />
      <section className="px-4 pb-14 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-6">
          <div className="rounded-2xl border border-[#dce9f7] bg-[#f8fbff] p-5 md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-black uppercase tracking-[0.14em] text-[#005ca8]">
                  <ClipboardList className="h-4 w-4" />
                  Live application tracking
                </p>
                <h2 className="mt-4 text-[28px] font-black text-[#111827]">
                  Track submitted applications and service requests
                </h2>
                <p className="mt-2 max-w-2xl text-[15px] font-semibold leading-7 text-[#667085]">
                  Logged-in users see linked loan, insurance, GST, ITR, company,
                  franchise, and DSA requests automatically.
                </p>
              </div>
              {!isUserLoggedIn() ? (
                <Link
                  href="/login?referrer=/application-status"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#13a653] px-5 text-[13px] font-black text-white no-underline"
                >
                  Login to view linked applications
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            <form
              onSubmit={trackRequest}
              className="mt-6 grid gap-3 rounded-2xl bg-white p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <select
                value={searchServiceType}
                onChange={(event) =>
                  setSearchServiceType(event.target.value as ServiceRequestType)
                }
                className="h-11 rounded-xl border border-[#dce9f7] bg-white px-3 text-[13px] font-bold text-[#344054] outline-none focus:border-[#005ca8]"
              >
                {serviceTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input
                value={queryId}
                onChange={(event) => setQueryId(event.target.value)}
                placeholder="Query ID"
                className="h-11 rounded-xl border border-[#dce9f7] px-3 text-[13px] font-bold outline-none placeholder:text-[#98a2b3] focus:border-[#005ca8]"
              />
              <input
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                placeholder="Mobile number"
                className="h-11 rounded-xl border border-[#dce9f7] px-3 text-[13px] font-bold outline-none placeholder:text-[#98a2b3] focus:border-[#005ca8]"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#005ca8] px-5 text-[13px] font-black text-white disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Track
              </button>
            </form>
            {error ? (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-bold text-red-700">
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {statusTabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`h-10 rounded-full px-5 text-[12px] font-black ${
                  tab === item
                    ? "bg-[#005ca8] text-white"
                    : "bg-[#f3f7fb] text-[#667085]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {loading && !items.length ? (
            <StatusSkeleton />
          ) : filtered.length ? (
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`rounded-2xl border bg-white p-5 text-left shadow-[0_16px_42px_rgba(16,24,40,0.05)] transition hover:-translate-y-0.5 ${
                      selected?.id === item.id
                        ? "border-[#005ca8]"
                        : "border-[#e5edf6]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#005ca8]">
                        {item.type}
                      </span>
                      <span className="rounded-full bg-[#ecfdf3] px-3 py-1 text-[11px] font-black text-[#027a48]">
                        {titleCase(item.status)}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[18px] font-black text-[#111827]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13px] font-semibold text-[#667085]">
                      {item.subtitle || item.queryId}
                    </p>
                    <div className="mt-4 grid gap-2 text-[12px] font-bold text-[#475467]">
                      <span>Query ID: {item.queryId}</span>
                      <span>Last updated: {formatDate(item.updatedAt)}</span>
                      {item.assigned ? <span>Assigned: {item.assigned}</span> : null}
                    </div>
                  </button>
                ))}
              </div>

              {selected ? (
                <div className="rounded-2xl border border-[#dce9f7] bg-white p-5 shadow-[0_18px_52px_rgba(16,24,40,0.06)] md:p-7">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#13a653]">
                        Selected application
                      </p>
                      <h2 className="mt-2 text-[26px] font-black text-[#111827]">
                        {selected.title}
                      </h2>
                      <p className="mt-1 text-[14px] font-semibold text-[#667085]">
                        {selected.queryId}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#eef6ff] px-4 py-2 text-[12px] font-black text-[#005ca8]">
                      {titleCase(selected.status)}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Type", titleCase(selected.type)],
                      ["Amount", selected.amount || "Not applicable"],
                      ["Assigned", selected.assigned || "Pending"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-[#f8fbff] p-4">
                        <p className="text-[11px] font-black uppercase tracking-wide text-[#98a2b3]">
                          {label}
                        </p>
                        <p className="mt-1 text-[14px] font-black text-[#111827]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7">
                    <h3 className="text-[18px] font-black text-[#111827]">
                      Progress Timeline
                    </h3>
                    <div className="mt-5 grid gap-5">
                      {selected.timeline.map((step, index) => {
                        const isDone = step.status === "completed";
                        const isActive = step.status === "active";
                        const Icon = isDone
                          ? CheckCircle2
                          : isActive
                            ? FileSearch
                            : index === 1
                              ? UserCheck
                              : ShieldCheck;
                        return (
                          <div
                            key={`${step.stage}-${index}`}
                            className="relative grid gap-3 pl-14"
                          >
                            <span
                              className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full ${
                                isDone
                                  ? "bg-[#13a653] text-white"
                                  : isActive
                                    ? "bg-[#005ca8] text-white"
                                    : "bg-[#eef6ff] text-[#8aa2bc]"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <div>
                              <p className="text-[15px] font-black text-[#111827]">
                                {step.stage}
                              </p>
                              <p className="mt-1 text-[13px] font-semibold leading-6 text-[#667085]">
                                {step.remarks || "Status update pending."}
                              </p>
                              <p className="mt-1 text-[12px] font-bold text-[#98a2b3]">
                                {step.updatedBy ? `${step.updatedBy} • ` : ""}
                                {formatDate(step.updatedAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mx-auto max-w-xl py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef6ff] text-[#005ca8]">
                <ClipboardList className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-[22px] font-black text-[#111827]">
                No applications found
              </h3>
              <p className="mt-2 text-[15px] font-semibold leading-7 text-[#667085]">
                Apply for a product or track a submitted service request with
                your query ID or mobile number.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#13a653] px-5 text-[13px] font-black text-white no-underline"
              >
                Explore products
              </Link>
            </div>
          )}
        </div>
      </section>
      <AppDownloadBanner />
    </main>
  );
}
