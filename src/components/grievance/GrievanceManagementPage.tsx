"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  AlertCircle,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Clipboard,
  FileSearch,
  Hash,
  Mail,
  Loader2,
  MessageSquareText,
  Send,
  User,
  Phone,
  Search,
  ShieldCheck,
  TicketCheck,
} from "lucide-react";
import { legalPages } from "@/data/legalPages";
import { getAuthToken } from "@/hooks/authStorage";
import { buildWebsiteSourcePayload } from "@/lib/formConsent";

type GrievanceForm = {
  email: string;
  mobile: string;
  nature: string;
  fullName: string;
  description: string;
  applicationId: string;
};

type TrackedGrievance = {
  _id: string;
  ticketNumber: string;
  fullName: string;
  applicationId?: string;
  nature: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "escalated";
  resolutionNote?: string;
  slaDueAt: string;
  isOverdue: boolean;
  businessDaysOpen: number;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  comments: Array<{
    _id: string;
    authorType: string;
    message: string;
    createdAt: string;
  }>;
  statusHistory: Array<{
    _id: string;
    fromStatus?: string;
    toStatus: string;
    note?: string;
    createdAt: string;
  }>;
};

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  error?: string;
};

const initialForm: GrievanceForm = {
  fullName: "",
  mobile: "",
  email: "",
  applicationId: "",
  nature: "",
  description: "",
};

const natureOptions = [
  { value: "loan_application", label: "Loan application" },
  { value: "disbursement", label: "Loan approval or disbursement" },
  { value: "documents_kyc", label: "Documents or KYC" },
  { value: "payment_refund", label: "Payment, fee or refund" },
  { value: "insurance", label: "Insurance" },
  { value: "credit_card", label: "Credit card" },
  { value: "data_privacy", label: "Data privacy or account deletion" },
  { value: "customer_service", label: "Customer service" },
  { value: "staff_conduct", label: "Staff or agent conduct" },
  { value: "technical", label: "Website or technical issue" },
  { value: "other", label: "Other" },
];

