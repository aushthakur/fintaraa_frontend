"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Copy,
  FileCheck2,
  FileSearch,
  FileText,
  Handshake,
  Hash,
  HelpCircle,
  Landmark,
  Loader2,
  LockKeyhole,
  Phone,
  ReceiptText,
  Search,
  ShieldCheck,
  Store,
  UserCheck,
  WalletCards,
} from "lucide-react";
import { AppDownloadBanner } from "@/components/common/layout/Footer";
import { StatusHero } from "./StatusHero";
import { getAuthType } from "@/hooks/authStorage";
import { AUTH_CHANGED_EVENT } from "@/lib/authEvents";
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

type TimelineStatus = "pending" | "active" | "completed" | "blocked";
type ViewerType = "user" | "agency" | null;
type StatusFilter = "All" | "Loan" | "Insurance" | "Service";

type StatusItem = {
  id: string;
  queryId: string;
  type: "loan" | "insurance" | "service";
  title: string;
  subtitle: string;
  status: string;
  amount?: string;
  amountLabel?: string;
  assigned?: string;
  updatedAt?: string;
  timeline: Array<{
    stage: string;
    status: TimelineStatus;
    remarks?: string;
    updatedBy?: string;
    updatedAt?: string;
  }>;
};

type ServiceOption = {
  label: string;
  shortLabel: string;
  value: ServiceRequestType;
  example: string;
  icon: LucideIcon;
};

const serviceTypes: ServiceOption[] = [
  {
    label: "GST Registration",
    shortLabel: "GST",
    value: "gst_registration",
    example: "FT-GST-20260711-XXXXX",
    icon: ReceiptText,
  },
  {
    label: "ITR Filing",
    shortLabel: "ITR",
    value: "itr_filing",
    example: "FT-ITR-20260711-XXXXX",
    icon: FileText,
  },
  {
    label: "Company Registration",
    shortLabel: "Company",
    value: "company_registration",
    example: "FT-COMPANY-20260711-XXXXX",
    icon: Building2,
  },
  {
    label: "Franchise Partner",
    shortLabel: "Franchise",
    value: "franchise_partner",
    example: "FT-FRANCHISE-20260711-XXXXX",
    icon: Store,
  },
  {
    label: "DSA Partner",
    shortLabel: "DSA",
    value: "dsa_partner",
    example: "FT-DSA-20260711-XXXXX",
    icon: Handshake,
  },
];

const statusTabs: StatusFilter[] = ["All", "Loan", "Insurance", "Service"];

const ease = [0.22, 1, 0.36, 1] as const;

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

const titleCase = (value = "") =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\b(Gst|Itr|Dsa|Kyc|Emi|Nbfc)\b/g, (word) =>
      word.toUpperCase(),
    );

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

const isBlockedStatus = (value?: string) => {
  const normalized = String(value || "").toLowerCase();
  return ["blocked", "cancelled", "declined", "failed", "rejected"].some(
    (status) => normalized.includes(status),
  );
};

const isTerminalStatus = (value?: string) =>
  isCompletedStatus(value) || isBlockedStatus(value);

const getStatusMeta = (value?: string) => {
  const normalized = String(value || "submitted").toLowerCase();
  const label = titleCase(value || "Submitted");

  if (isCompletedStatus(normalized)) {
    return {
      label,
      badge: "bg-[#eafaf1] text-[#087443]",
      dot: "bg-[#12a66a]",
    };
  }
  if (isBlockedStatus(normalized)) {
    return {
      label,
      badge: "bg-[#fff0f0] text-[#c33232]",
      dot: "bg-[#d64545]",
    };
  }
  if (
    normalized.includes("document") ||
    normalized.includes("awaiting") ||
    normalized.includes("pending")
  ) {
    return {
      label,
      badge: "bg-[#fff7e8] text-[#a85b00]",
      dot: "bg-[#e59b2f]",
    };
  }
  return {
    label,
    badge: "bg-[#eaf4ff] text-[#005ca8]",
    dot: "bg-[#147cc1]",
  };
};

const formatDate = (value?: string) => {
  if (!value) return "Not updated";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not updated";
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
  return "₹" + numeric.toLocaleString("en-IN");
};

const personName = (value: unknown) => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  const item = value as Record<string, unknown>;
  return String(
    item.name || item.username || item.email || item.mobile || "",
  ).trim();
};

