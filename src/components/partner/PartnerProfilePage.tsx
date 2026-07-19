"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bell,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  FileText,
  LogOut,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import {
  fetchPartnerClickSummary,
  fetchPartnerLeadEvents,
  fetchPartnerLeadSummary,
  fetchPartnerProfile,
  isPartnerLoggedIn,
  logoutPartner,
  type PartnerClickSummary,
  type PartnerLeadEvent,
  type PartnerLeadSummary,
  type PartnerProfile,
} from "@/services/partner";

const stringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const hasValue = (value: unknown) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const prettyLabel = (value?: string) => {
  const normalized = String(value || "")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
  if (!normalized) return "Not available";
  return normalized
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatINR = (value?: number) => {
  const amount = Number(value || 0);
  return `Rs. ${amount.toLocaleString("en-IN")}`;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getAddress = (profile?: PartnerProfile | null) => {
  const personal = profile?.kycProfile?.personalDetails || {};
  const addressDetails = profile?.kycProfile?.addressDetails || {};
  const current =
    ((addressDetails.currentAddress ||
      addressDetails.address ||
      addressDetails) as Record<string, unknown>) || {};
  return {
    line: stringValue(personal.address) || stringValue(current.street),
    city: stringValue(personal.city) || stringValue(current.city),
    state: stringValue(personal.state) || stringValue(current.state),
    pin:
      stringValue(personal.pinCode) ||
      stringValue(personal.pincode) ||
      stringValue(current.postalCode) ||
      stringValue(current.pincode),
  };
};

const getCompletion = (profile?: PartnerProfile | null) => {
  const completion = profile?.profileCompletion;
  if (completion?.totalFields) {
    return {
      completed: Number(completion.completedFields || 0),
      total: Number(completion.totalFields || 0),
      percent: Number(completion.completionPercent || 0),
      missing: completion.missingFields || [],
    };
  }

  const personal = profile?.kycProfile?.personalDetails || {};
  const employment = profile?.kycProfile?.employmentDetails || {};
  const bank = profile?.bankDetails || profile?.kycProfile?.bankDetails || {};
  const address = getAddress(profile);
  const required = [
    personal.fullName || profile?.name,
    personal.panNumber,
    personal.aadhaarNumber,
    personal.mobile || profile?.mobile,
    personal.email || profile?.email,
    address.line,
    address.city,
    address.state,
    address.pin,
    employment.employerName,
    employment.companyAddress,
    employment.totalExperience,
    bank.accountHolderName,
    bank.bankName,
    bank.accountType,
    bank.accountNumber,
    bank.ifscCode,
  ];
  const completed = required.filter(hasValue).length;
  const total = required.length || 1;
  return {
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    missing: [],
  };
};

const normalizePartner = (profile?: PartnerProfile | null) => {
  const personal = profile?.kycProfile?.personalDetails || {};
  const employment = profile?.kycProfile?.employmentDetails || {};
  const bank = profile?.bankDetails || profile?.kycProfile?.bankDetails || {};
  const address = getAddress(profile);
  const name =
    stringValue(personal.fullName) ||
    stringValue(profile?.name) ||
    "Partner";
  const businessName =
    stringValue(employment.employerName) ||
    stringValue(profile?.businessName) ||
    stringValue(profile?.companyName) ||
    "Business details pending";
  const mobile = stringValue(personal.mobile) || stringValue(profile?.mobile);
  const email = stringValue(personal.email) || stringValue(profile?.email);
  const avatar =
    stringValue(profile?.avatar) || stringValue(profile?.profilePictureUrl);
  const id =
    stringValue(profile?.agencyId) ||
    stringValue(profile?._id) ||
    stringValue(profile?.id);

  return {
    name,
    businessName,
    mobile: mobile ? `+91 ${mobile}` : "Mobile not available",
    email: email || "Email not available",
    avatar,
    initials: name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    id: id ? id.slice(-10) : "-",
    role: prettyLabel(stringValue(profile?.role) || "agency"),
    kycStatus:
      profile?.agentProfileCompleted || profile?.profileCompletion?.isComplete
        ? "Profile complete"
        : "Profile pending",
    completion: getCompletion(profile),
    rmName: stringValue(profile?.rmName) || "RM not assigned",
    rmMobile: stringValue(profile?.rmMobile) || "RM number not available",
    address,
    employment,
    bank,
  };
};

const partnerAccountTabs = [
  { key: "overview", label: "Overview", icon: ClipboardList },
  { key: "leads", label: "Leads", icon: BadgeCheck },
  { key: "profile", label: "Profile Details", icon: Building2 },
  { key: "bank", label: "Bank Details", icon: BriefcaseBusiness },
  { key: "documents", label: "Documents", icon: FileText },
] as const;

type PartnerAccountTab = (typeof partnerAccountTabs)[number]["key"];

export function PartnerProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [leadSummary, setLeadSummary] = useState<PartnerLeadSummary | null>(null);
  const [leadEvents, setLeadEvents] = useState<PartnerLeadEvent[]>([]);
  const [clickSummary, setClickSummary] = useState<PartnerClickSummary | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<PartnerAccountTab>("overview");
  const [message, setMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    setDashboardLoading(true);
    try {
      const [summaryResult, eventsResult, clickResult] =
        await Promise.allSettled([
          fetchPartnerLeadSummary(),
          fetchPartnerLeadEvents(),
          fetchPartnerClickSummary(),
        ]);

      if (summaryResult.status === "fulfilled") {
        setLeadSummary(summaryResult.value || null);
      }
      if (eventsResult.status === "fulfilled") {
        setLeadEvents(eventsResult.value?.result || []);
      }
      if (clickResult.status === "fulfilled") {
        setClickSummary(clickResult.value || null);
      }
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    if (!isPartnerLoggedIn()) {
      router.replace("/partner/login?redirect=/partner/profile");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const current = await fetchPartnerProfile();
      setProfile(current);
      await loadDashboard();
    } catch (error) {
      setMessage(
        (error as Error).message || "Unable to load partner profile right now.",
      );
    } finally {
      setLoading(false);
    }
  }, [loadDashboard, router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadProfile();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadProfile]);

  const partner = useMemo(() => normalizePartner(profile), [profile]);
  const leadData = leadSummary?.summary || {};
  const stageCounts = leadSummary?.stageCounts || {};
  const totalClicks = useMemo(
    () =>
      (clickSummary?.byAction || []).reduce(
        (sum, item) => sum + Number(item.count || 0),
        0,
      ),
    [clickSummary],
  );

  const kpis = [
    {
      label: "Total leads",
      value: Number(leadData.totalLeads || 0).toLocaleString("en-IN"),
      hint: `Active ${Number(leadData.activePipelineCount || 0)}`,
      icon: ClipboardList,
    },
    {
      label: "Disbursed",
      value: Number(leadData.disbursedCases || 0).toLocaleString("en-IN"),
      hint: formatINR(Number(leadData.disbursedValue || 0)),
      icon: BadgeCheck,
    },
    {
      label: "Potential value",
      value: formatINR(Number(leadData.potentialValue || 0)),
      hint: "Partner pipeline",
      icon: Banknote,
    },
    {
      label: "Click events",
      value: totalClicks.toLocaleString("en-IN"),
      hint: "Website and app actions",
      icon: WalletCards,
    },
  ];

  const profileRows = [
    ["Role", partner.role],
    ["Status", partner.kycStatus],
    ["Business name", partner.businessName],
    ["Company type", prettyLabel(stringValue(partner.employment.companyType))],
    ["Designation", stringValue(partner.employment.professionOrJobTitle)],
    ["Experience", stringValue(partner.employment.totalExperience)],
    [
      "Address",
      [
        partner.address.line,
        partner.address.city,
        partner.address.state,
        partner.address.pin,
      ]
        .filter(Boolean)
        .join(", "),
    ],
  ];

  const bankRows = [
    ["Account holder", stringValue(partner.bank.accountHolderName)],
    ["Bank name", stringValue(partner.bank.bankName)],
    ["Account type", stringValue(partner.bank.accountType)],
    ["Account number", stringValue(partner.bank.accountNumber)],
    ["IFSC", stringValue(partner.bank.ifscCode)],
    ["Cancelled cheque", stringValue(partner.bank.cancelledChequeUrl)],
  ];

  const documents = profile?.kycProfile?.documents || [];
  const missingFields = partner.completion.missing || [];
  const productBreakdown = leadSummary?.loanTypeBreakdown || [];
  const currentTab =
    partnerAccountTabs.find((item) => item.key === activeTab) ||
    partnerAccountTabs[0];

  const handleLogout = () => {
    logoutPartner();
    router.replace("/partner/login");
  };

  const renderLeadMovement = (limit?: number) => {
    const rows = typeof limit === "number" ? leadEvents.slice(0, limit) : leadEvents;
    return (
      <div className="grid gap-3">
        {rows.length ? (
          rows.map((event, index) => (
            <div
              key={event.id || event._id || `${event.loanId}-${index}`}
              className="grid gap-3 bg-[#f7fbff] p-4 md:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="text-[15px] font-extrabold text-[#07162d]">
                  {event.customerName || "Unnamed lead"}
                </p>
                <p className="mt-1 text-[13px] font-semibold text-[#667085]">
                  {prettyLabel(event.loanType)} | {prettyLabel(event.status)}
                  {event.loanId ? ` | ${event.loanId}` : ""}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-[15px] font-extrabold text-[#195585]">
                  {formatINR(event.loanAmount)}
                </p>
                <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                  {formatDate(event.updatedAt || event.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#f7fbff] p-5 text-[14px] font-semibold text-[#667085]">
            No lead movement is available yet.
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="h-auto bg-gray-100 xl:h-[calc(100dvh-6.75rem)] xl:overflow-hidden">
      <div className="mx-auto h-full max-w-9xl">
        <div className="grid min-h-0 gap-3 xl:h-full xl:grid-cols-[minmax(20rem,24rem)_minmax(0,1fr)] xl:gap-0">
          <aside className="grid gap-4 bg-white xl:h-full xl:overflow-y-auto xl:border-r xl:border-r-gray-200 xl:pr-3 scrollbar-thin">
            <section className="bg-white p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#195585] to-[#12b76a] text-[18px] font-extrabold text-white">
                  {partner.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    partner.initials || <UserRound className="h-6 w-6" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#195585]">
                    Partner Profile
                  </p>
                  <h1 className="mt-2 truncate text-[22px] font-extrabold leading-tight text-[#07162d]">
                    {partner.name}
                  </h1>
                  <p className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#667085]">
                    {partner.businessName}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-[12px] font-extrabold text-[#07162d]">
                  <span>Profile completion</span>
                  <span>{partner.completion.percent}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf3f8]">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-[#195585] to-[#12b76a]"
                    style={{ width: `${partner.completion.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-[12px] font-semibold text-[#667085]">
                  {partner.completion.completed}/{partner.completion.total} key
                  details saved
                </p>
              </div>

              <div className="mt-5 grid gap-3 text-[13px] font-semibold text-[#344054]">
                <InfoLine icon={<Phone className="h-4 w-4" />} value={partner.mobile} />
                <InfoLine icon={<FileText className="h-4 w-4" />} value={partner.email} />
                <InfoLine icon={<ShieldCheck className="h-4 w-4" />} value={`ID: ${partner.id}`} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <Link
                  href="/partner/profile/complete"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#195585] px-4 text-[13px] font-extrabold text-white no-underline"
                >
                  Edit profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#d7e5f3] bg-white px-4 text-[13px] font-extrabold text-[#344054]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
              <Link
                href="/partner/profile/notifications"
                className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#cfe0ed] bg-[#f6fbff] px-4 text-[12px] font-extrabold text-[#195585] no-underline transition hover:bg-[#eaf5ff]"
              >
                <Bell className="h-4 w-4" />
                View notifications
              </Link>
            </section>

            <section className="bg-white p-5">
              <p className="text-[13px] font-extrabold text-[#07162d]">
                Relationship Manager
              </p>
              <p className="mt-3 text-[16px] font-extrabold text-[#195585]">
                {partner.rmName}
              </p>
              <p className="mt-1 text-[13px] font-semibold text-[#667085]">
                {partner.rmMobile}
              </p>
            </section>

            <section className="bg-white p-5">
              <p className="text-[13px] font-extrabold text-[#07162d]">
                Account tabs
              </p>
              <div className="mt-3 grid gap-2">
                {partnerAccountTabs.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveTab(item.key)}
                      className={`flex h-11 items-center gap-3 px-3 text-left text-[13px] font-extrabold transition ${
                        isActive
                          ? "bg-[#195585] text-white"
                          : "bg-[#f7fbff] text-[#344054] hover:bg-[#edf6ff] hover:text-[#195585]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>

          <section className="min-w-0 bg-white xl:h-full xl:overflow-y-auto xl:pb-4 scrollbar-thin">
            <div className="border-b border-[#edf3f8] p-5 md:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-[#195585]">
                    Partner account
                  </p>
                  <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.02em] text-[#07162d] md:text-[36px]">
                    {currentTab.label}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void loadProfile()}
                    disabled={loading || dashboardLoading}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#d7e5f3] px-4 text-[13px] font-extrabold text-[#195585] disabled:opacity-60"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                  <Link
                    href="/partner/profile/complete"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#12b76a] px-4 text-[13px] font-extrabold text-white no-underline"
                  >
                    Complete details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              {message ? (
                <p className="mt-4 text-[13px] font-semibold text-[#b42318]">
                  {message}
                </p>
              ) : null}
            </div>

            {loading && !profile ? (
              <div className="p-7 text-[14px] font-semibold text-[#667085]">
                Loading partner profile...
              </div>
            ) : (
              <div className="grid gap-5 p-5 md:p-7">
                {partner.completion.percent < 100 && activeTab === "overview" ? (
                  <div className="flex flex-col gap-3 bg-[#fff8e6] p-4 ring-1 ring-[#ffe3a3] md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[15px] font-extrabold text-[#07162d]">
                        Complete your partner profile
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-[#667085]">
                        KYC, business, bank, and document details improve lead
                        handling and verification.
                      </p>
                    </div>
                    <Link
                      href="/partner/profile/complete"
                      className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#195585] px-4 text-[13px] font-extrabold text-white no-underline"
                    >
                      Continue setup
                    </Link>
                  </div>
                ) : null}

                {activeTab === "overview" ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {kpis.map(({ label, value, hint, icon: Icon }) => (
                        <div
                          key={label}
                          className="bg-[#f7fbff] p-4 ring-1 ring-[#e1edf8]"
                        >
                          <Icon className="h-5 w-5 text-[#195585]" />
                          <p className="mt-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                            {label}
                          </p>
                          <p className="mt-2 text-[24px] font-extrabold text-[#07162d]">
                            {value}
                          </p>
                          <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                            {hint}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
                      <section className="border border-[#e1edf8] bg-white p-5">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-5 w-5 text-[#195585]" />
                          <h3 className="text-[18px] font-extrabold text-[#07162d]">
                            Profile Snapshot
                          </h3>
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          {profileRows.slice(0, 6).map(([label, value]) => (
                            <DetailItem key={label} label={label} value={value} />
                          ))}
                        </div>
                      </section>

                      <section className="border border-[#e1edf8] bg-white p-5">
                        <div className="flex items-center gap-3">
                          <BriefcaseBusiness className="h-5 w-5 text-[#195585]" />
                          <h3 className="text-[18px] font-extrabold text-[#07162d]">
                            Lead Stages
                          </h3>
                        </div>
                        <div className="mt-5 grid gap-3">
                          {[
                            ["Pre-login", stageCounts.preLogin],
                            ["Login", stageCounts.login],
                            ["Sanction", stageCounts.sanction],
                            ["Disbursed", stageCounts.disbursed],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="flex items-center justify-between bg-[#f7fbff] px-4 py-3"
                            >
                              <span className="text-[13px] font-extrabold text-[#344054]">
                                {label}
                              </span>
                              <span className="text-[18px] font-extrabold text-[#195585]">
                                {Number(value || 0)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>

                    <section className="border border-[#e1edf8] bg-white p-5">
                      <div className="flex items-center gap-3">
                        <ClipboardList className="h-5 w-5 text-[#195585]" />
                        <h3 className="text-[18px] font-extrabold text-[#07162d]">
                          Recent Lead Movement
                        </h3>
                      </div>
                      <div className="mt-5">{renderLeadMovement(5)}</div>
                    </section>
                  </>
                ) : null}

                {activeTab === "leads" ? (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {kpis.map(({ label, value, hint, icon: Icon }) => (
                        <div
                          key={label}
                          className="bg-[#f7fbff] p-4 ring-1 ring-[#e1edf8]"
                        >
                          <Icon className="h-5 w-5 text-[#195585]" />
                          <p className="mt-4 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                            {label}
                          </p>
                          <p className="mt-2 text-[24px] font-extrabold text-[#07162d]">
                            {value}
                          </p>
                          <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                            {hint}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
                      <section className="border border-[#e1edf8] bg-white p-5">
                        <div className="flex items-center gap-3">
                          <BriefcaseBusiness className="h-5 w-5 text-[#195585]" />
                          <h3 className="text-[18px] font-extrabold text-[#07162d]">
                            Product Mix
                          </h3>
                        </div>
                        <div className="mt-5 grid gap-3">
                          {productBreakdown.length ? (
                            productBreakdown.slice(0, 8).map((row, index) => (
                              <div
                                key={`${stringValue(row.loanType)}-${index}`}
                                className="bg-[#f7fbff] px-4 py-3"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-[13px] font-extrabold text-[#344054]">
                                    {prettyLabel(stringValue(row.loanType))}
                                  </span>
                                  <span className="text-[16px] font-extrabold text-[#195585]">
                                    {Number(row.count || 0)}
                                  </span>
                                </div>
                                <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                                  {formatINR(Number(row.totalAmount || 0))}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="bg-[#f7fbff] p-5 text-[14px] font-semibold text-[#667085]">
                              No product mix available yet.
                            </div>
                          )}
                        </div>
                      </section>

                      <section className="border border-[#e1edf8] bg-white p-5">
                        <div className="flex items-center gap-3">
                          <ClipboardList className="h-5 w-5 text-[#195585]" />
                          <h3 className="text-[18px] font-extrabold text-[#07162d]">
                            Lead Movement
                          </h3>
                        </div>
                        <div className="mt-5">{renderLeadMovement()}</div>
                      </section>
                    </div>
                  </>
                ) : null}

                {activeTab === "profile" ? (
                  <section className="border border-[#e1edf8] bg-white p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-[#195585]" />
                        <h3 className="text-[18px] font-extrabold text-[#07162d]">
                          Profile Details
                        </h3>
                      </div>
                      <Link
                        href="/partner/profile/complete"
                        className="inline-flex h-10 items-center justify-center bg-[#195585] px-4 text-[13px] font-extrabold text-white no-underline"
                      >
                        Edit profile
                      </Link>
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {profileRows.map(([label, value]) => (
                        <DetailItem
                          key={label}
                          label={label}
                          value={value}
                          wide={label === "Address"}
                        />
                      ))}
                    </div>
                  </section>
                ) : null}

                {activeTab === "bank" ? (
                  <section className="border border-[#e1edf8] bg-white p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <BriefcaseBusiness className="h-5 w-5 text-[#195585]" />
                        <h3 className="text-[18px] font-extrabold text-[#07162d]">
                          Bank Details
                        </h3>
                      </div>
                      <Link
                        href="/partner/profile/complete"
                        className="inline-flex h-10 items-center justify-center bg-[#195585] px-4 text-[13px] font-extrabold text-white no-underline"
                      >
                        Edit bank
                      </Link>
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {bankRows.map(([label, value]) => (
                        <div key={label}>
                          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                            {label}
                          </p>
                          {String(value || "").startsWith("http") ? (
                            <Link
                              href={String(value)}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 inline-flex text-[14px] font-extrabold text-[#195585] no-underline"
                            >
                              View uploaded file
                            </Link>
                          ) : (
                            <p className="mt-1 min-h-6 text-[14px] font-extrabold text-[#07162d]">
                              {value || "Not available"}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}

                {activeTab === "documents" ? (
                  <section className="border border-[#e1edf8] bg-white p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[#195585]" />
                        <h3 className="text-[18px] font-extrabold text-[#07162d]">
                          Documents
                        </h3>
                      </div>
                      <Link
                        href="/partner/profile/complete"
                        className="inline-flex h-10 items-center justify-center bg-[#195585] px-4 text-[13px] font-extrabold text-white no-underline"
                      >
                        Upload documents
                      </Link>
                    </div>
                    <div className="mt-5 grid gap-3">
                      {documents.length ? (
                        documents.map((doc, index) => {
                          const url = stringValue(doc.fileUrl || doc.url);
                          return (
                            <div
                              key={`${stringValue(doc.docType)}-${index}`}
                              className="grid gap-3 bg-[#f7fbff] p-4 md:grid-cols-[1fr_auto]"
                            >
                              <div>
                                <p className="text-[15px] font-extrabold text-[#07162d]">
                                  {prettyLabel(stringValue(doc.docType))}
                                </p>
                                <p className="mt-1 text-[12px] font-semibold text-[#667085]">
                                  {stringValue(doc.referenceId || doc.name) ||
                                    "Uploaded document"}
                                </p>
                              </div>
                              {url ? (
                                <Link
                                  href={url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex h-10 items-center justify-center bg-white px-4 text-[13px] font-extrabold text-[#195585] no-underline"
                                >
                                  View
                                </Link>
                              ) : null}
                            </div>
                          );
                        })
                      ) : (
                        <div className="bg-[#f7fbff] p-5 text-[14px] font-semibold text-[#667085]">
                          No documents uploaded yet.
                        </div>
                      )}
                    </div>

                    {missingFields.length ? (
                      <div className="mt-6 bg-[#fff8e6] p-4 ring-1 ring-[#ffe3a3]">
                        <p className="text-[14px] font-extrabold text-[#07162d]">
                          Pending profile fields
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {missingFields.slice(0, 10).map((item) => (
                            <span
                              key={item}
                              className="bg-white px-3 py-1 text-[12px] font-bold text-[#667085]"
                            >
                              {prettyLabel(item)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </section>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoLine({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="text-[#195585]">{icon}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

function DetailItem({
  label,
  value,
  wide = false,
}: {
  label: string;
  value?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#667085]">
        {label}
      </p>
      <p className="mt-1 min-h-6 text-[14px] font-extrabold text-[#07162d]">
        {value || "Not available"}
      </p>
    </div>
  );
}