const statusMeta = {
  open: {
    label: "Open",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  in_progress: {
    label: "In Progress",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  resolved: {
    label: "Resolved",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  escalated: {
    label: "Escalated",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const title = (value: string) =>
  String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
const dateTime = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
const nameRegex = /^[A-Za-z][A-Za-z\s.'-]{1,99}$/;
const mobileRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const parseResponse = async <T,>(response: Response) => {
  const result = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!response.ok) {
    throw new Error(
      result.message || result.error || "The request could not be completed.",
    );
  }
  return result;
};

export function GrievanceManagementPage() {
  const searchParams = useSearchParams();
  const initialTicket = String(searchParams.get("ticket") || "").toUpperCase();
  const [view, setView] = useState<"raise" | "track">(
    initialTicket ? "track" : "raise",
  );
  const [form, setForm] = useState<GrievanceForm>(initialForm);
  const [ticketNumber, setTicketNumber] = useState(initialTicket);
  const [credential, setCredential] = useState("");
  const [createdTicket, setCreatedTicket] = useState<{
    ticketNumber: string;
    slaDueAt: string;
  } | null>(null);
  const [tracked, setTracked] = useState<TrackedGrievance | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const updateForm = (key: keyof GrievanceForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const submitGrievance = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const mobile = form.mobile.trim().replace(/[\s-]/g, "");
    if (!nameRegex.test(form.fullName.trim())) {
      setError("Please enter a valid full name.");
      return;
    }
    if (!mobileRegex.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.nature) {
      setError("Please select the nature of your grievance.");
      return;
    }
    if (form.description.trim().length < 20) {
      setError("Please describe your grievance in at least 20 characters.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const token = getAuthToken();
      const response = await fetch("/backend-api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          fullName: form.fullName.trim(),
          mobile,
          email: form.email.trim().toLowerCase(),
          applicationId: form.applicationId.trim(),
          description: form.description.trim(),
          sourcePage: "/grievance",
          ...buildWebsiteSourcePayload("website_grievance_page"),
        }),
      });
      const result = await parseResponse<{
        ticketNumber: string;
        status: string;
        slaDueAt: string;
      }>(response);
      if (!result.data?.ticketNumber) {
        throw new Error("Ticket number was not generated.");
      }
      setCreatedTicket({
        ticketNumber: result.data.ticketNumber,
        slaDueAt: result.data.slaDueAt,
      });
      setTicketNumber(result.data.ticketNumber);
      setCredential(form.email.trim().toLowerCase());
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Your grievance could not be submitted.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const trackGrievance = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ticketNumber.trim() || !credential.trim()) {
      setError("Enter the ticket number and registered mobile or email.");
      return;
    }
    setTracking(true);
    setError("");
    setTracked(null);
    try {
      const response = await fetch("/backend-api/grievances/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketNumber: ticketNumber.trim().toUpperCase(),
          credential: credential.trim(),
        }),
      });
      const result = await parseResponse<TrackedGrievance>(response);
      if (!result.data) throw new Error("Complaint details were not returned.");
      setTracked(result.data);
    } catch (trackError) {
      setError(
        trackError instanceof Error
          ? trackError.message
          : "Complaint tracking failed.",
      );
    } finally {
      setTracking(false);
    }
  };

  const copyTicket = async () => {
    if (!createdTicket) return;
    await navigator.clipboard.writeText(createdTicket.ticketNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="bg-white">
      <section className="border-b border-[#e1eaf2] px-4 py-10 md:px-6 md:py-12 lg:px-8">
        <div className="mx-auto grid max-w-9xl items-start gap-9 lg:grid-cols-[0.86fr_1.14fr] lg:gap-14">
          <div className="lg:sticky lg:top-32">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#075cde]">
              Grievance Redressal
            </p>
            <h1 className="mt-3 max-w-xl text-[34px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#102c45] sm:text-[42px] md:text-[48px]">
              Raise and track your complaint
            </h1>
            <p className="mt-4 max-w-xl text-[14px] font-medium leading-7 text-[#657b8e] md:text-[16px]">
              Every complaint receives a unique ticket number, a
              seven-business-day SLA, and a trackable response from our
              grievance team.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[
                { icon: TicketCheck, text: "Unique complaint ticket" },
                { icon: Clock3, text: "7-business-day SLA" },
                { icon: Mail, text: "Email status updates" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 rounded-xl border border-[#dce7ef] bg-[#f8fbfd] p-3 text-[12px] font-bold text-[#34536b]"
                >
                  <Icon className="h-4 w-4 text-[#075cde]" />
                  {text}
                </div>
              ))}
            </div>
            <div className="relative mt-4 h-56 w-full max-w-xl sm:h-72">
              <Image
                src="/assets/contact/contact-hero.png"
                alt="Fintaraa grievance support"
                fill
                priority
                unoptimized
                className="object-contain object-left"
              />
            </div>
            <p className="mt-3 flex max-w-xl items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] font-semibold leading-5 text-amber-800">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              Never share an OTP, CVV, password or complete card details in your
              complaint.
            </p>
          </div>

          <section className="overflow-hidden rounded-3xl border border-[#dce7ef] bg-white">
            <div className="grid grid-cols-2 border-b border-[#e6edf3] bg-[#f8fafc] p-2">
              {[
                { key: "raise" as const, label: "Raise grievance", icon: Send },
                {
                  key: "track" as const,
                  label: "Track complaint",
                  icon: Search,
                },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => {
                    setView(key);
                    setError("");
                  }}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[13px] font-extrabold ${
                    view === key ? "bg-[#075cde] text-white" : "text-[#5d7285]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-7 md:p-8">
              {view === "raise" ? (
                <>
                  <div>
                    <h2 className="text-[23px] font-extrabold text-[#172f45]">
                      Complaint details
                    </h2>
                    <p className="mt-1.5 text-[13px] font-medium text-[#718598]">
                      We will email the ticket acknowledgement to the address
                      provided below.
                    </p>
                  </div>

                  {createdTicket ? (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[15px] font-extrabold">
                            Grievance registered successfully
                          </h3>
                          <p className="mt-1 text-[12px] leading-5">
                            Save this ticket number for tracking:
                          </p>
                          <button
                            type="button"
                            onClick={() => void copyTicket()}
                            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-2 font-mono text-[14px] font-extrabold text-emerald-800"
                          >
                            {createdTicket.ticketNumber}
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Clipboard className="h-4 w-4" />
                            )}
                          </button>
                          <p className="mt-3 text-[11px] font-semibold">
                            SLA due: {dateTime(createdTicket.slaDueAt)}
                          </p>
                          <button
                            type="button"
                            onClick={() => setView("track")}
                            className="mt-4 text-[12px] font-extrabold text-[#075cde]"
                          >
                            Track this complaint →
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <form
                    onSubmit={submitGrievance}
                    className="mt-5 grid gap-4"
                    noValidate
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <GrievanceField
                        label="Full Name"
                        value={form.fullName}
                        placeholder="Enter your name"
                        icon={User}
                        onChange={(value) => updateForm("fullName", value)}
                      />
                      <GrievanceField
                        label="Registered Mobile"
                        value={form.mobile}
                        placeholder="Enter 10-digit number"
                        type="tel"
                        icon={Phone}
                        onChange={(value) => updateForm("mobile", value)}
                      />
                      <GrievanceField
                        label="Email Address"
                        value={form.email}
                        placeholder="name@example.com"
                        type="email"
                        icon={Mail}
                        onChange={(value) => updateForm("email", value)}
                      />
                      <GrievanceField
                        label="Application ID (optional)"
                        value={form.applicationId}
                        placeholder="Application or reference ID"
                        icon={Hash}
                        onChange={(value) => updateForm("applicationId", value)}
                      />
                    </div>
                    <label className="grid gap-1.5">
                      <span className="text-[12px] font-bold text-[#344054]">
                        Nature of Grievance
                      </span>
                      <select
                        value={form.nature}
                        onChange={(event) =>
                          updateForm("nature", event.target.value)
                        }
                        className={fieldClass}
                      >
                        <option value="">Select complaint category</option>
                        {natureOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-[12px] font-bold text-[#344054]">
                        Complaint Description
                      </span>
                      <span className="relative">
                        <MessageSquareText className="absolute left-3.5 top-3.5 h-4 w-4 text-[#7b8da0]" />
                        <textarea
                          rows={6}
                          maxLength={5000}
                          value={form.description}
                          placeholder="Explain what happened, when it happened, and the resolution you expect"
                          onChange={(event) =>
                            updateForm("description", event.target.value)
                          }
                          className={`${fieldClass} min-h-36 resize-y py-3 pl-10 leading-6`}
                        />
                      </span>
                      <span className="text-right text-[10px] font-semibold text-[#8a9bab]">
                        {form.description.length}/5000
                      </span>
                    </label>
                    <FormError error={error} />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#13a653] px-6 text-[13px] font-extrabold text-white hover:bg-[#0f8f45] disabled:opacity-70 sm:w-fit"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Submit Grievance
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="text-[23px] font-extrabold text-[#172f45]">
                      Complaint tracker
                    </h2>
                    <p className="mt-1.5 text-[13px] font-medium text-[#718598]">
                      Enter the ticket number and registered email or mobile.
                    </p>
                  </div>
                  <form
                    onSubmit={trackGrievance}
                    className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                  >
                    <GrievanceField
                      label="Ticket Number"
                      value={ticketNumber}
                      placeholder="GRV-20260731-0001"
                      icon={TicketCheck}
                      onChange={(value) => setTicketNumber(value.toUpperCase())}
                    />
                    <GrievanceField
                      label="Registered Mobile or Email"
                      value={credential}
                      placeholder="Mobile or email"
                      icon={ShieldCheck}
                      onChange={setCredential}
                    />
                    <button
                      type="submit"
                      disabled={tracking}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#075cde] px-5 text-[13px] font-extrabold text-white disabled:opacity-70"
                    >
                      {tracking ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      Track
                    </button>
                  </form>
                  <FormError error={error} />
                  {tracked ? <TrackerResult grievance={tracked} /> : null}
                </>
              )}
            </div>
          </section>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f7fafc] px-4 py-14 md:px-6 md:py-18 lg:px-8">
        <div className="mx-auto max-w-9xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mt-4 text-[30px] font-extrabold tracking-tight text-[#102c45] sm:text-[36px]">
              How grievance redressal works
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[14px] font-medium leading-7 text-[#657b8e]">
              From submission to closure, every action stays attached to your
              ticket so you always know what is happening and what comes next.
            </p>
          </div>

          <div className="relative mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-[#cbdced] xl:block" />
            {[
              {
                number: "01",
                icon: Send,
                title: "Submit your concern",
                text: "Share the issue, registered details and application ID, if available.",
              },
              {
                number: "02",
                icon: TicketCheck,
                title: "Get a unique ticket",
                text: "Your ticket is generated instantly and the acknowledgement is emailed to you.",
              },
              {
                number: "03",
                icon: FileSearch,
                title: "Review & investigation",
                text: "Our team checks the case and coordinates with the relevant bank, NBFC or insurer.",
              },
              {
                number: "04",
                icon: CheckCircle2,
                title: "Resolution or escalation",
                text: "A resolution note is shared within the 7-business-day SLA, or the case is escalated.",
              },
            ].map(({ number, icon: Icon, title: stepTitle, text }) => (
              <article
                key={number}
                className="relative rounded-2xl border border-[#dce7ef] bg-white p-5"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl border-4 border-[#f7fafc] bg-[#075cde] text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-[12px] font-extrabold tracking-wider text-[#9bafc0]">
                    STEP {number}
                  </span>
                </div>
                <h3 className="mt-5 text-[16px] font-extrabold text-[#18364e]">
                  {stepTitle}
                </h3>
                <p className="mt-2 text-[12px] font-medium leading-6 text-[#657b8e]">
                  {text}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-3xl border border-[#dce7ef] bg-white p-5 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#075cde]">
                    Service commitment
                  </p>
                  <h3 className="mt-2 text-[22px] font-extrabold text-[#18364e]">
                    What you can expect
                  </h3>
                </div>
                <span className="hidden rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-extrabold text-emerald-700 sm:inline-flex">
                  7 business days
                </span>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {[
                  {
                    label: "On submission",
                    title: "Instant acknowledgement",
                    text: "Ticket number and tracking access",
                  },
                  {
                    label: "During review",
                    title: "Visible progress",
                    text: "Status updates and team responses",
                  },
                  {
                    label: "At closure",
                    title: "Written resolution",
                    text: "Outcome and resolution note on record",
                  },
                ].map(({ label, title: itemTitle, text }, index) => (
                  <div
                    key={label}
                    className="relative border-l-2 border-[#dbe8f3] pl-4"
                  >
                    <span className="absolute -left-1.75 top-0 h-3 w-3 rounded-full border-2 border-white bg-[#075cde]" />
                    <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#8194a5]">
                      {label}
                    </p>
                    <p className="mt-2 text-[14px] font-extrabold text-[#28465d]">
                      {itemTitle}
                    </p>
                    <p className="mt-1 text-[11px] font-medium leading-5 text-[#718598]">
                      {text}
                    </p>
                    {index < 2 ? null : (
                      <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700">
                        <Check className="h-3.5 w-3.5" />
                        Visible in tracker
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-blue-200 bg-[#eef6ff] p-5 sm:p-7">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#075cde]">
                Need assisted support?
              </p>
              <h3 className="mt-2 text-[20px] font-extrabold text-[#18364e]">
                We are here to help
              </h3>
              <p className="mt-2 text-[12px] font-medium leading-6 text-[#60778a]">
                Keep your ticket number ready when contacting the grievance team
                so we can locate your complaint quickly.
              </p>
              <div className="mt-5 grid gap-2">
                <a
                  href="mailto:customercare@fintaraa.com"
                  className="flex items-center gap-3 rounded-xl border border-blue-200 bg-white px-4 py-3 text-[12px] font-extrabold text-[#23445e]"
                >
                  <Mail className="h-4 w-4 text-[#075cde]" />
                  customercare@fintaraa.com
                </a>
                <a
                  href="tel:+918448282680"
                  className="flex items-center gap-3 rounded-xl border border-blue-200 bg-white px-4 py-3 text-[12px] font-extrabold text-[#23445e]"
                >
                  <Phone className="h-4 w-4 text-[#075cde]" />
                  +91 84482 82680
                </a>
              </div>
            </article>
          </div>

          <div className="mt-10 border-t border-[#dce7ef] pt-9">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#075cde]">
                  Policy details
                </p>
                <h3 className="mt-2 text-[24px] font-extrabold text-[#18364e]">
                  Everything you need to know
                </h3>
              </div>
              <p className="max-w-md text-[12px] font-medium leading-6 text-[#718598] sm:text-right">
                Open any topic for detailed timelines, investigation, escalation
                and compliance information.
              </p>
            </div>
            <div className="mt-6 grid items-start gap-3 lg:grid-cols-2">
              {legalPages.grievance.sections.map((section, index) => (
                <details
                  key={section.title}
                  className="group rounded-2xl border border-[#dce7ef] bg-white px-5 py-4 open:border-blue-200"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eef5fb] font-mono text-[10px] font-extrabold text-[#075cde]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[13px] font-extrabold text-[#18364e]">
                      {section.title}
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#7d91a3] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 border-t border-[#edf2f6] pt-4 whitespace-pre-line text-[12px] font-medium leading-6 text-[#60778a]">
                    {section.body}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const fieldClass =
  "h-11 w-full rounded-xl border border-[#d8e3ed] bg-white px-3 text-[13px] font-semibold text-[#172033] outline-none transition placeholder:font-medium placeholder:text-[#9aa8b6] focus:border-[#075cde] focus:ring-3 focus:ring-[#075cde]/10";

function GrievanceField({
  label,
  value,
  placeholder,
  type = "text",
  icon: Icon,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
  icon: typeof User;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[12px] font-bold text-[#344054]">{label}</span>
      <span className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b8da0]" />
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldClass} pl-10`}
        />
      </span>
    </label>
  );
}

function FormError({ error }: { error: string }) {
  if (!error) return null;
  return (
    <p
      role="alert"
      className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] font-bold leading-5 text-red-700"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      {error}
    </p>
  );
}

function TrackerResult({ grievance }: { grievance: TrackedGrievance }) {
  const meta = statusMeta[grievance.status];
  const timeline = [
    ...grievance.statusHistory.map((item) => ({
      key: `status-${item._id}`,
      type: "status" as const,
      title: `Status changed to ${title(item.toStatus)}`,
      message: item.note || "",
      createdAt: item.createdAt,
    })),
    ...grievance.comments.map((item) => ({
      key: `comment-${item._id}`,
      type: "comment" as const,
      title: "Response from grievance team",
      message: item.message,
      createdAt: item.createdAt,
    })),
  ].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );

  return (
    <div className="mt-6 space-y-4 border-t border-[#e6edf3] pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[13px] font-extrabold text-[#075cde]">
            {grievance.ticketNumber}
          </p>
          <h3 className="mt-1 text-[20px] font-extrabold text-[#172f45]">
            {title(grievance.nature)}
          </h3>
          <p className="mt-1 text-[12px] text-[#718598]">
            Submitted {dateTime(grievance.createdAt)}
            {grievance.applicationId
              ? ` · Application ${grievance.applicationId}`
              : ""}
          </p>
        </div>
        <span
          className={`w-fit rounded-full border px-3 py-1.5 text-[11px] font-extrabold ${meta.className}`}
        >
          {meta.label}
        </span>
      </div>

      <div
        className={`grid gap-3 rounded-2xl border p-4 sm:grid-cols-3 ${
          grievance.isOverdue
            ? "border-red-200 bg-red-50"
            : "border-[#dce7ef] bg-[#f8fbfd]"
        }`}
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#7b8da0]">
            SLA due
          </p>
          <p className="mt-1 text-[12px] font-extrabold text-[#294860]">
            {dateTime(grievance.slaDueAt)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#7b8da0]">
            Business days open
          </p>
          <p className="mt-1 text-[12px] font-extrabold text-[#294860]">
            {grievance.businessDaysOpen}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#7b8da0]">
            SLA status
          </p>
          <p
            className={`mt-1 text-[12px] font-extrabold ${
              grievance.isOverdue ? "text-red-700" : "text-emerald-700"
            }`}
          >
            {grievance.isOverdue ? "Overdue" : "Within SLA"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#dce7ef] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#7b8da0]">
          Your complaint
        </p>
        <p className="mt-2 whitespace-pre-line text-[13px] font-medium leading-6 text-[#425e73]">
          {grievance.description}
        </p>
      </div>

      {grievance.resolutionNote ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-[12px] font-extrabold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            Resolution note
          </p>
          <p className="mt-2 whitespace-pre-line text-[13px] font-medium leading-6 text-emerald-900">
            {grievance.resolutionNote}
          </p>
        </div>
      ) : null}

      <div>
        <h4 className="text-[14px] font-extrabold text-[#172f45]">
          Complaint timeline
        </h4>
        <div className="mt-3 space-y-3">
          {timeline.map((item) => (
            <article
              key={item.key}
              className="flex gap-3 rounded-2xl border border-[#e2eaf1] p-4"
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  item.type === "comment"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.type === "comment" ? (
                  <MessageSquareText className="h-4 w-4" />
                ) : (
                  <Clock3 className="h-4 w-4" />
                )}
              </span>
              <div>
                <p className="text-[12px] font-extrabold text-[#294860]">
                  {item.title}
                </p>
                {item.message ? (
                  <p className="mt-1 whitespace-pre-line text-[12px] font-medium leading-5 text-[#667d90]">
                    {item.message}
                  </p>
                ) : null}
                <p className="mt-1 text-[10px] font-semibold text-[#94a3b0]">
                  {dateTime(item.createdAt)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {grievance.isOverdue ? (
        <p className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[11px] font-semibold leading-5 text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          This complaint has crossed the seven-business-day SLA and is flagged
          for priority review.
        </p>
      ) : null}
    </div>
  );
}
