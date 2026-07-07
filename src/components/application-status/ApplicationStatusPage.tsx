"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileSearch,
  Hash,
  Loader2,
  Phone,
  Search,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { StatusHero } from "./StatusHero";
import { getAuthType } from "@/hooks/authStorage";
import {
  fetchAccountInsuranceApplications,
  fetchAccountLoanApplications,
  type AccountInsuranceQuery,
  type AccountLoanQuery,
} from "@/services/accountActivity";
import {
  fetchPartnerLeadEvents,
  type PartnerLeadEvent,
} from "@/services/partner";
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

const serviceTypes: Array<{
  label: string;
  shortLabel: string;
  value: ServiceRequestType;
}> = [
  { label: "GST Registration", shortLabel: "GST", value: "gst_registration" },
  { label: "ITR Filing", shortLabel: "ITR", value: "itr_filing" },
  {
    label: "Company Registration",
    shortLabel: "Company",
    value: "company_registration",
  },
  {
    label: "Franchise Partner",
    shortLabel: "Franchise",
    value: "franchise_partner",
  },
  { label: "DSA Partner", shortLabel: "DSA", value: "dsa_partner" },
];

const statusTabs = ["All", "Loan", "Insurance", "Service"];

const isCompletedStatus = (value?: string) => {
  const normalized = String(value || "").toLowerCase();
  return [
    "approved",
    "closed",
    "complete",
    "completed",
    "completed_success",
    "disbursed",
    "paid",
    "resolved",
  ].some((status) => normalized.includes(status));
};

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

const mapPartnerLead = (item: PartnerLeadEvent): StatusItem => {
  const productType =
    item.productType === "insurance" ||
    String(item.loanType || "").toLowerCase().startsWith("insurance_")
      ? "insurance"
      : "loan";
  const title =
    productType === "insurance"
      ? titleCase(String(item.loanType || "insurance").replace(/^insurance_/, ""))
      : titleCase(item.loanType || "Loan Application");

  return {
    id: item.id || item._id || item.loanId || `${item.mobile}-${item.createdAt}`,
    queryId: item.loanId || item.id || item._id || "-",
    type: productType,
    title,
    subtitle: [item.customerName, item.mobile].filter(Boolean).join(" • "),
    status: item.status || "Submitted",
    amount: formatCurrency(item.loanAmount),
    assigned: item.assignedAgentName || item.assignedLanderName,
    updatedAt: item.updatedAt || item.createdAt,
    timeline: loanTimeline(item.status),
  };
};