const loanTimeline = (status?: string): StatusItem["timeline"] => {
  const current = String(status || "submitted").toLowerCase();
  const blocked = isBlockedStatus(current);
  const stages = [
    "Submitted",
    "Under Review",
    "Documents Check",
    "Partner Decision",
    "Completed",
  ];
  const activeIndex = isCompletedStatus(current)
    ? 4
    : current.includes("sanction") || current.includes("decision")
      ? 3
      : current.includes("document")
        ? 2
        : current.includes("review") || current.includes("login")
          ? 1
          : 0;

  return stages.map((stage, index) => {
    let stepStatus: TimelineStatus = "pending";
    if (index < activeIndex) stepStatus = "completed";
    if (index === activeIndex) stepStatus = blocked ? "blocked" : "active";
    if (isCompletedStatus(current) && index === activeIndex) {
      stepStatus = "completed";
    }

    return {
      stage,
      status: stepStatus,
      remarks:
        index === activeIndex
          ? blocked
            ? "This application needs attention. Contact support for the next step."
            : "This is the latest status shared by Fintaraa."
          : "",
      updatedBy: index === activeIndex ? "Fintaraa" : "",
    };
  });
};

const serviceTimeline = (
  item: ServiceRequestRecord,
): StatusItem["timeline"] => {
  if (Array.isArray(item.timeline) && item.timeline.length) {
    return item.timeline;
  }
  return [
    {
      stage: titleCase(item.currentStage || item.status || "Submitted"),
      status: isCompletedStatus(item.status)
        ? "completed"
        : isBlockedStatus(item.status)
          ? "blocked"
          : "active",
      remarks: "This is the latest service request status.",
      updatedBy: item.assignedExecutive || "Fintaraa",
      updatedAt: item.updatedAt || item.createdAt,
    },
  ];
};

const mapLoan = (item: AccountLoanQuery): StatusItem => ({
  id: item._id,
  queryId: item.loanId || item._id,
  type: "loan",
  title: titleCase(item.loanType || "Loan Application"),
  subtitle: [item.bankName, item.city, item.state].filter(Boolean).join(" • "),
  status: item.status || "Submitted",
  amount: formatCurrency(item.loanAmount),
  amountLabel: "Requested amount",
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
  amountLabel: "Annual income",
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
  timeline: serviceTimeline(item),
});

const mapPartnerLead = (item: PartnerLeadEvent): StatusItem => {
  const productType =
    item.productType === "insurance" ||
    String(item.loanType || "")
      .toLowerCase()
      .startsWith("insurance_")
      ? "insurance"
      : "loan";
  const title =
    productType === "insurance"
      ? titleCase(
          String(item.loanType || "insurance").replace(/^insurance_/, ""),
        )
      : titleCase(item.loanType || "Loan Application");

  return {
    id:
      item.id ||
      item._id ||
      item.loanId ||
      String(item.mobile || "lead") + "-" + String(item.createdAt || ""),
    queryId: item.loanId || item.id || item._id || "-",
    type: productType,
    title,
    subtitle: [item.customerName, item.mobile].filter(Boolean).join(" • "),
    status: item.status || "Submitted",
    amount: formatCurrency(item.loanAmount),
    amountLabel: "Requested amount",
    assigned: item.assignedAgentName || item.assignedLanderName,
    updatedAt: item.updatedAt || item.createdAt,
    timeline: loanTimeline(item.status),
  };
};

const itemTypeMeta: Record<
  StatusItem["type"],
  { label: string; icon: LucideIcon; tone: string }
> = {
  loan: {
    label: "Loan",
    icon: WalletCards,
    tone: "bg-[#eaf4ff] text-[#005ca8]",
  },
  insurance: {
    label: "Insurance",
    icon: ShieldCheck,
    tone: "bg-[#eef8f4] text-[#087443]",
  },
  service: {
    label: "Service",
    icon: FileCheck2,
    tone: "bg-[#f1efff] text-[#5b4bb7]",
  },
};