function TrackSearchField({
  id,
  label,
  value,
  placeholder,
  icon,
  active,
  onFocus,
  onBlur,
  onChange,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  icon: ReactNode;
  active: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (value: string) => void;
  inputMode?: "text" | "numeric";
}) {
  return (
    <motion.label
      htmlFor={id}
      animate={{
        borderColor: active ? "#005ca8" : "#dce9f7",
        backgroundColor: active ? "#ffffff" : "#f8fbff",
      }}
      transition={{ duration: 0.2 }}
      className="group relative flex h-[4.25rem] items-center gap-3 border px-4"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center transition ${
          active ? "bg-[#005ca8] text-white" : "bg-white text-[#005ca8]"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-[11px] font-black uppercase tracking-[0.12em] transition ${
            active ? "text-[#005ca8]" : "text-[#667085]"
          }`}
        >
          {label}
        </span>
        <input
          id={id}
          value={value}
          inputMode={inputMode}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full bg-transparent text-[14px] font-black text-[#07162d] outline-none placeholder:text-[#98a2b3]"
        />
      </span>
      {active ? (
        <motion.span
          layoutId="application-search-active-line"
          className="absolute bottom-0 left-0 h-0.5 w-full bg-[#005ca8]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
    </motion.label>
  );
}

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
  const [activeSearchField, setActiveSearchField] = useState<
    "queryId" | "mobile" | null
  >(null);
  const viewerType = useMemo(() => {
    const authType = getAuthType();
    return authType === "user" || authType === "agency" ? authType : null;
  }, []);

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

  const heroCounts = useMemo(() => {
    const completed = items.filter((item) => isCompletedStatus(item.status)).length;
    return {
      total: items.length,
      completed,
      active: Math.max(items.length - completed, 0),
    };
  }, [items]);

  useEffect(() => {
    let active = true;
    if (!viewerType) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (viewerType === "agency") {
          const partnerLeads = await fetchPartnerLeadEvents({
            stage: "all",
            page: 1,
            limit: 100,
          });
          if (!active) return;
          const next = (partnerLeads.result || [])
            .map(mapPartnerLead)
            .sort(
              (a, b) =>
                new Date(b.updatedAt || 0).getTime() -
                new Date(a.updatedAt || 0).getTime(),
            );
          setItems(next);
          setSelectedId(next[0]?.id || "");
          return;
        }

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
  }, [viewerType]);

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
      <StatusHero
        totalApplications={heroCounts.total}
        activeApplications={heroCounts.active}
        completedApplications={heroCounts.completed}
      />
      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-9xl gap-6">
          <div className="bg-white">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[#667085]">
                  {viewerType === "agency" ? "Partner view" : "Track request"}
                </p>
                <h2 className="mt-1 text-[24px] font-black tracking-[-0.01em] text-[#111827] md:text-[30px]">
                  {viewerType === "agency"
                    ? "Partner applications"
                    : "Find submitted applications"}
                </h2>
              </div>
              {!viewerType ? (
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/login?referrer=/application-status"
                    className="inline-flex h-11 items-center justify-center gap-2 bg-[#13a653] px-5 text-[13px] font-black text-white no-underline"
                  >
                    Customer login
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/partner/login?redirect=/application-status"
                    className="inline-flex h-11 items-center justify-center gap-2 bg-[#005ca8] px-5 text-[13px] font-black text-white no-underline"
                  >
                    Partner login
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </div>

            <motion.form
              onSubmit={trackRequest}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="mt-5 overflow-hidden border border-[#dce9f7] bg-white shadow-[0_20px_60px_rgba(0,92,168,0.08)]"
            >
              <div className="flex gap-2 overflow-x-auto border-b border-[#e7eef6] bg-[#f8fbff] p-2">
                {serviceTypes.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSearchServiceType(item.value)}
                    className={`relative h-10 shrink-0 overflow-hidden px-4 text-[12px] font-black uppercase tracking-[0.08em] transition ${
                      searchServiceType === item.value
                        ? "text-white"
                        : "text-[#667085] hover:bg-white hover:text-[#005ca8]"
                    }`}
                    title={item.label}
                  >
                    {searchServiceType === item.value ? (
                      <motion.span
                        layoutId="application-status-service-pill"
                        className="absolute inset-0 bg-[#005ca8]"
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 34,
                        }}
                      />
                    ) : null}
                    <span className="relative z-10">{item.shortLabel}</span>
                  </button>
                ))}
              </div>
              <div className="grid gap-3 p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:p-4">
                <TrackSearchField
                  id="application-query-id"
                  label="Query ID"
                  value={queryId}
                  placeholder="FT-ITR-20260619-XXXXX"
                  icon={<Hash className="h-4 w-4" />}
                  active={activeSearchField === "queryId"}
                  onFocus={() => setActiveSearchField("queryId")}
                  onBlur={() => setActiveSearchField(null)}
                  onChange={setQueryId}
                />
                <TrackSearchField
                  id="application-mobile"
                  label="Mobile Number"
                  value={mobile}
                  placeholder="10-digit mobile"
                  icon={<Phone className="h-4 w-4" />}
                  active={activeSearchField === "mobile"}
                  onFocus={() => setActiveSearchField("mobile")}
                  onBlur={() => setActiveSearchField(null)}
                  onChange={(value) => setMobile(value.replace(/\D/g, "").slice(0, 10))}
                  inputMode="numeric"
                />
                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-[4.25rem] items-center justify-center gap-2 bg-[#005ca8] px-6 text-[13px] font-black text-white shadow-[0_14px_30px_rgba(0,92,168,0.22)] transition hover:bg-[#004f91] disabled:opacity-70 md:min-w-[9rem]"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Track
                </motion.button>
              </div>
            </motion.form>
            <AnimatePresence>
              {error ? (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-4 bg-red-50 px-4 py-3 text-[13px] font-bold text-red-700"
                >
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>
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