function TrackSearchField({
  id,
  label,
  value,
  placeholder,
  hint,
  icon,
  active,
  invalid,
  onFocus,
  onBlur,
  onChange,
  inputMode,
  autoComplete,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  hint: string;
  icon: ReactNode;
  active: boolean;
  invalid?: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (value: string) => void;
  inputMode?: "text" | "numeric";
  autoComplete?: string;
  maxLength?: number;
}) {
  const hintId = id + "-hint";
  return (
    <motion.label
      htmlFor={id}
      animate={{
        borderColor: invalid ? "#d64545" : active ? "#147cc1" : "#d9e5f0",
        backgroundColor: active ? "#ffffff" : "#f9fbfd",
      }}
      transition={{ duration: 0.2 }}
      className="group relative flex min-h-20 items-center gap-3 rounded-md border border-[#d9e5f0] px-4 py-3"
    >
      <span
        className={cx(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors",
          invalid
            ? "bg-[#fff0f0] text-[#c33232]"
            : active
              ? "bg-[#005ca8] text-white"
              : "bg-[#eaf4ff] text-[#005ca8]",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cx(
            "block text-[11px] font-extrabold uppercase text-[#667085] transition-colors",
            active && "text-[#005ca8]",
            invalid && "text-[#c33232]",
          )}
        >
          {label}
        </span>
        <input
          id={id}
          name={id}
          value={value}
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-describedby={hintId}
          aria-invalid={invalid || undefined}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full bg-transparent text-[14px] font-bold text-[#07162d] outline-none placeholder:font-semibold placeholder:text-[#98a2b3]"
        />
        <span
          id={hintId}
          className="mt-1 block truncate text-[10px] font-semibold text-[#98a2b3]"
        >
          {hint}
        </span>
      </span>
      {active ? (
        <motion.span
          layoutId="application-search-active-line"
          className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#147cc1]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      ) : null}
    </motion.label>
  );
}

function StatusSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <div className="overflow-hidden rounded-lg border border-[#e3ebf3] bg-white">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse px-5 py-5 not-last:border-b not-last:border-[#edf2f7]"
          >
            <div className="h-4 w-20 rounded bg-[#edf3f8]" />
            <div className="mt-4 h-5 w-3/5 rounded bg-[#edf3f8]" />
            <div className="mt-3 h-3 w-2/5 rounded bg-[#edf3f8]" />
          </div>
        ))}
      </div>
      <div className="min-h-120 animate-pulse rounded-lg border border-[#e3ebf3] bg-white p-6">
        <div className="h-4 w-28 rounded bg-[#edf3f8]" />
        <div className="mt-5 h-8 w-1/2 rounded bg-[#edf3f8]" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-18 rounded bg-[#f1f5f9]" />
          ))}
        </div>
        <div className="mt-9 space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-14 rounded bg-[#f1f5f9]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ApplicationStatusPage() {
  const [items, setItems] = useState<StatusItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [tab, setTab] = useState<StatusFilter>("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<
    "queryId" | "mobile" | "both" | null
  >(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchServiceType, setSearchServiceType] =
    useState<ServiceRequestType>("gst_registration");
  const [queryId, setQueryId] = useState("");
  const [mobile, setMobile] = useState("");
  const [activeSearchField, setActiveSearchField] = useState<
    "queryId" | "mobile" | null
  >(null);
  const [viewerType, setViewerType] = useState<ViewerType>(null);
  const [authReady, setAuthReady] = useState(false);
  const [copiedReference, setCopiedReference] = useState("");

  useEffect(() => {
    const syncViewer = () => {
      const authType = getAuthType();
      const nextViewer =
        authType === "user" || authType === "agency" ? authType : null;
      setViewerType(nextViewer);
      setAuthReady(true);
      if (!nextViewer) {
        setItems([]);
        setSelectedId("");
      }
    };
    syncViewer();
    window.addEventListener(AUTH_CHANGED_EVENT, syncViewer);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, syncViewer);
  }, []);

  const selectedService = useMemo(
    () =>
      serviceTypes.find((item) => item.value === searchServiceType) ||
      serviceTypes[0],
    [searchServiceType],
  );

  const filtered = useMemo(
    () =>
      tab === "All"
        ? items
        : items.filter((item) => item.type === tab.toLowerCase()),
    [items, tab],
  );

  const selected = useMemo(
    () => filtered.find((item) => item.id === selectedId) || filtered[0],
    [filtered, selectedId],
  );

  const tabCounts = useMemo<Record<StatusFilter, number>>(
    () => ({
      All: items.length,
      Loan: items.filter((item) => item.type === "loan").length,
      Insurance: items.filter((item) => item.type === "insurance").length,
      Service: items.filter((item) => item.type === "service").length,
    }),
    [items],
  );

  const heroCounts = useMemo(() => {
    const completed = items.filter((item) =>
      isCompletedStatus(item.status),
    ).length;
    const active = items.filter(
      (item) => !isTerminalStatus(item.status),
    ).length;
    return { total: items.length, completed, active };
  }, [items]);

  useEffect(() => {
    let active = true;
    if (!authReady || !viewerType) return;

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
        if (active) {
          setError(
            (err as Error).message ||
              "We could not load your applications right now.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [authReady, viewerType]);

  const clearFieldFeedback = () => {
    setFieldError(null);
    if (error) setError("");
  };

  const trackRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedQueryId = queryId.trim().toUpperCase();
    const normalizedMobile = mobile.replace(/\D/g, "");

    if (!normalizedQueryId && !normalizedMobile) {
      setFieldError("both");
      setError("Enter a Query ID or the registered mobile number.");
      return;
    }
    if (normalizedMobile && normalizedMobile.length !== 10) {
      setFieldError("mobile");
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError("");
    setFieldError(null);
    setHasSearched(true);
    setQueryId(normalizedQueryId);
    try {
      const result = await fetchServiceRequestHistory({
        serviceType: searchServiceType,
        queryId: normalizedQueryId,
        mobile: normalizedMobile,
      });
      const mapped = result.map(mapService);
      setItems((current) => {
        const map = new Map<string, StatusItem>();
        [...mapped, ...current].forEach((item) => map.set(item.id, item));
        return Array.from(map.values());
      });
      if (mapped.length) {
        setTab("Service");
        setSelectedId(mapped[0].id);
      } else {
        setError(
          "No matching " +
            selectedService.label.toLowerCase() +
            " request was found. Check the submitted details and try again.",
        );
      }
    } catch (err) {
      setError(
        (err as Error).message ||
          "We could not track this request right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyReference = async (value: string) => {
    if (!value || value === "-") return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedReference(value);
      window.setTimeout(() => {
        setCopiedReference((current) => (current === value ? "" : current));
      }, 1600);
    } catch {
      setCopiedReference("");
    }
  };

  const emptyTitle =
    tab === "All"
      ? "No applications to show yet"
      : "No " + tab.toLowerCase() + " applications";

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen bg-white text-[#101828]">
        <StatusHero
          totalApplications={heroCounts.total}
          activeApplications={heroCounts.active}
          completedApplications={heroCounts.completed}
          viewerType={viewerType}
        />

        <section className="px-4 py-9 md:px-6 md:py-11 lg:px-8">
          <div className="mx-auto max-w-9xl">
            <motion.div
              initial={{ opacity: 1, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease }}
              className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-0.75 w-8 bg-[#147cc1]" />
                  <p className="text-[11px] font-extrabold uppercase text-[#005ca8] md:text-[12px]">
                    Secure request lookup
                  </p>
                </div>
                <h2 className="mt-3 text-[27px] font-extrabold leading-tight text-[#07162d] md:text-[32px]">
                  {viewerType === "agency"
                    ? "Applications and lead activity"
                    : viewerType === "user"
                      ? "Your applications and service requests"
                      : "Track a submitted service request"}
                </h2>
                <p className="mt-3 max-w-3xl text-[14px] font-medium leading-7 text-[#5f6f82] md:text-[15px]">
                  Public lookup is available for GST, ITR, company registration,
                  franchise, and DSA requests. Sign in to view loan and
                  insurance applications linked to your account.
                </p>
              </div>

              {!viewerType ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/login?referrer=/application-status"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#087443] px-5 text-[13px] font-extrabold text-white no-underline transition-colors hover:bg-[#06653a]"
                  >
                    Customer login
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/partner/login?redirect=/application-status"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#005ca8] px-5 text-[13px] font-extrabold text-white no-underline transition-colors hover:bg-[#004e8e]"
                  >
                    Partner login
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : viewerType ? (
                <div className="flex items-center gap-3 rounded-md bg-[#edf8f3] px-4 py-3 text-[#087443]">
                  <BadgeCheck className="h-5 w-5" />
                  <div>
                    <p className="text-[12px] font-extrabold">Signed-in view</p>
                    <p className="text-[11px] font-semibold text-[#477561]">
                      Account-linked records load automatically
                    </p>
                  </div>
                </div>
              ) : null}
            </motion.div>

            <motion.form
              onSubmit={trackRequest}
              initial={{ opacity: 1, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.08, ease }}
              className="mt-7 overflow-hidden rounded-lg border border-[#d9e5f0] bg-white shadow-[0_16px_46px_rgba(19,68,108,0.07)]"
            >
              <div className="flex flex-col gap-3 bg-[#f6faff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e4f2ff] text-[#005ca8]">
                    <LockKeyhole className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[13px] font-extrabold text-[#172b45]">
                      Find your service request
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#718096]">
                      Use the details entered when the request was submitted
                    </p>
                  </div>
                </div>
                <p className="flex items-center gap-2 text-[11px] font-bold text-[#477561]">
                  <ShieldCheck className="h-4 w-4 text-[#087443]" />
                  Private and secure lookup
                </p>
              </div>

              <fieldset className="px-5 pt-5">
                <legend className="text-[11px] font-extrabold uppercase text-[#667085]">
                  Select service type
                </legend>
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {serviceTypes.map((item) => {
                    const Icon = item.icon;
                    const active = searchServiceType === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setSearchServiceType(item.value);
                          clearFieldFeedback();
                        }}
                        className={cx(
                          "relative flex h-11 shrink-0 items-center gap-2 overflow-hidden rounded-md px-3.5 text-[12px] font-extrabold transition-colors",
                          active
                            ? "text-white"
                            : "bg-[#f4f7fa] text-[#5f6f82] hover:bg-[#eaf4ff] hover:text-[#005ca8]",
                        )}
                        title={item.label}
                      >
                        {active ? (
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
                        <Icon className="relative z-10 h-4 w-4" />
                        <span className="relative z-10 sm:hidden">
                          {item.shortLabel}
                        </span>
                        <span className="relative z-10 hidden sm:inline">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-4 px-5 pb-5 pt-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <TrackSearchField
                  id="application-query-id"
                  label="Query ID"
                  value={queryId}
                  placeholder={selectedService.example}
                  hint="Shown in your confirmation message or email"
                  icon={<Hash className="h-4.5 w-4.5" />}
                  active={activeSearchField === "queryId"}
                  invalid={fieldError === "queryId" || fieldError === "both"}
                  onFocus={() => setActiveSearchField("queryId")}
                  onBlur={() => setActiveSearchField(null)}
                  onChange={(value) => {
                    setQueryId(value.toUpperCase().slice(0, 64));
                    clearFieldFeedback();
                  }}
                  autoComplete="off"
                  maxLength={64}
                />
                <TrackSearchField
                  id="application-mobile"
                  label="Registered mobile"
                  value={mobile}
                  placeholder="Enter 10-digit mobile number"
                  hint="Use the number entered in the original request"
                  icon={<Phone className="h-4.5 w-4.5" />}
                  active={activeSearchField === "mobile"}
                  invalid={fieldError === "mobile" || fieldError === "both"}
                  onFocus={() => setActiveSearchField("mobile")}
                  onBlur={() => setActiveSearchField(null)}
                  onChange={(value) => {
                    setMobile(value.replace(/\D/g, "").slice(0, 10));
                    clearFieldFeedback();
                  }}
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                />
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-h-20 items-center justify-center gap-2 rounded-md bg-[#005ca8] px-7 text-[13px] font-extrabold text-white transition-colors hover:bg-[#004e8e] disabled:cursor-not-allowed disabled:opacity-65 md:min-w-40"
                >
                  {loading ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <Search className="h-4.5 w-4.5" />
                  )}
                  {loading ? "Checking..." : "Track request"}
                </motion.button>
              </div>

              <div className="flex flex-col gap-2 bg-[#fbfcfd] px-5 py-3 text-[11px] font-semibold text-[#718096] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Enter either the Query ID or registered mobile number. Both
                  are not required.
                </p>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-1.5 font-extrabold text-[#005ca8] no-underline"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Need help finding your ID?
                </Link>
              </div>
            </motion.form>

            <AnimatePresence>
              {error ? (
                <motion.div
                  initial={{ opacity: 1, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 1, y: -4 }}
                  role="alert"
                  className="mt-4 flex items-start gap-3 rounded-md bg-[#fff2f2] px-4 py-3 text-[#b52b2b]"
                >
                  <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                  <p className="text-[13px] font-bold leading-6">{error}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-11 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase text-[#005ca8]">
                  Status overview
                </p>
                <h2 className="mt-2 text-[25px] font-extrabold text-[#07162d] md:text-[29px]">
                  {viewerType === "agency"
                    ? "Partner applications"
                    : "Applications and requests"}
                </h2>
                <p className="mt-2 text-[13px] font-semibold text-[#718096]">
                  {items.length
                    ? String(items.length) +
                      " record" +
                      (items.length === 1 ? "" : "s") +
                      " available"
                    : "Results will appear here after lookup or login"}
                </p>
              </div>

              <div
                role="tablist"
                aria-label="Filter applications"
                className="flex max-w-full gap-1 overflow-x-auto rounded-md bg-[#f1f5f9] p-1"
              >
                {statusTabs.map((item) => {
                  const active = tab === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(item)}
                      className={cx(
                        "relative flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded px-3.5 text-[12px] font-extrabold transition-colors",
                        active
                          ? "text-[#005ca8]"
                          : "text-[#667085] hover:text-[#005ca8]",
                      )}
                    >
                      {active ? (
                        <motion.span
                          layoutId="application-status-filter"
                          className="absolute inset-0 bg-white"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 36,
                          }}
                        />
                      ) : null}
                      <span className="relative z-10">{item}</span>
                      <span
                        className={cx(
                          "relative z-10 min-w-5 rounded-full px-1.5 py-0.5 text-[10px]",
                          active
                            ? "bg-[#eaf4ff] text-[#005ca8]"
                            : "bg-[#e5ebf1] text-[#667085]",
                        )}
                      >
                        {tabCounts[item]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              {loading && !items.length ? (
                <StatusSkeleton />
              ) : filtered.length ? (
                <motion.div
                  initial={{ opacity: 1, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.58, ease }}
                  className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]"
                >
                  <section
                    aria-label="Application list"
                    className="self-start overflow-hidden rounded-lg border border-[#e0e9f2] bg-white"
                  >
                    <div className="flex items-center justify-between bg-[#f8fbfd] px-5 py-3.5">
                      <p className="text-[12px] font-extrabold text-[#34465c]">
                        {tab} records
                      </p>
                      <span className="text-[11px] font-bold text-[#718096]">
                        Select to view details
                      </span>
                    </div>
                    <div>
                      {filtered.map((item, index) => {
                        const typeMeta = itemTypeMeta[item.type];
                        const TypeIcon = typeMeta.icon;
                        const statusMeta = getStatusMeta(item.status);
                        const active = selected?.id === item.id;
                        return (
                          <motion.button
                            key={item.id}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelectedId(item.id)}
                            whileHover={{ x: 3 }}
                            className={cx(
                              "group relative flex w-full items-start gap-4 px-5 py-5 text-left transition-colors",
                              index !== filtered.length - 1 &&
                                "border-b border-[#edf2f6]",
                              active
                                ? "bg-[#f5faff]"
                                : "bg-white hover:bg-[#fafcfe]",
                            )}
                          >
                            {active ? (
                              <motion.span
                                layoutId="selected-application-line"
                                className="absolute bottom-3 left-0 top-3 w-1 bg-[#147cc1]"
                                transition={{
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 36,
                                }}
                              />
                            ) : null}
                            <span
                              className={cx(
                                "flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
                                typeMeta.tone,
                              )}
                            >
                              <TypeIcon className="h-5 w-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-start justify-between gap-2">
                                <span>
                                  <span className="block text-[11px] font-extrabold uppercase text-[#718096]">
                                    {typeMeta.label}
                                  </span>
                                  <span className="mt-1 block text-[16px] font-extrabold leading-6 text-[#132842]">
                                    {item.title}
                                  </span>
                                </span>
                                <span
                                  className={cx(
                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold",
                                    statusMeta.badge,
                                  )}
                                >
                                  <span
                                    className={cx(
                                      "h-1.5 w-1.5 rounded-full",
                                      statusMeta.dot,
                                    )}
                                  />
                                  {statusMeta.label}
                                </span>
                              </span>
                              <span className="mt-2 block truncate text-[12px] font-semibold text-[#66758a]">
                                {item.subtitle || item.queryId}
                              </span>
                              <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-[#8a98aa]">
                                <span className="font-mono text-[#52657c]">
                                  {item.queryId}
                                </span>
                                <span>{formatDate(item.updatedAt)}</span>
                              </span>
                            </span>
                            <ChevronRight
                              className={cx(
                                "mt-3 h-4 w-4 shrink-0 transition-colors",
                                active
                                  ? "text-[#147cc1]"
                                  : "text-[#a9b5c2] group-hover:text-[#147cc1]",
                              )}
                            />
                          </motion.button>
                        );
                      })}
                    </div>
                  </section>

                  {selected ? (
                    <motion.aside
                      key={selected.id}
                      initial={{ opacity: 1, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, ease }}
                      className="overflow-hidden rounded-lg border border-[#d9e5f0] bg-white"
                    >
                      <div className="bg-[#f6faff] px-5 py-5 md:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-[11px] font-extrabold uppercase text-[#005ca8]">
                              Selected application
                            </p>
                            <h2 className="mt-2 text-[23px] font-extrabold leading-tight text-[#07162d] md:text-[27px]">
                              {selected.title}
                            </h2>
                            <div className="mt-2 flex items-center gap-2">
                              <p className="truncate font-mono text-[12px] font-bold text-[#5f6f82]">
                                {selected.queryId}
                              </p>
                              {selected.queryId !== "-" ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyReference(selected.queryId)
                                  }
                                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[#005ca8] transition-colors hover:bg-[#e2f1ff]"
                                  aria-label="Copy application reference"
                                  title="Copy reference"
                                >
                                  {copiedReference === selected.queryId ? (
                                    <Check className="h-3.5 w-3.5" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              ) : null}
                            </div>
                          </div>
                          {(() => {
                            const meta = getStatusMeta(selected.status);
                            return (
                              <span
                                className={cx(
                                  "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-extrabold",
                                  meta.badge,
                                )}
                              >
                                <span
                                  className={cx(
                                    "h-2 w-2 rounded-full",
                                    meta.dot,
                                  )}
                                />
                                {meta.label}
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      <dl className="grid border-b border-[#e7eef5] sm:grid-cols-2">
                        {[
                          ["Application type", titleCase(selected.type)],
                          [
                            selected.amount
                              ? selected.amountLabel || "Amount"
                              : "Applicant / business",
                            selected.amount ||
                              selected.subtitle ||
                              "Not provided",
                          ],
                          [
                            "Assigned to",
                            selected.assigned || "Assignment pending",
                          ],
                          ["Last updated", formatDate(selected.updatedAt)],
                        ].map(([label, value], index) => (
                          <div
                            key={label}
                            className={cx(
                              "px-5 py-4 md:px-6",
                              index < 2 && "border-b border-[#edf2f6]",
                              index >= 2 &&
                                "border-b border-[#edf2f6] sm:border-b-0",
                              index % 2 === 0 &&
                                "sm:border-r sm:border-[#edf2f6]",
                            )}
                          >
                            <dt className="text-[10px] font-extrabold uppercase text-[#8a98aa]">
                              {label}
                            </dt>
                            <dd className="mt-1.5 text-[13px] font-extrabold leading-6 text-[#263a53]">
                              {value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <div className="px-5 py-6 md:px-6">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-[17px] font-extrabold text-[#132842]">
                              Progress timeline
                            </h3>
                            <p className="mt-1 text-[12px] font-semibold text-[#718096]">
                              Latest stages reported for this application
                            </p>
                          </div>
                          <FileSearch className="h-5 w-5 text-[#147cc1]" />
                        </div>

                        <div className="relative mt-6 grid gap-6">
                          <span className="absolute bottom-5 left-5 top-5 w-0.5 bg-[#dce8f2]" />
                          {selected.timeline.map((step, index) => {
                            const isDone = step.status === "completed";
                            const isActive = step.status === "active";
                            const isBlocked = step.status === "blocked";
                            const Icon = isDone
                              ? CheckCircle2
                              : isBlocked
                                ? AlertCircle
                                : isActive
                                  ? FileSearch
                                  : index === 1
                                    ? UserCheck
                                    : ShieldCheck;
                            return (
                              <motion.div
                                key={step.stage + "-" + String(index)}
                                initial={{ opacity: 1, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{
                                  duration: 0.45,
                                  delay: index * 0.06,
                                  ease,
                                }}
                                className="relative grid gap-2 pl-14"
                              >
                                <span
                                  className={cx(
                                    "absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full",
                                    isDone && "bg-[#12a66a] text-white",
                                    isActive && "bg-[#147cc1] text-white",
                                    isBlocked && "bg-[#d64545] text-white",
                                    !isDone &&
                                      !isActive &&
                                      !isBlocked &&
                                      "bg-[#edf3f8] text-[#91a2b4]",
                                  )}
                                >
                                  {isActive ? (
                                    <motion.span
                                      aria-hidden="true"
                                      animate={{
                                        scale: [1, 1.45],
                                        opacity: [0.35, 0],
                                      }}
                                      transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                        ease: "easeOut",
                                      }}
                                      className="absolute inset-0 rounded-full bg-[#147cc1]"
                                    />
                                  ) : null}
                                  <Icon className="relative z-10 h-4.5 w-4.5" />
                                </span>
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                  <div>
                                    <p
                                      className={cx(
                                        "text-[14px] font-extrabold",
                                        step.status === "pending"
                                          ? "text-[#718096]"
                                          : "text-[#132842]",
                                      )}
                                    >
                                      {step.stage}
                                    </p>
                                    <p className="mt-1 text-[12px] font-semibold leading-6 text-[#66758a]">
                                      {step.remarks ||
                                        (step.status === "pending"
                                          ? "This stage has not started yet."
                                          : "Status update received.")}
                                    </p>
                                  </div>
                                  <p className="shrink-0 text-[10px] font-bold text-[#98a6b6]">
                                    {step.updatedAt
                                      ? formatDate(step.updatedAt)
                                      : isActive || isBlocked || isDone
                                        ? formatDate(selected.updatedAt)
                                        : "Pending"}
                                  </p>
                                </div>
                                {step.updatedBy ? (
                                  <p className="text-[10px] font-extrabold uppercase text-[#147cc1]">
                                    Updated by {step.updatedBy}
                                  </p>
                                ) : null}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 bg-[#f8fbfd] px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                        <div className="flex items-center gap-2 text-[#52657c]">
                          <Landmark className="h-4 w-4 text-[#147cc1]" />
                          <p className="text-[11px] font-semibold">
                            Final completion and timelines remain subject to
                            applicable verification and partner policy.
                          </p>
                        </div>
                        <Link
                          href="/support"
                          className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-extrabold text-[#005ca8] no-underline"
                        >
                          Contact support
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </motion.aside>
                  ) : null}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 1, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.58, ease }}
                  className="grid overflow-hidden rounded-lg border border-[#dfe9f2] bg-[#f7fbff] lg:grid-cols-[1.15fr_0.85fr]"
                >
                  <div className="px-6 py-9 md:px-9 md:py-11">
                    <span className="flex h-14 w-14 items-center justify-center rounded-md bg-[#e3f1ff] text-[#005ca8]">
                      <ClipboardList className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-[22px] font-extrabold text-[#07162d] md:text-[25px]">
                      {emptyTitle}
                    </h3>
                    <p className="mt-3 max-w-xl text-[14px] font-medium leading-7 text-[#617186] md:text-[15px]">
                      {hasSearched
                        ? "No matching record was returned for the submitted details. Verify the service type, Query ID, and registered mobile number."
                        : viewerType
                          ? "New and updated applications linked to this account will appear here automatically."
                          : "Track a service request above, or sign in to securely view loan and insurance applications linked to your account."}
                    </p>
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      {tab !== "All" && items.length ? (
                        <button
                          type="button"
                          onClick={() => setTab("All")}
                          className="inline-flex h-11 items-center justify-center rounded-md bg-[#005ca8] px-5 text-[13px] font-extrabold text-white"
                        >
                          View all records
                        </button>
                      ) : !viewerType ? (
                        <Link
                          href="/login?referrer=/application-status"
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#005ca8] px-5 text-[13px] font-extrabold text-white no-underline"
                        >
                          Sign in to view applications
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : null}
                      <Link
                        href="/products"
                        className="inline-flex h-11 items-center justify-center rounded-md bg-white px-5 text-[13px] font-extrabold text-[#005ca8] no-underline"
                      >
                        Explore products
                      </Link>
                    </div>
                  </div>

                  <div className="bg-white px-6 py-8 md:px-8">
                    <p className="text-[11px] font-extrabold uppercase text-[#005ca8]">
                      Where to find your details
                    </p>
                    <div className="mt-5 grid gap-5">
                      {[
                        {
                          icon: Hash,
                          title: "Confirmation message",
                          text: "Your Query ID is shared after a service request is submitted.",
                        },
                        {
                          icon: Phone,
                          title: "Registered mobile",
                          text: "Use the same 10-digit number entered in the original form.",
                        },
                        {
                          icon: LockKeyhole,
                          title: "Account applications",
                          text: "Loan and insurance records are available after secure login.",
                        },
                      ].map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#eef6ff] text-[#147cc1]">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-[13px] font-extrabold text-[#263a53]">
                              {title}
                            </p>
                            <p className="mt-1 text-[11px] font-semibold leading-5 text-[#718096]">
                              {text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        <AppDownloadBanner />
      </main>
    </MotionConfig>
  );
}
